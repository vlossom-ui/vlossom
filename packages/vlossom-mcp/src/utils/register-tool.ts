import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';

type ToolHandler<TArgs> = (args: TArgs) => unknown | Promise<unknown>;

interface StructuredToolServer {
    registerTool?: (
        name: string,
        config: {
            description: string;
            inputSchema: unknown;
            outputSchema: unknown;
        },
        handler: ToolHandler<unknown>,
    ) => unknown;
    tool: (...args: unknown[]) => unknown;
}

export function registerStructuredTool<TArgs>(
    server: McpServer,
    name: string,
    description: string,
    inputSchema: unknown,
    outputSchema: unknown,
    handler: ToolHandler<TArgs>,
): void {
    const structuredServer = server as unknown as StructuredToolServer;

    if (typeof structuredServer.registerTool === 'function') {
        structuredServer.registerTool(
            name,
            { description, inputSchema, outputSchema },
            handler as ToolHandler<unknown>,
        );
        return;
    }

    structuredServer.tool(name, description, inputSchema, handler);
}
