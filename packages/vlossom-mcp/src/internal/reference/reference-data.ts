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
        name: '$vs.toast',
        property: 'toast',
        description:
            'Programmatically trigger toast notifications. Access via `$vs.toast` in templates or `useVlossom().toast` in `<script setup>`.',
        methods: [
            {
                name: 'show(content, options?)',
                description: 'Show a toast where content is a string or Vue component.',
            },
            {
                name: 'info(content, options?)',
                description: 'Shortcut for show with the cyan color scheme.',
            },
            {
                name: 'success(content, options?)',
                description: 'Shortcut for show with the green color scheme.',
            },
            {
                name: 'warning(content, options?)',
                description: 'Shortcut for show with the yellow color scheme; also calls console.warn.',
            },
            {
                name: 'error(content, options?)',
                description: 'Shortcut for show with the red color scheme; also calls console.error.',
            },
            { name: 'remove(container, id)', description: 'Remove a specific toast by container and id.' },
            { name: 'clear(container?)', description: 'Clear all toasts in the container (defaults to body).' },
        ],
        example: "const { toast } = useVlossom()\ntoast.success('Saved successfully!')",
    },
    {
        name: '$vs.modal',
        property: 'modal',
        description:
            'Programmatically open and manage modal dialogs. Access via `$vs.modal` in templates or `useVlossom().modal` in `<script setup>`.',
        methods: [
            {
                name: 'open(content, options?)',
                description:
                    'Open a modal where content is a string or Vue component. Returns the modal id as a string.',
            },
            {
                name: 'emit(eventName, ...args)',
                description: 'Emit a named event on the most recently opened modal.',
            },
            {
                name: 'emitWithId(id, eventName, ...args)',
                description: 'Emit a named event on a specific modal by id.',
            },
            {
                name: 'close(container?)',
                description: 'Close the most recently opened modal in the container (defaults to body).',
            },
            { name: 'closeWithId(container, id)', description: 'Close a specific modal by container and id.' },
            { name: 'clear(container?)', description: 'Clear all modals in the container (defaults to body).' },
        ],
        example: "const { modal } = useVlossom()\nconst id = modal.open(MyFormComponent, { size: 'lg' })",
    },
    {
        name: '$vs.alert',
        property: 'alert',
        description:
            'Show a simple informational alert dialog. Access via `$vs.alert` in templates or `useVlossom().alert` in `<script setup>`.',
        methods: [
            {
                name: 'open(content, options?)',
                description:
                    'Open an alert dialog where content is a string or Vue component. Resolves Promise<void> when the user acknowledges.',
            },
        ],
        example: "await useVlossom().alert.open('Operation complete.', { okText: 'OK' })",
    },
    {
        name: '$vs.confirm',
        property: 'confirm',
        description:
            'Show a confirm dialog with OK and Cancel actions. Access via `$vs.confirm` in templates or `useVlossom().confirm` in `<script setup>`.',
        methods: [
            {
                name: 'open(content, options?)',
                description: 'Open a confirm dialog and resolve Promise<boolean> (true for OK, false for Cancel).',
            },
        ],
        example: "const ok = await useVlossom().confirm.open('Delete this item?', { okText: 'Delete' })",
    },
    {
        name: '$vs.prompt',
        property: 'prompt',
        description:
            'Show a prompt dialog with a text input. Access via `$vs.prompt` in templates or `useVlossom().prompt` in `<script setup>`.',
        methods: [
            {
                name: 'open(content, options?)',
                description:
                    'Open a prompt dialog and resolve the entered VsInput value (string/number) or null if cancelled.',
            },
        ],
        example: "const name = await useVlossom().prompt.open('Enter your name:')",
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
