import { VLOSSOM_SETUP_EXAMPLE } from '../reference/reference-data';
import type { ScaffoldContext } from './component-usage-scaffolder';

export interface ProjectSetupScaffoldInput {
    description: string;
    context?: ScaffoldContext;
}

export interface ProjectSetupScaffold {
    status: 'ok';
    kind: 'project-setup';
    assumptions: string[];
    coveredRequirements: string[];
    uncoveredRequirements: string[];
    files: Array<{ path: string; content: string }>;
    commands: string[];
    validationPayload: {
        kind: 'project-setup';
        packageJson: string;
        files: Array<{ path: string; content: string }>;
        context: { framework: 'vite' | 'nuxt'; vlossomFirst: 'strict' };
    };
}

export function scaffoldProjectSetup(input: ProjectSetupScaffoldInput): ProjectSetupScaffold {
    const framework = input.context?.framework ?? 'vite';
    const setupPath = framework === 'nuxt' ? 'plugins/vlossom.ts' : 'src/main.ts';
    const packageJson = JSON.stringify(
        {
            dependencies: {
                vue: '^3.4.0',
                vlossom: '^2.0.0-beta.1',
                tailwindcss: '^4.0.0',
            },
        },
        null,
        2,
    );
    const content =
        framework === 'nuxt'
            ? `import { createVlossom, VlossomComponents } from 'vlossom'
import 'vlossom/styles'

export default defineNuxtPlugin((nuxtApp) => {
  const vlossom = createVlossom({
    components: VlossomComponents,
  })

  nuxtApp.vueApp.use(vlossom)
})`
            : VLOSSOM_SETUP_EXAMPLE;

    return {
        status: 'ok',
        kind: 'project-setup',
        assumptions: [
            `Framework target: ${framework}.`,
            'This setup scaffold is the Vlossom-first starting point for a new project or migration.',
            'The components option is required when installing createVlossom().',
            'Existing native or third-party UI should be validated and migrated when Vlossom coverage exists.',
            `Setup context: ${input.description}`,
        ],
        coveredRequirements: [
            'vlossom dependency',
            'Vue dependency',
            'Tailwind CSS dependency',
            'createVlossom plugin installation',
            'VlossomComponents registry',
            'vlossom/styles import',
        ],
        uncoveredRequirements: [
            'Application routes, domain state, API clients, and business logic are intentionally not scaffolded.',
            "Run search_vlossom(intent:'build-ui') for each UI workflow before implementing screens.",
        ],
        files: [{ path: setupPath, content }],
        commands: ['npm install vlossom vue tailwindcss'],
        validationPayload: {
            kind: 'project-setup',
            packageJson,
            files: [{ path: setupPath, content }],
            context: { framework, vlossomFirst: 'strict' },
        },
    };
}
