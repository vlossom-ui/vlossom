import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAllComponentsMeta } from "../services/meta-registry.js";
import { textResponse } from "../utils/mcp-response.js";

export function registerSearchComponents(server: McpServer): void {
    server.tool(
        "search_components",
        "No prerequisite needed. " +
            "Call this when the user searches for components by keyword or use case, or asks 'which component should I use for X'. " +
            "Searches component names, descriptions, and prop names/descriptions (case-insensitive) and returns all matching ComponentMeta objects. " +
            "Then call get_component for each result to get full details, or pass to generate_component_code.",
        { query: z.string().describe("Search term to match against component names, descriptions, and prop names/descriptions") },
        async ({ query }) => {
            const all = getAllComponentsMeta();
            const lowerQuery = query.toLowerCase();

            const results = all.filter((component) => {
                if (component.name.toLowerCase().includes(lowerQuery)) return true;
                if (component.kebabName.toLowerCase().includes(lowerQuery)) return true;
                if (component.description.toLowerCase().includes(lowerQuery)) return true;

                return component.props.some(
                    (prop) =>
                        prop.name.toLowerCase().includes(lowerQuery) ||
                        prop.description.toLowerCase().includes(lowerQuery)
                );
            });

            if (results.length === 0) {
                return textResponse({
                    results: [],
                    message: `No components found for query '${query}'`,
                });
            }

            return textResponse({
                results,
                total: results.length,
            });
        }
    );
}
