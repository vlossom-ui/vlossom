import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAllComponentsMeta } from "../services/meta-registry.js";
import { recordStep, resetSession, textResponse } from "../utils/mcp-response.js";
import type { ComponentMeta } from "../types/meta.js";

const STOP_WORDS = new Set(["a", "an", "the", "for", "with", "and", "or", "to", "of", "in", "that", "is", "are"]);

const MAX_RESULTS = 8;

function extractKeywords(useCase: string): string[] {
    return useCase
        .toLowerCase()
        .split(/[\s,./]+/)
        .map((w) => w.replace(/[^a-z0-9\uAC00-\uD7A3]/g, ""))
        .filter((w) => w.length > 1 && !STOP_WORDS.has(w));
}

function searchByKeyword(all: ComponentMeta[], keyword: string): ComponentMeta[] {
    return all.filter((component) => {
        if (component.name.toLowerCase().includes(keyword)) return true;
        if (component.kebabName.toLowerCase().includes(keyword)) return true;
        if (component.description.toLowerCase().includes(keyword)) return true;
        return component.props.some(
            (prop) => prop.name.toLowerCase().includes(keyword) || prop.description.toLowerCase().includes(keyword)
        );
    });
}

function buildReasoning(useCase: string, matchedNames: string[], components: ComponentMeta[]): string {
    if (components.length === 0) {
        return `No components matched for use case: '${useCase}'.`;
    }

    const nameToMeta = new Map(components.map((c) => [c.name, c]));
    const descriptions = matchedNames
        .map((name) => nameToMeta.get(name))
        .filter((c): c is ComponentMeta => c !== undefined)
        .map((c) => `${c.name} (${c.description})`)
        .join(", ");

    return `Based on '${useCase}' use case: ${descriptions}. Call get_component for each to check props/StyleSet, then generate_component_code.`;
}

export function registerSuggestComponents(server: McpServer): void {
    server.tool(
        "suggest_components",
        "No prerequisite needed. " +
            "Call this when the user describes a specific use case or feature to build (e.g. 'login form', 'file upload', 'data table'). " +
            "If the user's description is vague or ambiguous, call clarify_intent first instead. " +
            "Searches component metadata by keyword and returns matching Vlossom components. " +
            "Then call get_component for each result to check props/StyleSet, then generate_component_code.",
        { useCase: z.string().describe("Description of the use case or feature to build (e.g. 'login form', 'file upload feature', 'data table with pagination')") },
        async ({ useCase }) => {
            resetSession();
            const start = Date.now();
            const all = getAllComponentsMeta();
            const keywords = extractKeywords(useCase);

            const seen = new Set<string>();
            const orderedNames: string[] = [];

            const addName = (name: string) => {
                if (!seen.has(name)) {
                    seen.add(name);
                    orderedNames.push(name);
                }
            };

            // 키워드 기반 메타데이터 검색
            for (const keyword of keywords) {
                const searchMatches = searchByKeyword(all, keyword);
                for (const component of searchMatches) {
                    addName(component.name);
                }
            }

            const limitedNames = orderedNames.slice(0, MAX_RESULTS);

            const nameToMeta = new Map(all.map((c) => [c.name, c]));
            const components = limitedNames
                .map((name) => nameToMeta.get(name))
                .filter((c): c is ComponentMeta => c !== undefined);

            const reasoning = buildReasoning(useCase, limitedNames, components);
            const shortUseCase = useCase.length > 28 ? useCase.slice(0, 25) + '…' : useCase;
            const meta = recordStep("suggest_components", `Suggest: ${shortUseCase}`, Date.now() - start);

            if (components.length === 0) {
                return textResponse({
                    components: [],
                    reasoning,
                    message: `No components matched for use case: '${useCase}'.`,
                    next_action: "check_github_token",
                    next_action_message: `💡 '${useCase}' does not match any existing Vlossom component. To file an enhancement issue, start with check_github_token.`,
                }, meta);
            }

            return textResponse({
                components,
                reasoning,
                total: components.length,
                next_action: "get_component",
                next_action_message: "Call get_component for each result to check props/StyleSet, then generate_component_code.",
            }, meta);
        }
    );
}
