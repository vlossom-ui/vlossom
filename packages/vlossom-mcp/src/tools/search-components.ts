import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAllComponentsMeta } from "../services/meta-registry.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

export function registerSearchComponents(server: McpServer): void {
    server.tool(
        "search_components",
        "No prerequisite needed. " +
            "Call this when the user provides a specific component name or a clear, concrete keyword (e.g. 'button', 'input', 'drawer'). " +
            "Do NOT call this for vague or free-form descriptions — call clarify_intent first instead. " +
            "Searches component names, descriptions, and prop names/descriptions (case-insensitive) and returns all matching ComponentMeta objects. " +
            "Then call get_component for each result to get full details.",
        { query: z.string().describe("Search term to match against component names, descriptions, and prop names/descriptions") },
        async ({ query }) => {
            const start = Date.now();
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

            const meta = recordStep("search_components", `Search: ${query}`, Date.now() - start);

            if (results.length === 0) {
                return textResponse({
                    results: [],
                    message: `No components found for query '${query}'`,
                    next_action: "clarify_intent",
                    next_action_message:
                        "No components matched. Before filing an issue, call clarify_intent to check if the query " +
                        "can be rephrased — the user may be describing an existing component in different words. " +
                        "Only proceed to suggest_issue if clarification confirms the feature genuinely does not exist.",
                }, meta);
            }

            return textResponse({
                results,
                total: results.length,
                next_action: "get_component",
                next_action_message: "Call get_component for each result to get full props/StyleSet details.",
            }, meta);
        }
    );
}
