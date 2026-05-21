import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { searchVlossom } from '../dist/internal/search/component-search-service';
import { getVlossomReference } from '../dist/internal/reference/reference-service';
import { scaffoldVlossomCode } from '../dist/internal/scaffold/scaffold-service';
import { validateVlossomUsage } from '../dist/internal/validation/validate-vlossom-usage';
import { getAllComponentsMeta } from '../dist/services/meta-registry';
import { resolveGitHubVersionContext } from '../dist/services/github-registry-service';
import { resolveVersionContext } from '../dist/internal/version/version-service';
import { createServer } from '../dist/server';

const packageRoot = process.cwd();

type ProjectSetupValidationPayload = {
    kind?: string;
    context?: { framework?: string; vlossomFirst?: string };
    packageJson?: string;
};

function collectRegisteredTools(env = {}) {
    const previousEnv = Object.fromEntries(Object.keys(env).map((key) => [key, process.env[key]]));
    Object.assign(process.env, env);

    const names = [];
    const originalTool = McpServer.prototype.tool;
    const originalRegisterTool = McpServer.prototype.registerTool;
    McpServer.prototype.tool = function patchedTool(name) {
        names.push(name);
        return undefined;
    };
    McpServer.prototype.registerTool = function patchedRegisterTool(name) {
        names.push(name);
        return undefined;
    };

    try {
        createServer();
    } finally {
        McpServer.prototype.tool = originalTool;
        McpServer.prototype.registerTool = originalRegisterTool;
        for (const [key, value] of Object.entries(previousEnv)) {
            if (value === undefined) delete process.env[key];
            else process.env[key] = value;
        }
    }

    return names;
}

function collectRegisteredResourcesAndPrompts() {
    const resources = [];
    const prompts = [];
    const originalResource = McpServer.prototype.registerResource;
    const originalPrompt = McpServer.prototype.registerPrompt;
    const originalTool = McpServer.prototype.tool;
    const originalRegisterTool = McpServer.prototype.registerTool;

    McpServer.prototype.registerResource = function patchedResource(name) {
        resources.push(name);
        return undefined;
    };
    McpServer.prototype.registerPrompt = function patchedPrompt(name) {
        prompts.push(name);
        return undefined;
    };
    McpServer.prototype.tool = function patchedTool() {
        return undefined;
    };
    McpServer.prototype.registerTool = function patchedRegisterTool() {
        return undefined;
    };

    try {
        createServer();
    } finally {
        McpServer.prototype.registerResource = originalResource;
        McpServer.prototype.registerPrompt = originalPrompt;
        McpServer.prototype.tool = originalTool;
        McpServer.prototype.registerTool = originalRegisterTool;
    }

    return { resources, prompts };
}

test('search_vlossom returns only registry-backed components', async () => {
    const versionContext = await resolveGitHubVersionContext(resolveVersionContext());
    const registryNames = new Set((await getAllComponentsMeta(versionContext)).map((component) => component.name));
    const result = await searchVlossom({ query: 'button input', target: 'component', limit: 10 });

    assert.equal(result.status, 'ok');
    assert.ok(result.results.length > 0);
    for (const component of result.results) {
        assert.equal(component.type, 'component');
        assert.ok(registryNames.has(component.name), `${component.name} is not registry-backed`);
    }
});

test('search keeps component results compact and version-context aware', async () => {
    const result = await searchVlossom({
        query: 'button',
        target: 'component',
        packageJson: JSON.stringify({ dependencies: { vlossom: '^1.0.0' } }),
    });
    const button = result.results.find((entry) => entry.name === 'VsButton');

    assert.equal(result.versionContext?.source, 'packageJson');
    assert.equal(result.versionContext?.detectedVersion, '1.0.0');
    assert.equal(button?.versionSupport?.status, 'unknown');
    assert.equal(button?.description.includes('Call get_vlossom_reference'), true);
});

test('unknown component reference is rejected', async () => {
    const result = await getVlossomReference({ type: 'component', id: 'VsChart' });

    assert.equal(result.found, false);
    assert.equal(result.status, 'error');
    assert.match(result.message ?? '', /not found/i);
});

test('component reference reports unsupported project versions', async () => {
    const result = await getVlossomReference({
        type: 'component',
        id: 'VsButton',
        version: '1.0.0',
    });
    const reference = result.reference as
        | { versionSupport?: { status?: string; requestedVersion?: string } }
        | undefined;

    assert.equal(result.status, 'ok');
    assert.equal(result.versionContext?.detectedVersion, '1.0.0');
    assert.equal(reference?.versionSupport?.status, 'unsupported');
    assert.equal(reference?.versionSupport?.requestedVersion, '1.0.0');
});

test('unknown component reference stays in reference/search workflow', async () => {
    const result = await getVlossomReference({ type: 'component', id: 'VsChart' });

    assert.equal(
        result.next_actions.some((action) => action.tool === 'search_vlossom'),
        true,
    );
    assert.equal(Object.hasOwn(result as unknown as Record<string, unknown>, 'issueCandidate'), false);
});

test('scaffold refuses unknown components', async () => {
    const result = await scaffoldVlossomCode({
        kind: 'component-usage',
        description: 'chart view',
        components: ['VsChart'],
        context: { version: '2.0.0-beta.1' },
    });

    assert.equal(result.status, 'error');
    assert.deepEqual(result.unknownComponents, ['VsChart']);
});

test('scaffold requires Vlossom setup before component code', async () => {
    const result = await scaffoldVlossomCode({
        kind: 'component-usage',
        description: 'button action',
        components: ['VsButton'],
    });

    assert.equal(result.status, 'skipped');
    assert.match(result.error ?? '', /not scaffolded/i);
    assert.equal(result.versionContext?.source, 'unknown');
    assert.ok(
        result.next_actions.some(
            (action) => action.tool === 'scaffold_vlossom_code' && action.reason.includes('project-setup'),
        ),
    );
});

test('scaffold does not generate component code when packageJson lacks vlossom', async () => {
    const result = await scaffoldVlossomCode({
        kind: 'component-usage',
        description: 'button action',
        components: ['VsButton'],
        context: {
            packageJson: JSON.stringify({ dependencies: { vue: '^3.4.0' } }),
        },
    });

    assert.equal(result.status, 'skipped');
    assert.match(result.error ?? '', /does not include vlossom/i);
    assert.equal(result.code, undefined);
});

test('scaffold refuses components unsupported by detected vlossom version', async () => {
    const result = await scaffoldVlossomCode({
        kind: 'component-usage',
        description: 'button action',
        components: ['VsButton'],
        context: { version: '1.0.0' },
    });

    assert.equal(result.status, 'error');
    assert.equal(result.unsupportedComponents?.[0]?.name, 'VsButton');
    assert.equal(result.unsupportedComponents?.[0]?.versionSupport.status, 'unsupported');
});

test('scaffold defaults to Vlossom-first guard policy', async () => {
    const result = await scaffoldVlossomCode({
        kind: 'component-usage',
        description: 'button action',
        components: ['VsButton'],
        context: { version: '2.0.0-beta.1' },
    });

    assert.equal(result.status, 'ok');
    assert.equal(result.policy?.vlossomFirst, 'strict');
    assert.equal(result.policy?.allowNativeControls, false);
    assert.equal(result.policy?.allowThirdPartyUi, false);
});

test('validate detects native UI controls by default when Vlossom coverage exists', async () => {
    const result = await validateVlossomUsage({
        kind: 'snippet',
        code: '<template><button>Save</button></template>',
    });

    assert.equal(result.valid, false);
    assert.ok(result.issues.some((issue) => issue.ruleId === 'PREFER_VLOSSOM_COMPONENT'));
});

test('validate detects third-party UI imports by default', async () => {
    const result = await validateVlossomUsage({
        kind: 'sfc',
        code: `<script setup lang="ts">
import { ElButton } from 'element-plus'
</script>
<template><el-button>Save</el-button></template>`,
    });

    assert.equal(result.valid, false);
    assert.ok(result.issues.some((issue) => issue.message.includes('element-plus')));
});

test('validate detects extended third-party UI imports and tag patterns', async () => {
    const result = await validateVlossomUsage({
        kind: 'sfc',
        code: `<script setup lang="ts">
import { Dialog } from '@headlessui/vue'
</script>
<template><v-card><v-btn>Save</v-btn></v-card></template>`,
    });

    assert.equal(result.valid, false);
    assert.ok(result.issues.some((issue) => issue.message.includes('@headlessui/vue')));
    assert.ok(result.issues.some((issue) => issue.message.includes('v-card') || issue.message.includes('v-btn')));
});

test('validate flags inline style on Vlossom components as a Vlossom-first violation', async () => {
    const result = await validateVlossomUsage({
        kind: 'snippet',
        code: '<template><vs-button style="background: red">Save</vs-button></template>',
    });

    assert.equal(result.valid, false);
    assert.ok(result.issues.some((issue) => issue.ruleId === 'PREFER_STYLE_SET'));
});

test('validate allows explicit Vlossom-first opt-out', async () => {
    const result = await validateVlossomUsage({
        kind: 'snippet',
        code: '<template><button>Save</button></template>',
        context: { vlossomFirst: 'off' },
    });

    assert.equal(result.valid, true);
    assert.equal(
        result.issues.some((issue) => issue.ruleId === 'PREFER_VLOSSOM_COMPONENT'),
        false,
    );
});

test('validate detects unsupported component props from GitHub-resolved metadata', async () => {
    const result = await validateVlossomUsage({
        kind: 'snippet',
        code: '<template><vs-button ghostly>Save</vs-button></template>',
    });

    assert.equal(result.valid, false);
    assert.ok(result.issues.some((issue) => issue.ruleId === 'PROP_EXISTS'));
    assert.ok(result.issues.some((issue) => issue.message.includes('ghostly')));
});

test('validate rejects components unsupported by detected vlossom version', async () => {
    const result = await validateVlossomUsage({
        kind: 'snippet',
        code: '<template><vs-button>Save</vs-button></template>',
        packageJson: JSON.stringify({
            dependencies: { vlossom: '^1.0.0', vue: '^3.4.0', tailwindcss: '^4.0.0' },
        }),
    });

    assert.equal(result.valid, false);
    assert.equal(result.versionContext?.detectedVersion, '1.0.0');
    assert.ok(result.issues.some((issue) => issue.ruleId === 'VERSION_UNSUPPORTED'));
});

test('validate detects empty code as skipped, not valid', async () => {
    const result = await validateVlossomUsage({ kind: 'sfc', code: '' });

    assert.equal(result.status, 'skipped');
    assert.equal(result.valid, false);
});

test('validate checks StyleSet against GitHub-resolved component metadata', async () => {
    const result = await validateVlossomUsage({
        kind: 'style-set',
        code: `const buttonStyleSet: VsButtonStyleSet = {
  variables: {
    padding: 'var(--vs-button-padding)',
    margin: '1rem',
    accent: 'var(--brand-accent)',
  },
  icon: {},
}`,
        context: { components: ['VsButton'] },
    });

    assert.equal(result.valid, false);
    assert.ok(result.issues.some((issue) => issue.ruleId === 'STYLESET_INTERFACE_KEY'));
    assert.ok(result.issues.some((issue) => issue.ruleId === 'STYLESET_COMPONENT_PROPERTY_IN_VARIABLES'));
    assert.ok(result.issues.some((issue) => issue.ruleId === 'STYLESET_CSS_VARIABLE_NAME'));
});

test('validate requires StyleSet component context', async () => {
    const result = await validateVlossomUsage({
        kind: 'style-set',
        code: `const styleSet = {
  component: {},
}`,
    });

    assert.equal(result.valid, false);
    assert.ok(result.issues.some((issue) => issue.ruleId === 'STYLESET_COMPONENT_CONTEXT'));
});

test('search returns coverage without issue workflow', async () => {
    const result = await searchVlossom({
        query: 'kanban board',
        target: 'component',
        intent: 'build-ui',
    });

    assert.ok(['ok', 'empty'].includes(result.status));
    assert.equal(Object.hasOwn(result as unknown as Record<string, unknown>, 'issueCandidate'), false);
});

test('validate reports unknown Vlossom components without issue workflow', async () => {
    const result = await validateVlossomUsage({
        kind: 'sfc',
        code: `<script setup lang="ts">
import { VsChart } from 'vlossom'
</script>
<template><vs-chart /></template>`,
    });

    assert.equal(result.valid, false);
    assert.ok(result.issues.some((issue) => issue.ruleId === 'COMPONENT_EXISTS'));
    assert.equal(Object.hasOwn(result as unknown as Record<string, unknown>, 'issueCandidate'), false);
});

test('validate checks project setup imports and options', async () => {
    const result = await validateVlossomUsage({
        kind: 'project-setup',
        packageJson: JSON.stringify({
            dependencies: { vlossom: '^2.0.0-beta.1', vue: '^3.4.0', tailwindcss: '^4.0.0' },
        }),
        files: [
            {
                path: 'src/main.ts',
                content: `import { createVlossom } from 'vlossom'
createVlossom({})`,
            },
        ],
    });

    assert.equal(result.valid, false);
    assert.equal(result.versionContext?.detectedVersion, '2.0.0-beta.1');
    assert.ok(result.issues.some((issue) => issue.message.includes('VlossomComponents')));
    assert.ok(result.issues.some((issue) => issue.message.includes('styles')));
    assert.ok(result.issues.some((issue) => issue.message.includes('components option')));
});

test('project setup scaffold returns a strict Vlossom-first validation payload', async () => {
    const result = await scaffoldVlossomCode({
        kind: 'project-setup',
        description: 'start a new dashboard',
        context: { framework: 'vite' },
    });

    assert.equal(result.status, 'ok');
    assert.ok(result.coveredRequirements?.includes('createVlossom plugin installation'));
    const validationPayload = result.validationPayload as ProjectSetupValidationPayload | undefined;
    assert.equal(validationPayload?.kind, 'project-setup');
    assert.equal(validationPayload?.context?.vlossomFirst, 'strict');
    assert.ok(validationPayload?.packageJson?.includes('vlossom'));
});

test('validate project setup rejects third-party UI dependencies by default', async () => {
    const result = await validateVlossomUsage({
        kind: 'project-setup',
        packageJson: JSON.stringify({
            dependencies: {
                vlossom: '^2.0.0-beta.1',
                vue: '^3.4.0',
                tailwindcss: '^4.0.0',
                'element-plus': '^2.0.0',
            },
        }),
        files: [
            {
                path: 'src/main.ts',
                content: `import { createVlossom, VlossomComponents } from 'vlossom'
import 'vlossom/styles'
createVlossom({ components: VlossomComponents })`,
            },
        ],
    });

    assert.equal(result.valid, false);
    assert.ok(result.issues.some((issue) => issue.ruleId === 'PREFER_VLOSSOM_COMPONENT'));
    assert.ok(result.issues.some((issue) => issue.message.includes('element-plus')));
});

test('optional env flags do not add side-workflow tools', () => {
    const defaultTools = collectRegisteredTools();
    assert.equal(defaultTools.includes('submit_vlossom_issue'), false);
    assert.equal(defaultTools.includes('record_external_step'), false);

    const enabledTools = collectRegisteredTools({
        VLOSSOM_MCP_GITHUB_ISSUES: 'on',
        VLOSSOM_MCP_DEBUG_STEPPER: 'on',
    });
    assert.deepEqual(enabledTools, defaultTools);
});

test('only the four core tools are registered by default', () => {
    const names = collectRegisteredTools();

    assert.deepEqual(names, [
        'search_vlossom',
        'get_vlossom_reference',
        'scaffold_vlossom_code',
        'validate_vlossom_usage',
    ]);
    assert.equal(names.includes('list_components'), false);
    assert.equal(names.includes('report_issue'), false);
});

test('core resources are registered without prompts or extra public tools', () => {
    const { resources, prompts } = collectRegisteredResourcesAndPrompts();

    assert.ok(resources.includes('vlossom.components'));
    assert.ok(resources.includes('vlossom.component'));
    assert.ok(resources.includes('vlossom.rules.vlossom-first'));
    assert.ok(resources.includes('vlossom.mcp.usage-examples'));
    assert.deepEqual(prompts, []);
});

test('advertised tool output schemas match structured MCP responses', async () => {
    const client = new Client({ name: 'vlossom-mcp-contract-test', version: '0.0.0' });
    const transport = new StdioClientTransport({
        command: process.execPath,
        args: ['dist/index.js'],
        cwd: packageRoot,
        stderr: 'pipe',
    });

    try {
        await client.connect(transport);
        await client.listTools();

        const calls = [
            {
                name: 'search_vlossom',
                arguments: { query: 'button', target: 'component', limit: 1 },
            },
            {
                name: 'get_vlossom_reference',
                arguments: { type: 'component', id: 'VsButton', include: ['summary'] },
            },
            {
                name: 'scaffold_vlossom_code',
                arguments: { kind: 'project-setup', description: 'dashboard', context: { framework: 'vite' } },
            },
            {
                name: 'validate_vlossom_usage',
                arguments: { kind: 'snippet', code: '<template><button>Save</button></template>' },
            },
        ];

        for (const call of calls) {
            const result = await client.callTool(call);
            const content = result.content as Array<{ type: string; text?: string }>;
            assert.equal(typeof result.structuredContent, 'object', `${call.name} should return structuredContent`);
            assert.equal(
                typeof content.find((entry) => entry.type === 'text')?.text,
                'string',
                `${call.name} should retain JSON text content for compatibility`,
            );
        }
    } finally {
        await client.close();
    }
});

test('build output contains only current tool modules', () => {
    const toolModules = readdirSync(path.join(packageRoot, 'dist/tools'))
        .filter((name) => name.endsWith('.js') && !name.endsWith('.js.map'))
        .sort();

    assert.deepEqual(toolModules, [
        'get-vlossom-reference.js',
        'scaffold-vlossom-code.js',
        'search-vlossom.js',
        'validate-vlossom-usage.js',
    ]);
});
