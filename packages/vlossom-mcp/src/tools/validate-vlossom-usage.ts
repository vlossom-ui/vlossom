import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { validateVlossomUsage, type ValidateVlossomUsageInput } from '../internal/validation/validate-vlossom-usage';
import { recordStep, structuredResponse } from '../utils/mcp-response';
import { registerStructuredTool } from '../utils/register-tool';

const fileSchema = z.object({
    path: z.string(),
    content: z.string(),
});

const inputSchema = {
    kind: z.enum(['sfc', 'snippet', 'style-set', 'project-setup']),
    code: z.string().optional(),
    packageJson: z.string().optional(),
    files: z.array(fileSchema).optional(),
    context: z
        .object({
            framework: z.enum(['vite', 'nuxt']).optional(),
            version: z.string().optional(),
            components: z.array(z.string()).optional(),
            strict: z.boolean().optional(),
            vlossomFirst: z.enum(['strict', 'prefer', 'off']).optional(),
        })
        .optional(),
    mode: z.enum(['fast', 'strict', 'compile']).optional(),
};

const outputSchema = {
    status: z.enum(['ok', 'empty', 'ambiguous', 'error', 'skipped']),
    kind: z.string(),
    valid: z.boolean(),
    summary: z.string(),
    issues: z.array(z.record(z.unknown())),
    recommendations: z.array(z.string()).optional(),
    versionContext: z.record(z.unknown()).optional(),
    resourceUris: z.array(z.object({ uri: z.string(), description: z.string() })).optional(),
    next_actions: z.array(z.object({ tool: z.string(), reason: z.string() })),
};

export function registerValidateVlossomUsage(server: McpServer): void {
    registerStructuredTool<ValidateVlossomUsageInput>(
        server,
        'validate_vlossom_usage',
        'Call this before finalizing generated or user-written Vlossom code. ' +
            'Validates SFCs, snippets, StyleSet objects, and project setup against Vlossom metadata for the requested version. ' +
            'Detects empty input as skipped, unknown components, prop/slot/event/v-model mistakes, setup issues, and default Vlossom-first violations with explicit opt-out support. ' +
            'Then fix violations using get_vlossom_reference or scaffold_vlossom_code and validate again.',
        inputSchema,
        outputSchema,
        async (input) => {
            const start = Date.now();
            const result = await validateVlossomUsage(input);
            const meta = recordStep('validate_vlossom_usage', `Validate: ${input.kind}`, Date.now() - start, {
                summary:
                    result.status === 'skipped' ? 'skipped' : result.valid ? 'valid' : `${result.issues.length} issues`,
            });
            return structuredResponse(result, meta);
        },
    );
}
