import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getComponentMeta } from "../services/meta-registry.js";
import { getRelationships } from "../services/relationships-registry.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

export function registerGetComponent(server: McpServer): void {
    server.tool(
        "get_component",
        "ALWAYS call list_components before this if you don't know the exact component name. " +
            "Call this when the user asks about a specific component's props, StyleSet, events, slots, or methods. " +
            "Returns the full ComponentMeta including props, styleSet, events, slots, and methods. " +
            "Then pass the component info to generate_component_code if the user wants to generate code.",
        {
            name: z.string().describe('Component name — accepts PascalCase ("VsButton") or kebab-case ("vs-button")'),
            includeRelationships: z.boolean().optional().default(false).describe("Include parent/children/siblings relationship data"),
        },
        async ({ name, includeRelationships }) => {
            const start = Date.now();
            const meta = getComponentMeta(name);
            if (!meta) {
                const meta_ = recordStep("get_component", `${name} detail`, Date.now() - start, { summary: "not found" });
                return textResponse({
                    error: `Component '${name}' not found. Use list_components to see available components.`,
                    next_actions: [
                        { tool: "list_components", reason: "verify the exact component name" },
                    ],
                }, meta_);
            }
            const relationships = includeRelationships ? getRelationships(name) : undefined;
            const summary = includeRelationships ? "props, styleSet, events, relationships" : "props, styleSet, events";
            const meta_ = recordStep("get_component", `${name} detail`, Date.now() - start, { summary });
            return textResponse({
                ...meta,
                ...(relationships ? { relationships } : {}),
                avoid: [
                    "Do not add a <style> block to override Vlossom component styles — use :style-set prop instead",
                    "Do not use inline style=\"\" attribute on Vlossom components",
                    "Do not create custom error <div> or <span> for validation — use :state and :state-message props",
                    "Do not hardcode hex/rgb colors — use the color-scheme prop or --vs-* CSS tokens",
                    "Do not target .vs-* CSS class selectors — they are internal and may change",
                ],
                next_actions: [
                    { tool: "get_css_tokens", reason: "find --vs-* design tokens for this component's styleSet variables" },
                    { tool: "generate_style_set", reason: "generate a StyleSet scaffold for this component" },
                    { tool: "generate_component_code", reason: "generate code using this component" },
                    { tool: "get_component_source", reason: "inspect the Vue source implementation" },
                    { tool: "report_issue", reason: "file an enhancement or bug report for this component (draft=true)" },
                ],
            }, meta_);
        }
    );
}
