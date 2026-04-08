export interface CodingRule {
    id: string;
    category: "styling" | "vlossom" | "structure" | "design";
    severity: "critical" | "recommended";
    rule: string;
}

export const CODING_RULES: CodingRule[] = [
    // --- Styling (StyleSet & tokens) ---
    {
        id: "R01",
        category: "styling",
        severity: "critical",
        rule: "All Vlossom component customization goes through the `:style-set` prop or `--vs-*` CSS tokens. Never use inline `style=\"\"` on Vlossom components. Do not target `.vs-*` selectors in a `<style>` block — Vlossom class names are internal and may change. Custom CSS in `<style>` should only target your own selectors.",
    },
    {
        id: "R02",
        category: "styling",
        severity: "critical",
        rule: "StyleSet objects have up to 3 property types: `variables` (maps to CSS custom properties), `component` or named elements like `title`/`content` (CSSProperties objects), and child component StyleSets (e.g. `loading`, `dimmed`). Example: `:style-set=\"{ variables: { padding: '1rem' }, component: { backgroundColor: 'red' }, loading: { ... } }\"`. Check the component's `Vs{Name}StyleSet` interface for available properties.",
    },
    {
        id: "R03",
        category: "styling",
        severity: "recommended",
        rule: "Type StyleSet objects with the component's interface (e.g. `const s: VsButtonStyleSet = { ... }`). Reusable StyleSets go in `createVlossom({ styleSet: { preset: { ... } } })` and are referenced via `style-set=\"preset\"`. Inline objects are for one-off overrides only.",
    },
    {
        id: "R04",
        category: "styling",
        severity: "recommended",
        rule: "When referencing Vlossom design tokens in custom CSS, use `--vs-*` variables: `var(--vs-comp-bg)`, `var(--vs-comp-font)`, `var(--vs-line-color)`, `var(--vs-primary-comp-bg)`. Never hardcode colors that Vlossom already provides as tokens — this breaks dark mode and theming.",
    },
    // --- Vlossom component patterns ---
    {
        id: "R05",
        category: "vlossom",
        severity: "critical",
        rule: "Bind Vlossom form inputs with `v-model`. Each input (VsInput, VsSelect, VsCheckbox, etc.) requires `v-model` for VsForm validation to work. Some components support named v-model bindings (e.g. `v-model:page`, `v-model:selected-items` on VsTable).",
    },
    {
        id: "R06",
        category: "vlossom",
        severity: "critical",
        rule: "Use `VsForm` for forms: obtain a ref via `useTemplateRef('formRef')` and call `formRef.value?.validate()` on submit. Attach validation with `:rules=\"[fn1, fn2]\"` where each function signature is `(v: unknown) => string | true`.",
    },
    {
        id: "R07",
        category: "vlossom",
        severity: "critical",
        rule: "Form input validation feedback must use `:state` and `:state-message` props (`'idle' | 'info' | 'success' | 'warning' | 'error'`). Never render custom error `<div>` or `<span>` elements alongside Vlossom inputs.",
    },
    {
        id: "R08",
        category: "vlossom",
        severity: "recommended",
        rule: "For responsive form layouts, use the `:grid` prop on Vlossom input components: `:grid=\"{ xs: 12, md: 6 }\"`. Breakpoint keys are `xs`, `sm`, `md`, `lg`, `xl` with column values 1-12.",
    },
    {
        id: "R09",
        category: "vlossom",
        severity: "recommended",
        rule: "Plugin APIs (`$vsModal`, `$vsToast`, `$vsAlert`, `$vsConfirm`, `$vsPrompt`) are accessed via `const { $vsModal } = useVlossom()` inside `<script setup>`. Wrap the actual trigger call in a function or composable — do not invoke plugin APIs at the top level of setup.",
    },
    // --- Structure ---
    {
        id: "R10",
        category: "structure",
        severity: "recommended",
        rule: "Keep Vlossom SFCs focused on template bindings and user interaction. Move API calls, data fetching, form submit handlers, and complex state into a composable (`use{Feature}.ts`). This keeps components under 200 lines and makes validation logic (`formRef.value?.validate()`) reusable.",
    },
    // --- Design guidance ---
    {
        id: "R11",
        category: "design",
        severity: "recommended",
        rule: "When the user does not specify a design direction, proactively suggest UI references before generating code. Recommend browsing design inspiration from sites like Dribbble (dribbble.com), Behance (behance.net), or Mobbin (mobbin.com) for the specific use case (e.g. 'dashboard design', 'login form design'). If the user has a Figma file, suggest using the Figma MCP tools (get_design_context, get_screenshot) to extract the design before generating Vlossom code.",
    },
    {
        id: "R12",
        category: "design",
        severity: "recommended",
        rule: "For layouts without a design reference, apply these defaults: use VsGrid with 12-column system and consistent gap (1.5rem). Apply visual hierarchy through Vlossom's color-scheme prop ('blue' for primary actions, 'green' for success, 'red' for destructive). Use VsBlock for card-like containers, VsDivider for section separation, and VsPage for page-level structure with title/description slots. Keep whitespace generous (padding: 1.5rem+) and avoid cramming components.",
    },
];
