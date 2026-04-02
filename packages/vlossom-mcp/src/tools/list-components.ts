import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getComponents } from "../services/component-registry.js";
import { resetSession, recordStep, textResponse } from "../utils/mcp-response.js";

export function registerListComponents(server: McpServer): void {
    server.tool(
        "list_components",
        "Get a list of all Vlossom UI components with their names and descriptions.",
        {},
        () => {
            resetSession();
            const start = Date.now();
            const result = getComponents();
            const meta = recordStep("list_components", "List all components", Date.now() - start);
            return textResponse(result, meta);
        }
    );
}
