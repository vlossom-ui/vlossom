import { readFileSync } from 'fs';
import { resolve } from 'path';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { registerCoreResources } from './resources/core-resources';
import { registerGetVlossomReference } from './tools/get-vlossom-reference';
import { registerScaffoldVlossomCode } from './tools/scaffold-vlossom-code';
import { registerSearchVlossom } from './tools/search-vlossom';
import { registerValidateVlossomUsage } from './tools/validate-vlossom-usage';

const { version } = JSON.parse(readFileSync(resolve(__dirname, '../package.json'), 'utf8')) as { version: string };

const INSTRUCTIONS = `You are an assistant for the Vlossom Vue UI library.

vlossom-mcp is a compact source-of-truth harness, not a documentation chatbot,
generic Vue generator, or GitHub issue bot. Use the public workflow:

1. search_vlossom — discover registry-backed Vlossom coverage.
2. get_vlossom_reference — retrieve exact APIs, source references, and rules.
3. scaffold_vlossom_code — create a Vlossom setup, StyleSet, or explicit usage harness.
4. validate_vlossom_usage — report Vlossom metadata mismatches before finalizing code.

Vlossom-first harness policy:
- Use this MCP to retrieve exact Vlossom facts and keep UI work Vlossom-first by default.
- Native controls or third-party UI are exceptions when the user explicitly asks or context.vlossomFirst:'off' is provided.
- The guard is grounded in detected Vlossom version metadata; do not invent unsupported APIs.
- For a new project, start with scaffold_vlossom_code kind:'project-setup' before creating UI.
- For a migration, validate package.json and setup files with validate_vlossom_usage kind:'project-setup' before replacing UI patterns.
- Before using a component API, call get_vlossom_reference for the exact id.
- Before finalizing UI code, call validate_vlossom_usage.

Never invent component APIs. Component APIs must come from get_vlossom_reference or validation output.
Unknown or empty code should be treated as an actionable missing input, not as valid code.
`;

export function createServer(): McpServer {
    const server = new McpServer({ name: 'vlossom-mcp', version }, { instructions: INSTRUCTIONS });

    registerSearchVlossom(server);
    registerGetVlossomReference(server);
    registerScaffoldVlossomCode(server);
    registerValidateVlossomUsage(server);
    registerCoreResources(server);

    return server;
}
