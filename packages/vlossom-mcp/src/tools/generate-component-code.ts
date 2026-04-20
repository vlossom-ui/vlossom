import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import { CODING_RULES, type CodingRule } from "../data/coding-rules.js";

const FORM_INPUT_COMPONENTS = new Set([
  "VsInput",
  "VsTextarea",
  "VsSelect",
  "VsCheckbox",
  "VsCheckboxSet",
  "VsRadio",
  "VsRadioSet",
  "VsSwitch",
  "VsToggle",
  "VsFileDrop",
  "VsSearchInput",
]);

/**
 * 컴포넌트 조합과 비즈니스 로직 유무에 따라 이 시나리오에 "실제로 적용되는" rule ID들을 산출한다.
 * applicable 모드에서 rules 배열을 필터링하는 기준으로 쓰이고, full 모드에서도 applicableRules 필드로 함께 반환된다.
 */
function determineApplicableRuleIds(
  components: string[],
  hasBusinessLogic: boolean,
): string[] {
  const ids = new Set<string>(["R01", "R02", "R03", "R04"]); // styling 기본
  const hasFormContext =
    components.includes("VsForm") ||
    components.some((c) => FORM_INPUT_COMPONENTS.has(c));
  if (hasFormContext) {
    ids.add("R05");
    ids.add("R06");
    ids.add("R07");
    ids.add("R08");
  }
  if (hasBusinessLogic) {
    ids.add("R09");
    ids.add("R10");
  }
  ids.add("R11");
  ids.add("R12");
  return [...ids].sort();
}

function buildImports(components: string[]): string {
  const vueImports: string[] = ["ref"];
  const hasForm = components.includes("VsForm");
  if (hasForm) {
    vueImports.push("useTemplateRef");
  }

  const vueImportLine = `import { ${vueImports.join(", ")} } from 'vue'`;
  const vlossomImportLine = `import { ${components.join(", ")} } from 'vlossom'`;

  return `${vueImportLine}\n${vlossomImportLine}`;
}

function buildFormSkeleton(components: string[]): string {
  return `<template>
  <vs-form ref="formRef">
    <!-- R07: VsForm + useTemplateRef + validate() pattern -->
    <!-- Add VsInput, VsSelect, etc. with v-model (R06) and :rules prop (R07) -->
    <!-- Use :grid="{ xs: 12, md: 6 }" for responsive layout (R09) -->
    <vs-button @click="handleSubmit">Submit</vs-button>
  </vs-form>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
// R01: named import from 'vlossom'
import { ${components.join(", ")} } from 'vlossom'
// R12: business logic in composable
// import { use{Feature} } from './use{Feature}'

const formRef = useTemplateRef('formRef')
// R07: validation rules — (v: unknown) => string | true
// const requiredRule = (v: unknown) => !!v || 'This field is required'

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (!valid) return
  // R12: delegate to composable
}
</script>
<!-- R02: no <style> block targeting .vs-* selectors -->`;
}

function buildDisplaySkeleton(components: string[]): string {
  return `<template>
  <div>
    <!-- Add Vlossom components here -->
    <!-- Use :style-set prop for styling (R02, R03) -->
    <!-- Use color-scheme prop instead of hardcoded colors (R10) -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// R01: named import from 'vlossom'
// import { ${components.join(", ")} } from 'vlossom'

// R06: bind with v-model for form inputs
// R12: extract business logic into composables
</script>
<!-- R02: no <style> block targeting .vs-* selectors -->`;
}

function extractFeatureName(description: string): string {
  const words = description
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, "")
    .split(/\s+/)
    .filter((w) => w.length > 1)
    .slice(0, 2);

  return words.map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join("");
}

function buildComposablePattern(description: string): string {
  const featureName = extractFeatureName(description) || "Feature";

  return `// use${featureName}.ts — separate file
import { ref } from 'vue'
import type { Ref } from 'vue'

export function use${featureName}(formRef: Ref<{ validate: () => Promise<boolean> } | null>) {
  // state
  const isLoading = ref(false)

  // validation rules (R11)
  const requiredRule = (v: unknown) => !!v || 'This field is required'

  // action — API call goes here, not in the component (R08, R15)
  async function handleSubmit() {
    const valid = await formRef.value?.validate()
    if (!valid) return
    isLoading.value = true
    try {
      // await api.someAction(...)
    } finally {
      isLoading.value = false
    }
  }

  return { isLoading, requiredRule, handleSubmit }
}`;
}

export function registerGenerateComponentCode(server: McpServer): void {
  server.tool(
    "generate_component_code",
    "ALWAYS call search_components and get_component before this to gather component metadata. " +
      "Call this when the user is ready to generate a Vlossom Vue SFC and needs coding rules and a scaffold. " +
      "Returns Vlossom-specific coding rules (only those applicable to the given components by default), an import statement, a code skeleton, and optional composable pattern. " +
      "Pass rulesFormat='full' to receive all 12 rules regardless of relevance. " +
      "Then pass the rules and skeleton directly to code generation.",
    {
      description: z
        .string()
        .describe(
          "What to build, e.g. 'email/password login form with validation'",
        ),
      components: z
        .array(z.string())
        .describe(
          "Component names to use, e.g. ['VsForm','VsInput','VsButton']",
        ),
      hasBusinessLogic: z
        .boolean()
        .optional()
        .default(false)
        .describe(
          "Set true if the component needs API calls, data fetching, or complex state — generates a composable pattern and enables R09/R10",
        ),
      rulesFormat: z
        .enum(["applicable", "full"])
        .optional()
        .default("applicable")
        .describe(
          "'applicable' (default): return only rules relevant to the component set — smaller, focused response. 'full': return all 12 CODING_RULES regardless of relevance.",
        ),
    },
    async ({ description, components, hasBusinessLogic, rulesFormat }) => {
      const start = Date.now();

      const hasForm = components.includes("VsForm");
      const imports = buildImports(components);
      const skeleton = hasForm
        ? buildFormSkeleton(components)
        : buildDisplaySkeleton(components);

      const applicableRuleIds = determineApplicableRuleIds(
        components,
        hasBusinessLogic,
      );
      const applicableSet = new Set(applicableRuleIds);
      const rules: CodingRule[] =
        rulesFormat === "full"
          ? CODING_RULES
          : CODING_RULES.filter((r) => applicableSet.has(r.id));

      const styleSetGuidance =
        "Apply styles exclusively via :style-set prop. " +
        "Inline object: :style-set=\"{ component: { padding: '1rem' } }\". " +
        'Named preset: style-set="myPreset" (configured in createVlossom()). ' +
        "Do NOT add a <style> block (R03) or inline style= attribute (R04).";

      const designGuidance =
        "If the user has not provided a design reference (Figma file, screenshot, or style description), " +
        "proactively suggest: 1) Browse dribbble.com or mobbin.com for '" +
        description +
        "' design inspiration, " +
        "2) Share a Figma file URL for precise design-to-code conversion via Figma MCP tools, " +
        "3) Describe desired visual style (minimal, corporate, playful, etc.). " +
        "Without design input, use Vlossom defaults: VsGrid 12-column layout, 1.5rem+ spacing, " +
        "color-scheme='blue' for primary actions, VsBlock for cards, VsDivider for separation.";

      const typeMappingGuidance =
        "When the user has existing TypeScript interfaces, map fields to Vlossom component data: " +
        "VsTable → { key: fieldName, label: displayName } columns array. " +
        "VsSelect → { label: displayField, value: idField } options array. " +
        "VsCheckboxSet/VsRadioSet → same options shape. " +
        "VsPagination → use array.length for :length prop. " +
        "Always derive mappings from get_component props metadata, not from assumptions.";

      const result: Record<string, unknown> = {
        rules,
        applicableRules: applicableRuleIds,
        rulesFormat,
        totalRuleCount: CODING_RULES.length,
        imports,
        skeleton,
        styleSetGuidance,
        designGuidance,
        typeMappingGuidance,
        avoid: [
          "Do not add a <style> block — all styles go through :style-set prop or --vs-* tokens",
          'Do not use Options API or defineComponent — use <script setup lang="ts">',
          "Do not put API calls or business logic directly in the component — use composables",
          "Do not build custom form validation logic — use VsForm + :rules pattern",
          "Do not render custom error elements alongside Vlossom inputs — use :state/:state-message",
          "Do not hardcode colors — use color-scheme prop for theming",
        ],
        next_actions: [
          {
            tool: "get_css_tokens",
            reason:
              "find --vs-* design tokens to use as StyleSet variable values",
          },
          {
            tool: "generate_style_set",
            reason:
              "create a StyleSet scaffold for any component in the generated code",
          },
          {
            tool: "validate_component_usage",
            reason: "check the generated code against Vlossom conventions",
          },
        ],
      };

      if (hasBusinessLogic) {
        result.composablePattern = buildComposablePattern(description);
      }

      const shortDescription =
        description.length > 28 ? description.slice(0, 25) + "…" : description;
      const meta = recordStep(
        "generate_component_code",
        `Generate: ${shortDescription}`,
        Date.now() - start,
        { summary: `scaffold + ${rules.length}/${CODING_RULES.length} rules` },
      );

      return textResponse(result, meta);
    },
  );
}
