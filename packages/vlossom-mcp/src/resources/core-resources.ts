import { readFileSync } from 'fs';
import { resolve } from 'path';
import { McpServer, ResourceTemplate } from '@modelcontextprotocol/sdk/server/mcp.js';
import { getAllComponentsMeta } from '../services/meta-registry';
import { resolveGitHubVersionContext } from '../services/github-registry-service';
import { getVlossomReference } from '../internal/reference/reference-service';
import { loadCssTokens, VLOSSOM_OPTIONS } from '../internal/reference/reference-data';
import { fetchChangelog } from '../services/github-reference-service';
import { getRule, getRuleRegistry } from '../internal/validation/rule-registry';
import { toComponentSummary } from '../internal/types';
import { resolveVersionContext } from '../internal/version/version-service';

const packageRoot = resolve(__dirname, '../..');

function jsonResource(uri: string, data: unknown) {
    return {
        contents: [
            {
                uri,
                mimeType: 'application/json',
                text: JSON.stringify(data, null, 2),
            },
        ],
    };
}

function markdownResource(uri: string, text: string) {
    return {
        contents: [
            {
                uri,
                mimeType: 'text/markdown',
                text,
            },
        ],
    };
}

function readPackageMarkdown(filename: string, fallback: string): string {
    try {
        return readFileSync(resolve(packageRoot, filename), 'utf8');
    } catch {
        return fallback;
    }
}

async function resolveMainPreviewContext() {
    const versionContext = await resolveGitHubVersionContext(resolveVersionContext());
    return {
        ...versionContext,
        warnings: [
            ...versionContext.warnings,
            'MCP resources are main-branch previews because resources cannot accept version input. Use facade tools with packageJson or version for exact version-specific guidance.',
        ],
    };
}

const STYLE_SET_RULES = `# Vlossom StyleSet Rules

- Use GitHub-resolved StyleSet interfaces from get_vlossom_reference.
- Use variables only for keys exposed by the resolved metadata.
- Put CSSProperties-shaped values under component or declared child StyleSet keys.
- Prefer --vs-* tokens for theme-aware values.
- Do not target internal .vs-* selectors from arbitrary CSS.
`;

const USAGE_EXAMPLES = `# vlossom-mcp Usage Examples

## Implement UI

1. search_vlossom({ intent: "build-ui", query: "<requirements>", packageJson })
2. get_vlossom_reference({ type: "component", id: "<returned component>", packageJson })
3. scaffold_vlossom_code({ kind: "component-usage", description: "<requirements>", context: { packageJson } })
4. validate_vlossom_usage({ kind: "sfc", code: "<candidate code>", packageJson })

## Review UI

1. validate_vlossom_usage({ kind: "sfc", code: "<user code>", packageJson, mode: "strict" })
2. get_vlossom_reference for any component, prop, slot, event, token, or rule violation
3. validate again after fixes
`;

export function registerCoreResources(server: McpServer): void {
    server.registerResource(
        'vlossom.components',
        'vlossom://components',
        {
            title: 'Vlossom Components',
            description: 'Registry-backed Vlossom component summaries.',
            mimeType: 'application/json',
        },
        async () => {
            const versionContext = await resolveMainPreviewContext();
            const components = await getAllComponentsMeta(versionContext);
            return jsonResource('vlossom://components', {
                versionContext,
                components: components.map(toComponentSummary),
            });
        },
    );

    server.registerResource(
        'vlossom.component',
        new ResourceTemplate('vlossom://components/{name}', {
            list: async () => {
                const versionContext = await resolveMainPreviewContext();
                return {
                    resources: (await getAllComponentsMeta(versionContext)).map((component) => ({
                        uri: `vlossom://components/${component.name}`,
                        name: component.name,
                        title: component.name,
                        description: component.description,
                        mimeType: 'application/json',
                    })),
                };
            },
            complete: {
                name: async (value) => {
                    const versionContext = await resolveMainPreviewContext();
                    return (await getAllComponentsMeta(versionContext))
                        .map((component) => component.name)
                        .filter((name) => name.toLowerCase().startsWith(value.toLowerCase()))
                        .slice(0, 20);
                },
            },
        }),
        {
            title: 'Vlossom Component Reference',
            description: 'GitHub-backed component reference preview.',
            mimeType: 'application/json',
        },
        async (_uri, variables) => {
            const name = String(variables['name'] ?? '');
            const versionContext = await resolveMainPreviewContext();
            const result = await getVlossomReference({
                type: 'component',
                id: name,
                include: ['summary', 'api', 'relationships', 'rules'],
            });
            return jsonResource(`vlossom://components/${name}`, {
                ...result,
                versionContext: {
                    ...(result.versionContext ?? versionContext),
                    warnings: [
                        ...(result.versionContext?.warnings ?? versionContext.warnings),
                        ...versionContext.warnings.filter(
                            (warning) => !(result.versionContext?.warnings ?? []).includes(warning),
                        ),
                    ],
                },
            });
        },
    );

    server.registerResource(
        'vlossom.tokens.css',
        'vlossom://tokens/css',
        {
            title: 'Vlossom CSS Tokens',
            description: 'GitHub-backed Vlossom CSS token registry preview.',
            mimeType: 'application/json',
        },
        async () => {
            const versionContext = await resolveMainPreviewContext();
            return jsonResource('vlossom://tokens/css', {
                versionContext,
                tokens: await loadCssTokens(versionContext),
            });
        },
    );

    server.registerResource(
        'vlossom.options.create-vlossom',
        'vlossom://options/create-vlossom',
        {
            title: 'createVlossom Options',
            description: 'createVlossom setup options and plugin configuration contract.',
            mimeType: 'application/json',
        },
        () => jsonResource('vlossom://options/create-vlossom', VLOSSOM_OPTIONS),
    );

    server.registerResource(
        'vlossom.rules.coding',
        'vlossom://rules/coding',
        {
            title: 'Vlossom Coding Rules',
            description: 'Registry of Vlossom coding rules used by validation.',
            mimeType: 'application/json',
        },
        () => jsonResource('vlossom://rules/coding', getRuleRegistry()),
    );

    server.registerResource(
        'vlossom.rules.style-set',
        'vlossom://rules/style-set',
        {
            title: 'Vlossom StyleSet Rules',
            description: 'StyleSet validation and scaffolding rules.',
            mimeType: 'text/markdown',
        },
        () => markdownResource('vlossom://rules/style-set', STYLE_SET_RULES),
    );

    server.registerResource(
        'vlossom.rules.vlossom-first',
        'vlossom://rules/vlossom-first',
        {
            title: 'Vlossom-First Guidance',
            description: 'Default Vlossom-first guard for covered UI patterns.',
            mimeType: 'application/json',
        },
        () =>
            jsonResource('vlossom://rules/vlossom-first', {
                policy: 'By default, report native or third-party UI when the detected Vlossom version has covered alternatives.',
                rule: getRule('PREFER_VLOSSOM_COMPONENT'),
            }),
    );

    server.registerResource(
        'vlossom.changelog',
        'vlossom://changelog',
        {
            title: 'Vlossom Changelog',
            description: 'GitHub-backed Vlossom changelog summary.',
            mimeType: 'application/json',
        },
        async () => jsonResource('vlossom://changelog', await fetchChangelog()),
    );

    server.registerResource(
        'vlossom.decisions',
        'vlossom://decisions',
        {
            title: 'vlossom-mcp Decisions',
            description: 'Architecture and product decisions for vlossom-mcp.',
            mimeType: 'text/markdown',
        },
        () => markdownResource('vlossom://decisions', readPackageMarkdown('DECISIONS.md', '# vlossom-mcp Decisions\n')),
    );

    server.registerResource(
        'vlossom.mcp.usage-examples',
        'vlossom://mcp/usage-examples',
        {
            title: 'vlossom-mcp Usage Examples',
            description: 'Search -> Reference -> Scaffold -> Validate workflow examples.',
            mimeType: 'text/markdown',
        },
        () => markdownResource('vlossom://mcp/usage-examples', USAGE_EXAMPLES),
    );
}
