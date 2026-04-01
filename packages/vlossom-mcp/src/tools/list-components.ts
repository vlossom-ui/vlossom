import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getComponents } from "../services/component-registry.js";
import { textResponse } from "../utils/mcp-response.js";

export function registerListComponents(server: McpServer): void {
    server.tool(
        "list_components",
        "Get a list of all Vlossom UI components with their names and descriptions.",
        {},
        () => textResponse(getComponents())
    );
}
