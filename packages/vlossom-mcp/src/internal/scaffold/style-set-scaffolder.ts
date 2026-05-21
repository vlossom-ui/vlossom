import { getComponentMeta } from '../../services/meta-registry';
import { childRefToKey } from '../../utils/naming';
import type { VersionContext } from '../types';

export interface StyleSetScaffoldInput {
    component?: string;
    description: string;
}

export interface StyleSetScaffold {
    status: 'ok' | 'error';
    kind: 'style-set';
    component?: string;
    assumptions: string[];
    availableVariables?: string[];
    childRefs?: Array<{ key: string; type: string }>;
    code?: string;
    styleSetInterface?: string;
    error?: string;
}

function varName(componentName: string): string {
    return `${componentName.charAt(0).toLowerCase()}${componentName.slice(1)}StyleSet`;
}

export async function scaffoldStyleSet(
    input: StyleSetScaffoldInput,
    versionContext: VersionContext,
): Promise<StyleSetScaffold> {
    if (!input.component) {
        return {
            status: 'error',
            kind: 'style-set',
            assumptions: [],
            error: "component is required for kind:'style-set'.",
        };
    }

    const meta = await getComponentMeta(input.component, versionContext);
    if (!meta) {
        return {
            status: 'error',
            kind: 'style-set',
            component: input.component,
            assumptions: ['StyleSet scaffolds are only generated for registry-backed components.'],
            error: `Component '${input.component}' was not found in the Vlossom registry.`,
        };
    }

    const lines = [`const ${varName(meta.name)}: ${meta.name}StyleSet = {`];
    const variableKeys = Object.keys(meta.styleSet.variables);
    if (variableKeys.length > 0) {
        lines.push('  variables: {');
        for (const key of variableKeys) {
            lines.push(`    // ${key}: 'var(--vs-comp-bg)',`);
        }
        lines.push('  },');
    }

    if (meta.styleSet.component) {
        lines.push('  component: {');
        lines.push('    // Add CSSProperties overrides only when a token or variable cannot express the need.');
        lines.push('  },');
    }

    for (const ref of meta.styleSet.childRefs) {
        const key = childRefToKey(ref);
        lines.push(`  ${key}: {`);
        lines.push(`    // Nested ${ref} StyleSet`);
        lines.push('  },');
    }
    lines.push('}');

    return {
        status: 'ok',
        kind: 'style-set',
        component: meta.name,
        assumptions: [
            'Use variables only for keys present in the generated StyleSet interface.',
            'Prefer --vs-* tokens for theme-aware values.',
            `Requirements context: ${input.description}`,
        ],
        availableVariables: variableKeys,
        childRefs: meta.styleSet.childRefs.map((ref) => ({ key: childRefToKey(ref), type: ref })),
        code: lines.join('\n'),
        styleSetInterface: meta.styleSet.raw,
    };
}
