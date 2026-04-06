import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import { CODING_RULES, type CodingRule } from "../data/coding-rules.js";

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
                next_actions: [
                    { tool: "get_css_tokens", reason: "find --vs-* design tokens to use as StyleSet variable values" },
                    { tool: "generate_style_set", reason: "create a StyleSet scaffold for any component in the generated code" },
                    { tool: "validate_component_usage", reason: "check the generated code against Vlossom conventions" },
                ],
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
