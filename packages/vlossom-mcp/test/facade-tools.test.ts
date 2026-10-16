import assert from 'node:assert/strict';
import { readdirSync } from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { scaffoldVlossomCode } from '../dist/internal/scaffold/scaffold-service';
import { createServer } from '../dist/server';

const packageRoot = process.cwd();

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
