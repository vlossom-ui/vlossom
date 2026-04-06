import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAllComponentsMeta } from "../services/meta-registry.js";
import { recordStep, resetSession, textResponse } from "../utils/mcp-response.js";
import { SYNONYM_MAP } from "../data/search-synonyms.js";


/** Expands a query string by appending synonym keywords. */
function expandQuery(query: string): string[] {
    const lower = query.toLowerCase();
    const terms = new Set([lower]);

    for (const [synonym, targets] of Object.entries(SYNONYM_MAP)) {
        if (lower.includes(synonym)) {
            for (const target of targets) {
                terms.add(target);
            }
        }
    }

    return [...terms];
}

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
            resetSession();
            const start = Date.now();
            const all = getAllComponentsMeta();
            const expandedTerms = expandQuery(query);

            const results = all.filter((component) => {
                return expandedTerms.some((term) => {
                    if (component.name.toLowerCase().includes(term)) return true;
                    if (component.kebabName.toLowerCase().includes(term)) return true;
                    if (component.description.toLowerCase().includes(term)) return true;

                    return component.props.some(
                        (prop) =>
                            prop.name.toLowerCase().includes(term) ||
                            prop.description.toLowerCase().includes(term)
                    );
                });
            });

            const meta = recordStep("search_components", `Search: ${query}`, Date.now() - start);

            if (results.length === 0) {
                return textResponse({
                    results: [],
                    expandedTerms: expandedTerms.length > 1 ? expandedTerms : undefined,
                    message: `No components found for query '${query}'`,
                    next_actions: [
                        { tool: "clarify_intent", reason: "rephrase the query to match existing components before giving up" },
                        { tool: "check_github_token", reason: "file an enhancement issue if the feature genuinely does not exist" },
                    ],
                }, meta);
            }

            return textResponse({
                results,
                total: results.length,
                expandedTerms: expandedTerms.length > 1 ? expandedTerms : undefined,
                next_actions: [
                    { tool: "get_component", reason: "get full props/StyleSet details for each matching component" },
                    { tool: "compare_components", reason: "compare two similar components side by side" },
                ],
            }, meta);
        }
    );
}
