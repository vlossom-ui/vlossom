import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getComponentMeta } from "../services/meta-registry.js";
import { getRelationships } from "../services/relationships-registry.js";
import { textResponse } from "../utils/mcp-response.js";

export function registerGetComponentRelationships(server: McpServer): void {
    server.tool(
        "get_component_relationships",
        "No prerequisite needed. " +
            "Call this when the user asks about component composition, which components work together, or what wraps or contains a component. " +
            "Returns parent, children, and siblings relationships from curated relationship data. " +
            "Then use this with get_component to understand the full composition structure before generate_component_code.",
        { name: z.string().describe('Component name — accepts PascalCase ("VsButton") or kebab-case ("vs-button")') },
        async ({ name }) => {
            const meta = getComponentMeta(name);
            if (!meta) {
                return textResponse({
                    error: `Component '${name}' not found.`,
                });
            }

            const relationships = getRelationships(name);

            return textResponse({
                component: meta.name,
                ...relationships,
            });
        }
    );
}
