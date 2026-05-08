import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { getVlossomReference, type GetVlossomReferenceInput } from '../internal/reference/reference-service';
import { recordStep, structuredResponse } from '../utils/mcp-response';
import { registerStructuredTool } from '../utils/register-tool';

const includeSchema = z.enum([
    'summary',
    'api',
    'props',
    'slots',
    'events',
    'methods',
    'styleSet',
    'examples',
    'source',
    'relationships',
    'migration',
    'rules',
]);

const inputSchema = {
    type: z.enum(['component', 'directive', 'composable', 'token', 'option', 'changelog', 'rule']),
    id: z.string().optional(),
    include: z.array(includeSchema).optional(),
    version: z.string().optional(),
    packageJson: z.string().optional(),
    language: z.enum(['ko', 'en']).optional(),
};

const outputSchema = {
    status: z.enum(['ok', 'empty', 'ambiguous', 'error', 'skipped']),
    found: z.boolean(),
    type: z.string(),
    id: z.string().optional(),
    reference: z.record(z.unknown()).optional(),
    message: z.string().optional(),
    versionContext: z.record(z.unknown()).optional(),
    resourceUris: z.array(z.object({ uri: z.string(), description: z.string() })).optional(),
    next_actions: z.array(z.object({ tool: z.string(), reason: z.string() })),
};

export function registerGetVlossomReference(server: McpServer): void {
    registerStructuredTool<GetVlossomReferenceInput>(
        server,
        'get_vlossom_reference',
        'Call this after search_vlossom returns a registry-backed id or when the user asks for exact Vlossom APIs. ' +
            'Returns source-of-truth component metadata, GitHub-backed source, relationships, directives, composables, tokens, options, changelog, or rules. ' +
            'Component API data comes from the GitHub registry for the requested version and source is fetched only when requested. ' +
            'Then use scaffold_vlossom_code or validate_vlossom_usage with the returned exact API.',
        inputSchema,
        outputSchema,
        async (input) => {
            const start = Date.now();
            const result = await getVlossomReference(input);
            const meta = recordStep(
                'get_vlossom_reference',
                `${input.type}: ${input.id ?? 'index'}`,
                Date.now() - start,
                { summary: result.found ? 'reference found' : 'not found' },
            );
            return structuredResponse(result, meta);
        },
    );
}
