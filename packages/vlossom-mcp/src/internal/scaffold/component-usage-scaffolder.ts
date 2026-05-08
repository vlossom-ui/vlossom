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

const FORM_INPUTS = new Set([
    'VsInput',
    'VsTextarea',
    'VsSelect',
    'VsCheckbox',
    'VsRadio',
    'VsSwitch',
    'VsToggle',
    'VsFileDrop',
    'VsSearchInput',
]);

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

function componentTag(meta: ComponentMeta): string {
    if (meta.name === 'VsForm') {
        return `<vs-form ref="formRef">
      <vs-input v-model="form.name" label="Name" :rules="[requiredRule]" />
      <vs-button type="submit" primary @click="handleSubmit">Submit</vs-button>
    </vs-form>`;
    }
    if (meta.name === 'VsInput') {
        return `<vs-input v-model="form.name" label="Name" />`;
    }
    if (meta.name === 'VsTextarea') {
        return `<vs-textarea v-model="form.description" label="Description" />`;
    }
    if (meta.name === 'VsSelect') {
        return `<vs-select v-model="form.option" :options="options" label="Option" />`;
    }
    if (meta.name === 'VsCheckbox') {
        return `<vs-checkbox v-model="form.accepted" label="Accept" />`;
    }
    if (meta.name === 'VsRadio') {
        return `<vs-radio v-model="form.choice" label="Choice" value="choice" />`;
    }
    if (meta.name === 'VsSwitch' || meta.name === 'VsToggle') {
        return `<${meta.kebabName} v-model="form.enabled" label="Enabled" />`;
    }
    if (meta.name === 'VsTable') {
        return `<vs-table :items="items" :columns="columns" />`;
    }
    if (meta.name === 'VsPagination') {
        return `<vs-pagination v-model:page="page" :length="totalPages" />`;
    }
    if (meta.name === 'VsModal') {
        return `<vs-modal v-model="isModalOpen">
      <template #title>Title</template>
      Modal content
    </vs-modal>`;
    }
    if (meta.name === 'VsButton') {
        return `<vs-button primary @click="handleAction">Action</vs-button>`;
    }
    if (meta.slots.some((slot) => slot.name === 'default')) {
        return `<${meta.kebabName}>Content</${meta.kebabName}>`;
    }
    return `<${meta.kebabName} />`;
}

function buildTemplate(description: string, components: ComponentMeta[], context: ScaffoldContext | undefined): string {
    const hasPage = components.some((component) => component.name === 'VsPage');
    const hasGrid = context?.responsive || components.some((component) => component.name === 'VsGrid');
    const bodyComponents = components.filter((component) => !['VsPage', 'VsGrid'].includes(component.name));
    const body = bodyComponents.map(componentTag).join('\n      ');

    if (hasPage || hasGrid) {
        const gridBody = hasGrid
            ? `<vs-grid :columns="12" gap="1.5rem">
      ${body || '<vs-block>Content</vs-block>'}
    </vs-grid>`
            : body;
        return `<template>
  <vs-page>
    <template #title>${titleFromDescription(description, 32)}</template>
    ${gridBody}
  </vs-page>
</template>`;
    }

    return `<template>
  <div>
    ${body || '<vs-block>Content</vs-block>'}
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
    const hasForm =
        components.some((component) => component.name === 'VsForm') ||
        components.some((component) => FORM_INPUTS.has(component.name));
    const hasTable = components.some((component) => component.name === 'VsTable');
    const hasPagination = components.some((component) => component.name === 'VsPagination');
    const hasModal = components.some((component) => component.name === 'VsModal');
    const vueImports = new Set(['ref']);
    if (hasForm) vueImports.add('reactive');
    if (components.some((component) => component.name === 'VsForm')) vueImports.add('useTemplateRef');

    const lines = [
        `<script setup${context?.typescript === false ? '' : ' lang="ts"'}>`,
        `import { ${[...vueImports].sort().join(', ')} } from 'vue'`,
        `import { ${names.join(', ')} } from 'vlossom'`,
        '',
    ];

    if (hasForm) {
        if (components.some((component) => component.name === 'VsForm')) {
            lines.push("const formRef = useTemplateRef('formRef')");
        }
        lines.push(
            "const form = reactive({ name: '', description: '', option: null, accepted: false, choice: '', enabled: false })",
        );
        lines.push("const requiredRule = (value: unknown) => Boolean(value) || 'Required'");
    }
    if (components.some((component) => component.name === 'VsSelect')) {
        lines.push("const options = [{ label: 'Option A', value: 'a' }]");
    }
    if (hasTable) {
        lines.push('const items = ref([])');
        lines.push("const columns = [{ key: 'name', label: 'Name' }]");
    }
    if (hasPagination) {
        lines.push('const page = ref(1)');
        lines.push('const totalPages = ref(1)');
    }
    if (hasModal) {
        lines.push('const isModalOpen = ref(false)');
    }

    lines.push('');
    if (components.some((component) => component.name === 'VsForm')) {
        lines.push('async function handleSubmit() {');
        lines.push('  const valid = await formRef.value?.validate()');
        lines.push('  if (!valid) return');
        lines.push('}');
    } else {
        lines.push('function handleAction() {');
        lines.push('  // Add interaction logic or delegate to a composable.');
        lines.push('}');
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
        `Vlossom-first guard is ${policy.vlossomFirst}.`,
    ];
    if (policy.vlossomFirst === 'strict') {
        assumptions.push('Native controls and third-party UI remain explicit exceptions, not scaffold defaults.');
    }
    if (input.context?.hasBusinessLogic) {
        assumptions.push('Move API calls and durable business logic into a composable or service.');
    }

    const template = buildTemplate(input.description, components, input.context);
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
