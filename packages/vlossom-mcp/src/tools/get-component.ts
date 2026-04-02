import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getComponentMeta } from "../services/meta-registry.js";
import { textResponse } from "../utils/mcp-response.js";

export function registerGetComponent(server: McpServer): void {
    server.tool(
        "get_component",
        "ALWAYS call list_components before this if you don't know the exact component name. " +
            "Call this when the user asks about a specific component's props, StyleSet, events, slots, or methods. " +
            "Returns the full ComponentMeta including props, styleSet, events, slots, and methods. " +
            "Then pass the component info to generate_component_code if the user wants to generate code.",
        { name: z.string().describe('Component name — accepts PascalCase ("VsButton") or kebab-case ("vs-button")') },
        async ({ name }) => {
            const meta = getComponentMeta(name);
            if (!meta) {
                return textResponse({
                    error: `Component '${name}' not found. Use list_components to see available components.`,
                });
            }
            return textResponse(meta);
        }
    );
}
