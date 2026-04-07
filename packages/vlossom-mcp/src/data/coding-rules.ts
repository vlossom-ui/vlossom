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
    {
        id: "R16",
        category: "styling",
        severity: "recommended",
        rule: "Type StyleSet objects with the component's StyleSet interface. `const s: VsButtonStyleSet = { component: { padding: '1rem' } }`. Enables autocomplete and catches invalid properties at compile time.",
    },
    {
        id: "R17",
        category: "styling",
        severity: "recommended",
        rule: "StyleSets reused across multiple components must be defined as named presets in `createVlossom({ styleSet: { myPreset: { ... } } })` and referenced via `style-set=\"myPreset\"`. Inline objects are for one-off overrides only.",
    },
    {
        id: "R18",
        category: "vlossom",
        severity: "critical",
        rule: "Form input validation feedback must use the `:state` and `:state-message` props (`'idle' | 'info' | 'success' | 'warning' | 'error'`). Never render custom error message elements alongside Vlossom inputs.",
    },
    {
        id: "R19",
        category: "vlossom",
        severity: "recommended",
        rule: "Propagate `color-scheme` prop from parent to child Vlossom components via `:color-scheme=\"colorScheme\"`. Never hardcode a color-scheme value inside a reusable component.",
    },
    {
        id: "R20",
        category: "vlossom",
        severity: "recommended",
        rule: "Single-component responsive width: use `VsResponsive` or the component's own `:width` prop (e.g. `:width=\"{ xs: '100%', md: '50%' }\"`). Do not wrap a single component in a `<div>` with CSS width.",
    },
    {
        id: "R21",
        category: "vlossom",
        severity: "recommended",
        rule: "Plugin APIs (`$vsModal`, `$vsToast`, etc.) must be called inside composables or service functions, not directly in `<script setup>`. Access via `useVlossom()` or inject through a wrapper composable.",
    },
    {
        id: "R22",
        category: "structure",
        severity: "recommended",
        rule: "Define component props as a named TypeScript interface: `interface Props { label: string }` then `defineProps<Props>()`. Avoid anonymous inline type literals in `defineProps`.",
    },
    {
        id: "R23",
        category: "structure",
        severity: "recommended",
        rule: "Type `defineEmits` with an explicit call signature: `defineEmits<{ change: [value: string]; submit: [] }>()`. Avoid string-array form (`defineEmits(['change'])`) which loses type safety.",
    },
    {
        id: "R24",
        category: "quality",
        severity: "recommended",
        rule: "Use `v-model` shorthand instead of `:model-value` + `@update:modelValue` binding pair. For multiple v-model bindings use the named form: `v-model:checked=\"isChecked\"`.",
    },
];
