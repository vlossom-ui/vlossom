import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import { scaffoldVlossomCode, type ScaffoldVlossomCodeInput } from '../internal/scaffold/scaffold-service';
import { recordStep, structuredResponse } from '../utils/mcp-response';
import { registerStructuredTool } from '../utils/register-tool';

const inputSchema = {
    kind: z.enum(['component-usage', 'style-set', 'project-setup']),
    description: z.string(),
    components: z.array(z.string()).optional(),
    component: z.string().optional(),
    context: z
        .object({
            framework: z.enum(['vite', 'nuxt']).optional(),
            vueStyle: z.enum(['script-setup']).optional(),
            typescript: z.boolean().optional(),
            hasBusinessLogic: z.boolean().optional(),
            hasValidation: z.boolean().optional(),
            responsive: z.boolean().optional(),
            version: z.string().optional(),
            packageJson: z.string().optional(),
        })
        .optional(),
    policy: z
        .object({
            vlossomFirst: z.enum(['strict', 'prefer', 'off']).optional(),
            allowNativeControls: z.boolean().optional(),
            allowThirdPartyUi: z.boolean().optional(),
        })
        .optional(),
    output: z
        .object({
            format: z.enum(['sfc', 'snippet', 'object', 'markdown']).optional(),
            includeRules: z.boolean().optional(),
        })
        .optional(),
};

const outputSchema = {
    status: z.enum(['ok', 'empty', 'ambiguous', 'error', 'skipped']),
    kind: z.string(),
    policy: z
        .object({
            vlossomFirst: z.enum(['strict', 'prefer', 'off']),
            allowNativeControls: z.boolean(),
            allowThirdPartyUi: z.boolean(),
        })
        .optional(),
    assumptions: z.array(z.string()),
    coveredRequirements: z.array(z.unknown()).optional(),
    uncoveredRequirements: z.array(z.unknown()).optional(),
    validationPayload: z.unknown().optional(),
    code: z.string().optional(),
    scaffold: z.unknown().optional(),
    error: z.string().optional(),
    versionContext: z.record(z.unknown()).optional(),
    unknownComponents: z.array(z.string()).optional(),
    unsupportedComponents: z.array(z.record(z.unknown())).optional(),
    resourceUris: z.array(z.object({ uri: z.string(), description: z.string() })).optional(),
    next_actions: z.array(z.object({ tool: z.string(), reason: z.string() })),
};

export function registerScaffoldVlossomCode(server: McpServer): void {
    registerStructuredTool<ScaffoldVlossomCodeInput>(
        server,
        'scaffold_vlossom_code',
        'Call this after search_vlossom/get_vlossom_reference when the user wants starting code. ' +
            'Creates Vlossom-native harnesses for project setup, StyleSet objects, or explicit component usage. ' +
            'Verifies requested components against the registry before scaffolding. ' +
            'For component or StyleSet code, pass packageJson/version or scaffold project setup first. ' +
            'Then call validate_vlossom_usage before presenting the scaffold as usable code.',
        inputSchema,
        outputSchema,
        async (input) => {
            const start = Date.now();
            const result = await scaffoldVlossomCode(input);
            const meta = recordStep(
                'scaffold_vlossom_code',
                `${input.kind}: ${input.description.slice(0, 28)}`,
                Date.now() - start,
                { summary: result.status === 'ok' ? 'scaffold ready' : 'scaffold rejected' },
            );
            return structuredResponse(result, meta);
        },
    );
}
