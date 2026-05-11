import type { VlossomOptionMeta } from '../types';
export {
    loadComposables,
    loadCssTokens,
    loadDirectives,
    loadPlugins,
    loadSetupExample,
} from '../../services/github-registry-service';

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

