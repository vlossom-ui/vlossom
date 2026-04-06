import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

/**
 * Static documentation for the VlossomOptions / createVlossom() API.
 * Derived from packages/vlossom/src/declaration/types.ts and framework/vlossom-class.ts.
 */
const VLOSSOM_OPTIONS = [
    {
        name: "colorScheme",
        type: "GlobalColorSchemes",
        default: "{}",
        description:
            "Sets the default color scheme globally or per component. " +
            "GlobalColorSchemes is a map of component names to color scheme strings, plus an optional 'default' key. " +
            "Example: { default: 'blue', VsButton: 'red' }",
        example: "createVlossom({ colorScheme: { default: 'blue', VsButton: 'red' } })",
    },
    {
        name: "styleSet",
        type: "GlobalStyleSets",
        default: "{}",
        description:
            "Registers named style-sets that components can reference via their styleSet prop as a string. " +
            "GlobalStyleSets is { [setName]: { [VsComponent]: StyleSet } }. " +
            "Example: createVlossom({ styleSet: { myTheme: { VsButton: { variables: { padding: '2rem' } } } } })",
        example: "createVlossom({ styleSet: { compact: { VsButton: { variables: { padding: '0.5rem 1rem' } } } } })",
    },
    {
        name: "theme",
        type: "'light' | 'dark'",
        default: "'light'",
        description: "Sets the default color theme (light or dark mode) for the entire application.",
        example: "createVlossom({ theme: 'dark' })",
    },
    {
        name: "radiusRatio",
        type: "number",
        default: "1",
        description:
            "Scales all component border radii by a multiplier. " +
            "Affects the --vs-radius-ratio CSS variable used in border-radius calculations. " +
            "0 = no radius (sharp), 1 = default, 2 = very rounded.",
        example: "createVlossom({ radiusRatio: 0.5 })",
    },
];

const VLOSSOM_PLUGINS = [
    {
        name: "$vsToast",
        property: "toast",
        description: "Programmatically trigger toast notifications.",
        methods: [
            { name: "open(component, options?)", description: "Show a toast using a Vue component." },
            { name: "openText(text, options?)", description: "Show a plain-text toast message." },
            { name: "close(id?)", description: "Close a specific or all toasts." },
        ],
        example: 'vlossom.toast.openText("Saved successfully!")',
    },
    {
        name: "$vsModal",
        property: "modal",
        description: "Programmatically open and manage modal dialogs.",
        methods: [
            { name: "open(component, options?)", description: "Open a modal with any Vue component as content." },
            { name: "close(id?)", description: "Close a specific or all modals." },
        ],
        example: "vlossom.modal.open(MyFormComponent, { size: 'lg' })",
    },
    {
        name: "$vsAlert",
        property: "alert",
        description: "Show a simple informational alert dialog. Built on top of $vsModal.",
        methods: [
            { name: "open(options?)", description: "Open an alert dialog with title, content, and an OK button." },
        ],
        example: "vlossom.alert.open({ title: 'Notice', content: 'Operation complete.' })",
    },
    {
        name: "$vsConfirm",
        property: "confirm",
        description: "Show a confirm dialog with OK / Cancel. Built on top of $vsModal.",
        methods: [
            {
                name: "open(options?)",
                description: "Open a confirm dialog. Returns a Promise<boolean> resolving to the user's choice.",
            },
        ],
        example: "const ok = await vlossom.confirm.open({ title: 'Delete?', content: 'This cannot be undone.' })",
    },
    {
        name: "$vsPrompt",
        property: "prompt",
        description: "Show a prompt dialog with a text input. Built on top of $vsModal.",
        methods: [
            {
                name: "open(options?)",
                description: "Open a prompt dialog. Returns a Promise<string | null> with the entered value.",
            },
        ],
        example: "const name = await vlossom.prompt.open({ title: 'Your name' })",
    },
];

const FULL_EXAMPLE = `import { createApp } from 'vue'
import { createVlossom } from 'vlossom'
import App from './App.vue'

const vlossom = createVlossom({
    colorScheme: { default: 'blue' },
    styleSet: {
        compact: {
            VsButton: { variables: { padding: '0.5rem 1rem' } },
        },
    },
    theme: 'light',
    radiusRatio: 1,
})

createApp(App).use(vlossom).mount('#app')`;

export function registerGetVlossomOptions(server: McpServer): void {
    server.tool(
        "get_vlossom_options",
        "Returns all available options for createVlossom() — the Vlossom plugin setup function. " +
            "Call this when the user asks how to configure Vlossom globally, " +
            "change the default color scheme, register a global styleSet, set dark mode, " +
            "or adjust border-radius ratio. " +
            "Also returns the available imperative plugin APIs ($vsModal, $vsAlert, $vsConfirm, $vsPrompt, $vsToast).",
        {},
        () => {
            const start = Date.now();
            const meta = recordStep("get_vlossom_options", "VlossomOptions", Date.now() - start);
            return textResponse(
                {
                    options: VLOSSOM_OPTIONS,
                    plugins: VLOSSOM_PLUGINS,
                    fullExample: FULL_EXAMPLE,
                    next_actions: [
                        { tool: "get_css_tokens", reason: "find --vs-* design tokens to use as values in styleSet or colorScheme" },
                        { tool: "generate_component_code", reason: "generate component code applying the configured options" },
                    ],
                },
                meta,
            );
        },
    );
}
