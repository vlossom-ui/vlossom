export interface CodingRule {
    id: string;
    category: "import" | "styling" | "structure" | "vlossom" | "quality";
    severity: "critical" | "recommended";
    rule: string;
}

export const CODING_RULES: CodingRule[] = [
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
