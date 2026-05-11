import type { VlossomOptionMeta, VlossomPluginMeta } from '../types';
export { loadComposables, loadCssTokens, loadDirectives } from '../../services/github-registry-service';

export const VLOSSOM_OPTIONS: VlossomOptionMeta[] = [
    {
        name: 'components',
        type: '{ [key: string]: Component }',
        default: '- (required)',
        required: true,
        description:
            'Required component registry for createVlossom(). Use VlossomComponents to register the bundled component map, or pass a partial registry deliberately.',
        example:
            "import { createVlossom, VlossomComponents } from 'vlossom';\ncreateVlossom({ components: VlossomComponents })",
    },
    {
        name: 'colorScheme',
        type: 'GlobalColorSchemes',
        default: '{}',
        required: false,
        description:
            "Sets the default color scheme globally or per component, for example { default: 'blue', VsButton: 'red' }.",
        example: "createVlossom({ components: VlossomComponents, colorScheme: { default: 'blue', VsButton: 'red' } })",
    },
    {
        name: 'styleSet',
        type: 'GlobalStyleSets',
        default: '{}',
        required: false,
        description: 'Registers named StyleSets that components can reference with style-set="presetName".',
        example:
            "createVlossom({ components: VlossomComponents, styleSet: { compact: { VsButton: { variables: { padding: '0.5rem 1rem' } } } } })",
    },
    {
        name: 'theme',
        type: "'light' | 'dark'",
        default: "'light'",
        required: false,
        description: 'Sets the default color theme for the application.',
        example: "createVlossom({ components: VlossomComponents, theme: 'dark' })",
    },
    {
        name: 'radiusRatio',
        type: 'number',
        default: '1',
        required: false,
        description: 'Scales all component border radii through the Vlossom radius token system.',
        example: 'createVlossom({ components: VlossomComponents, radiusRatio: 0.5 })',
    },
];

export const VLOSSOM_PLUGINS: VlossomPluginMeta[] = [
    {
        name: '$vsToast',
        property: 'toast',
        description: 'Programmatically trigger toast notifications.',
        methods: [
            { name: 'open(component, options?)', description: 'Show a toast using a Vue component.' },
            { name: 'openText(text, options?)', description: 'Show a plain-text toast message.' },
            { name: 'close(id?)', description: 'Close a specific toast or all toasts.' },
        ],
        example: 'vlossom.toast.openText("Saved successfully!")',
    },
    {
        name: '$vsModal',
        property: 'modal',
        description: 'Programmatically open and manage modal dialogs.',
        methods: [
            { name: 'open(component, options?)', description: 'Open a modal with a Vue component.' },
            { name: 'close(id?)', description: 'Close a specific modal or all modals.' },
        ],
        example: "vlossom.modal.open(MyFormComponent, { size: 'lg' })",
    },
    {
        name: '$vsAlert',
        property: 'alert',
        description: 'Show a simple informational alert dialog.',
        methods: [{ name: 'open(options?)', description: 'Open an alert dialog.' }],
        example: "vlossom.alert.open({ title: 'Notice', content: 'Operation complete.' })",
    },
    {
        name: '$vsConfirm',
        property: 'confirm',
        description: 'Show a confirm dialog with OK and Cancel actions.',
        methods: [
            {
                name: 'open(options?)',
                description: 'Open a confirm dialog and resolve a Promise<boolean>.',
            },
        ],
        example: "const ok = await vlossom.confirm.open({ title: 'Delete?', content: 'This cannot be undone.' })",
    },
    {
        name: '$vsPrompt',
        property: 'prompt',
        description: 'Show a prompt dialog with a text input.',
        methods: [
            {
                name: 'open(options?)',
                description: 'Open a prompt dialog and resolve the entered string or null.',
            },
        ],
        example: "const name = await vlossom.prompt.open({ title: 'Your name' })",
    },
];

export const VLOSSOM_SETUP_EXAMPLE = `import { createApp } from 'vue'
import { createVlossom, VlossomComponents } from 'vlossom'
import 'vlossom/styles'
import App from './App.vue'

const vlossom = createVlossom({
  components: VlossomComponents,
  colorScheme: { default: 'blue' },
})

createApp(App).use(vlossom).mount('#app')`;
