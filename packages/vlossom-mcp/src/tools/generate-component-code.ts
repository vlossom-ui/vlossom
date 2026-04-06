import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";

interface CodingRule {
    id: string;
    category: "import" | "styling" | "structure" | "vlossom" | "quality";
    severity: "critical" | "recommended";
    rule: string;
}

const CODING_RULES: CodingRule[] = [
    {
        id: "R01",
        category: "import",
        severity: "critical",
        rule: "Named import only — `import { VsButton, VsInput } from 'vlossom'`. Never default import or VlossomComponents map.",
    },
    {
        id: "R02",
        category: "import",
        severity: "recommended",
        rule: "`createVlossom()` goes in main.ts only. Never import or call it inside a component file.",
    },
    {
        id: "R03",
        category: "styling",
        severity: "critical",
        rule: "No `<style>` block in the SFC. All custom styles go through the `:style-set` prop.",
    },
    {
        id: "R04",
        category: "styling",
        severity: "critical",
        rule: "No inline `style=\"\"` attribute on Vlossom components. Use StyleSet or CSS tokens.",
    },
    {
        id: "R05",
        category: "styling",
        severity: "recommended",
        rule: "No hardcoded hex/rgb/hsl color values. Use `color-scheme` prop or `--vs-*` CSS tokens.",
    },
    {
        id: "R06",
        category: "structure",
        severity: "recommended",
        rule: "Target ≤ 200 lines per SFC. Extract to composable or child component if exceeded.",
    },
    {
        id: "R07",
        category: "structure",
        severity: "critical",
        rule: "Use `<script setup lang=\"ts\">`. Avoid Options API or `defineComponent`.",
    },
    {
        id: "R08",
        category: "structure",
        severity: "critical",
        rule: "Business logic (API calls, data fetching, complex transformations) must live in a composable (`use{Feature}.ts`) or service (`{feature}.service.ts`). Not inside the component.",
    },
    {
        id: "R09",
        category: "structure",
        severity: "recommended",
        rule: "Composable filename: `use{Feature}.ts`. Service filename: `{feature}.service.ts`.",
    },
    {
        id: "R10",
        category: "vlossom",
        severity: "critical",
        rule: "Forms use `VsForm` with `ref` + `formRef.value?.validate()` pattern. Never build custom form logic inline.",
    },
    {
        id: "R11",
        category: "vlossom",
        severity: "critical",
        rule: "Validation uses `:rules=\"[fn1, fn2]\"` array. Each function signature: `(v: unknown) => string | true`. Empty string or true = pass; string message = fail.",
    },
    {
        id: "R12",
        category: "vlossom",
        severity: "recommended",
        rule: "Responsive layout: wrap in `VsGrid` + use `:grid=\"{ xs: 12, md: 6 }\"` on each input. Do not use raw CSS grid/flex for Vlossom component layout.",
    },
    {
        id: "R13",
        category: "vlossom",
        severity: "recommended",
        rule: "Plugin APIs (`$vsModal`, `$vsToast`, `$vsAlert`, `$vsConfirm`, `$vsPrompt`) are accessed via the vlossom plugin instance. Do not import them.",
    },
    {
        id: "R14",
        category: "quality",
        severity: "recommended",
        rule: "Prefer declarative template patterns: `v-if`, `v-for`, `v-model`, `computed`. Avoid imperative DOM manipulation.",
    },
    {
        id: "R15",
        category: "quality",
        severity: "critical",
        rule: "Single responsibility — the component handles UI and interaction only. Data fetching, business rules, and state management belong in composables or services.",
    },
];

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
    <!-- R10: VsForm ref pattern -->
    <!-- Add VsInput, VsSelect, etc. with :rules prop (R11) -->
    <!-- Use :grid="{ xs: 12, md: 6 }" for responsive layout (R12) -->
    <vs-button @click="handleSubmit">Submit</vs-button>
  </vs-form>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue'
// R01: named import
import { ${components.join(", ")} } from 'vlossom'
// R08: business logic in composable
// import { use{Feature} } from './use{Feature}'

const formRef = useTemplateRef('formRef')
// R11: validation rules
// const requiredRule = (v: unknown) => !!v || 'This field is required'

async function handleSubmit() {
  const valid = await formRef.value?.validate()
  if (!valid) return
  // delegate to composable (R15)
}
</script>
<!-- R03: no <style> block -->`;
}

function buildDisplaySkeleton(components: string[]): string {
    return `<template>
  <div>
    <!-- Add Vlossom components here -->
    <!-- Use :style-set prop for styling (R03, R04) -->
    <!-- Use color-scheme prop instead of hardcoded colors (R05) -->
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
// R01: named import
// import { ${components.join(", ")} } from 'vlossom'

// R07: script setup lang="ts"
// R14: prefer computed/v-model over imperative DOM
</script>
<!-- R03: no <style> block -->`;
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
        "ALWAYS call suggest_components and get_component before this to gather component metadata. " +
            "Call this when the user is ready to generate a Vlossom Vue SFC and needs coding rules and a scaffold. " +
            "Returns Vlossom-specific coding rules, an import statement, a code skeleton, and optional composable pattern. " +
            "Then pass the rules and skeleton directly to code generation.",
        {
            description: z.string().describe("What to build, e.g. 'email/password login form with validation'"),
            components: z
                .array(z.string())
                .describe("Component names to use, e.g. ['VsForm','VsInput','VsButton']"),
            hasBusinessLogic: z
                .boolean()
                .optional()
                .default(false)
                .describe(
                    "Set true if the component needs API calls, data fetching, or complex state — generates a composable pattern"
                ),
        },
        async ({ description, components, hasBusinessLogic }) => {
            const start = Date.now();

            const hasForm = components.includes("VsForm");
            const imports = buildImports(components);
            const skeleton = hasForm ? buildFormSkeleton(components) : buildDisplaySkeleton(components);

            const styleSetGuidance =
                "Apply styles exclusively via :style-set prop. " +
                "Inline object: :style-set=\"{ component: { padding: '1rem' } }\". " +
                "Named preset: style-set=\"myPreset\" (configured in createVlossom()). " +
                'Do NOT add a <style> block (R03) or inline style= attribute (R04).';

            const result: Record<string, unknown> = {
                rules: CODING_RULES,
                imports,
                skeleton,
                styleSetGuidance,
                next_action: "get_css_tokens",
                next_action_message:
                    "Call get_css_tokens to find --vs-* design tokens to use as values in your styleSet.",
            };

            if (hasBusinessLogic) {
                result.composablePattern = buildComposablePattern(description);
            }

            const shortDescription = description.length > 28 ? description.slice(0, 25) + "…" : description;
            const meta = recordStep(
                "generate_component_code",
                `Generate: ${shortDescription}`,
                Date.now() - start
            );

            return textResponse(result, meta);
        }
    );
}
