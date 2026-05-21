import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { searchVlossom, type SearchVlossomInput } from '../internal/search/component-search-service';
import { recordStep, resetSession, structuredResponse } from '../utils/mcp-response';
import { registerStructuredTool } from '../utils/register-tool';

const inputSchema = {
    query: z.string().optional(),
    target: z
        .enum(['component', 'directive', 'composable', 'token', 'option', 'changelog', 'rule', 'all'])
        .optional()
        .default('component'),
    intent: z.enum(['lookup', 'build-ui', 'style', 'setup', 'migration', 'validate']).optional().default('lookup'),
    limit: z.number().int().min(1).max(50).optional(),
    version: z.string().optional(),
    packageJson: z.string().optional(),
    language: z.enum(['ko', 'en']).optional(),
};

const outputSchema = {
    status: z.enum(['ok', 'empty', 'ambiguous', 'error', 'skipped']),
    query: z.string().optional(),
    target: z.string(),
    intent: z.string(),
    total: z.number(),
    results: z.array(z.record(z.unknown())),
    error: z.string().optional(),
    coverage: z.array(z.record(z.unknown())).optional(),
    choices: z.array(z.record(z.unknown())).optional(),
    versionContext: z.record(z.unknown()).optional(),
    expandedTerms: z.array(z.string()).optional(),
    resourceUris: z.array(z.object({ uri: z.string(), description: z.string() })).optional(),
    next_actions: z.array(z.object({ tool: z.string(), reason: z.string() })),
};

export function registerSearchVlossom(server: McpServer): void {
    registerStructuredTool<SearchVlossomInput>(
        server,
        'search_vlossom',
        'Call this before writing Vlossom UI code or when discovering what exists. ' +
            'Searches the compact component index by default; pass an explicit target for directives, composables, tokens, options, rules, or changelog entries. ' +
            "For target:'component' with an empty query, returns the compact component list. " +
            'Then call get_vlossom_reference for exact APIs or scaffold_vlossom_code for a Vlossom-native starting point.',
        inputSchema,
        outputSchema,
        async (input) => {
            resetSession();
            const start = Date.now();
            const result = await searchVlossom(input);
            const label = input.query ? `Search: ${input.query.slice(0, 32)}` : `Search: ${result.target}`;
            const meta = recordStep('search_vlossom', label, Date.now() - start, {
                summary:
                    result.status === 'ambiguous'
                        ? `${result.choices?.length ?? 0} choices`
                        : `${result.total} results`,
            });
            return structuredResponse(result, meta);
        },
    );
}
