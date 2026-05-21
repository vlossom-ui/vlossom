import { getComponentMeta } from '../../services/meta-registry';
import { resolveGitHubVersionContext } from '../../services/github-registry-service';
import type { ComponentMeta } from '../../types/meta';
import type { CoverageEntry, VersionContext, VersionSupport } from '../types';
import { toComponentSummary } from '../types';
import { getVersionSupport, resolveVersionContext } from '../version/version-service';

export interface ScaffoldPolicy {
    vlossomFirst?: 'strict' | 'prefer' | 'off';
    allowNativeControls?: boolean;
    allowThirdPartyUi?: boolean;
}

export interface ScaffoldContext {
    framework?: 'vite' | 'nuxt';
    vueStyle?: 'script-setup';
    typescript?: boolean;
    hasBusinessLogic?: boolean;
    hasValidation?: boolean;
    responsive?: boolean;
    version?: string;
    packageJson?: string;
}

export interface ScaffoldOutputOptions {
    format?: 'sfc' | 'snippet' | 'object' | 'markdown';
    includeRules?: boolean;
}

export interface ComponentUsageScaffoldInput {
    description: string;
    components?: string[];
    context?: ScaffoldContext;
    policy?: ScaffoldPolicy;
    output?: ScaffoldOutputOptions;
}

type ComponentUsageSummary = ReturnType<typeof toComponentSummary> & {
    versionSupport: VersionSupport;
};

export interface ComponentUsageScaffold {
    status: 'ok' | 'error';
    kind: 'component-usage';
    policy: Required<ScaffoldPolicy>;
    components: ComponentUsageSummary[];
    assumptions: string[];
    uncoveredRequirements: CoverageEntry[];
    versionContext: VersionContext;
    code?: string;
    error?: string;
    unknownComponents?: string[];
    unsupportedComponents?: Array<{ name: string; versionSupport: VersionSupport }>;
}

function resolvePolicy(policy: ScaffoldPolicy | undefined): Required<ScaffoldPolicy> {
    return {
        vlossomFirst: policy?.vlossomFirst ?? 'strict',
        allowNativeControls: policy?.allowNativeControls ?? false,
        allowThirdPartyUi: policy?.allowThirdPartyUi ?? false,
    };
}

async function resolveComponents(
    input: ComponentUsageScaffoldInput,
    versionContext: VersionContext,
): Promise<{
    components: ComponentMeta[];
    unknown: string[];
    coverage: CoverageEntry[];
}> {
    const requested = input.components?.length ? input.components : [];

    const components: ComponentMeta[] = [];
    const unknown: string[] = [];

    for (const name of requested) {
        const meta = await getComponentMeta(name, versionContext);
        if (meta) components.push(meta);
        else unknown.push(name);
    }

    return { components, unknown, coverage: [] };
}

function summarizeComponents(components: ComponentMeta[], versionContext: VersionContext): ComponentUsageSummary[] {
    return components.map((component) => ({
        ...toComponentSummary(component),
        versionSupport: getVersionSupport(component.availableVersion, versionContext),
    }));
}

function camelToKebab(value: string): string {
    return value.replace(/([A-Z])/g, '-$1').toLowerCase();
}

/**
 * Build a tag snippet from registry metadata only.
 *
 * The scaffolder intentionally avoids inventing feature-specific bindings
 * (form field names, column shapes, validation rule names, ...). Those are
 * the agent's domain. We derive only what the metadata can prove:
 *   - v-model support comes from `modelValue` prop / `update:modelValue` event
 *   - required props are surfaced as placeholders the agent has to fill
 *   - default slot tells us whether the tag carries children
 */
function componentTag(meta: ComponentMeta): string {
    const hasVModel =
        meta.props.some((prop) => prop.name === 'modelValue') ||
        meta.events.some((event) => event.name === 'update:modelValue');
    const hasDefaultSlot = meta.slots.some((slot) => slot.name === 'default');
    const requiredProps = meta.props.filter((prop) => prop.required && prop.name !== 'modelValue');

    const attrs: string[] = [];
    if (hasVModel) attrs.push('v-model="modelValue"');
    for (const prop of requiredProps) {
        attrs.push(`:${camelToKebab(prop.name)}="${prop.name}"`);
    }

    const attrString = attrs.length ? ` ${attrs.join(' ')}` : '';

    if (hasDefaultSlot) {
        return `<${meta.kebabName}${attrString}><!-- content --></${meta.kebabName}>`;
    }
    return `<${meta.kebabName}${attrString} />`;
}

function buildTemplate(description: string, components: ComponentMeta[]): string {
    const body = components.length ? components.map(componentTag).join('\n      ') : '<!-- compose Vlossom UI here -->';
    return `<template>
  <!-- ${titleFromDescription(description, 80)} -->
  <div>
    ${body}
  </div>
</template>`;
}

function titleFromDescription(description: string, maxLength: number): string {
    const trimmed = description.trim();
    if (!trimmed) return 'Vlossom UI';
    return trimmed.length > maxLength ? `${trimmed.slice(0, maxLength - 1)}...` : trimmed;
}

function buildScript(components: ComponentMeta[], context: ScaffoldContext | undefined): string {
    const names = [...new Set(components.map((component) => component.name))].sort();
    const vModelComponents = components.filter(
        (component) =>
            component.props.some((prop) => prop.name === 'modelValue') ||
            component.events.some((event) => event.name === 'update:modelValue'),
    );
    const vueImports = new Set<string>();
    if (vModelComponents.length > 0) vueImports.add('ref');

    const lines = [`<script setup${context?.typescript === false ? '' : ' lang="ts"'}>`];
    if (vueImports.size > 0) {
        lines.push(`import { ${[...vueImports].sort().join(', ')} } from 'vue'`);
    }
    if (names.length > 0) {
        lines.push(`import { ${names.join(', ')} } from 'vlossom'`);
    }
    lines.push('');
    if (vModelComponents.length > 0) {
        lines.push('// Replace the placeholder ref(s) with the agent-chosen state shape.');
        lines.push('const modelValue = ref(null)');
    }
    lines.push('</script>');

    return lines.join('\n');
}

export async function scaffoldComponentUsage(input: ComponentUsageScaffoldInput): Promise<ComponentUsageScaffold> {
    const policy = resolvePolicy(input.policy);
    const versionContext = await resolveGitHubVersionContext(
        resolveVersionContext({
            version: input.context?.version,
            packageJson: input.context?.packageJson,
        }),
    );
    const { components, unknown, coverage } = await resolveComponents(input, versionContext);
    const unsupportedComponents = components
        .map((component) => ({
            name: component.name,
            versionSupport: getVersionSupport(component.availableVersion, versionContext),
        }))
        .filter((component) => component.versionSupport.status === 'unsupported');

    if (!input.components?.length) {
        return {
            status: 'error',
            kind: 'component-usage',
            policy,
            components: [],
            assumptions: [
                'Component usage scaffolding is a registry harness and does not infer UI intent from natural language.',
            ],
            uncoveredRequirements: [],
            versionContext,
            error: 'Pass explicit registry-backed component ids from search_vlossom or get_vlossom_reference.',
        };
    }

    if (unknown.length > 0) {
        return {
            status: 'error',
            kind: 'component-usage',
            policy,
            components: summarizeComponents(components, versionContext),
            assumptions: [
                'All requested components must exist in the Vlossom registry for the requested version before scaffolding.',
            ],
            uncoveredRequirements: [],
            versionContext,
            error: 'Unknown Vlossom component requested.',
            unknownComponents: unknown,
        };
    }

    if (unsupportedComponents.length > 0) {
        return {
            status: 'error',
            kind: 'component-usage',
            policy,
            components: summarizeComponents(components, versionContext),
            assumptions: ['All scaffolded components must be available in the detected Vlossom version.'],
            uncoveredRequirements: [],
            versionContext,
            error: 'Requested components are not supported by the detected Vlossom version.',
            unsupportedComponents,
        };
    }

    const uncoveredRequirements = coverage.filter((entry) => !entry.covered);
    const assumptions = [
        'This is a Vlossom-native starting point, not a final feature implementation.',
        'Component ids and APIs were resolved from the Vlossom registry for the requested version.',
        'Required props appear as placeholder bindings (e.g. `:itemKey="itemKey"`); choose names and shapes that match the feature.',
        'Replace the `modelValue` ref(s) and `<!-- content -->` slots with the agent-chosen state and content.',
        `Vlossom-first guard is ${policy.vlossomFirst}.`,
    ];
    if (policy.vlossomFirst === 'strict') {
        assumptions.push('Native controls and third-party UI remain explicit exceptions, not scaffold defaults.');
    }
    if (input.context?.hasBusinessLogic) {
        assumptions.push('Move API calls and durable business logic into a composable or service.');
    }

    const template = buildTemplate(input.description, components);
    const script = buildScript(components, input.context);
    const code = `${template}\n\n${script}`;

    return {
        status: 'ok',
        kind: 'component-usage',
        policy,
        components: summarizeComponents(components, versionContext),
        assumptions,
        uncoveredRequirements,
        versionContext,
        code: input.output?.format === 'markdown' ? ['```vue', code, '```'].join('\n') : code,
    };
}
