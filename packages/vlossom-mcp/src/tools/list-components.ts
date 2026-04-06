import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getComponents } from "../services/component-registry.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

export function registerListComponents(server: McpServer): void {
    server.tool(
        "list_components",
        "Call this when the user asks to see all available Vlossom components or when you need to verify an exact component name. " +
            "Returns all component names and descriptions. " +
            "Then call get_component for full details on a specific component.",
        {},
        () => {
            const start = Date.now();
            const result = getComponents();
            const meta = recordStep("list_components", "List all components", Date.now() - start);
            return textResponse({
                result,
                next_action: "get_component",
                next_action_message: "Pick a component from the list and call get_component for full details.",
            }, meta);
        }
    );
}
