import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getComponentMeta } from "../services/meta-registry.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

export function registerGetComponent(server: McpServer): void {
    server.tool(
        "get_component",
        "ALWAYS call list_components before this if you don't know the exact component name. " +
            "Call this when the user asks about a specific component's props, StyleSet, events, slots, or methods. " +
            "Returns the full ComponentMeta including props, styleSet, events, slots, and methods. " +
            "Then pass the component info to generate_component_code if the user wants to generate code.",
        { name: z.string().describe('Component name — accepts PascalCase ("VsButton") or kebab-case ("vs-button")') },
        async ({ name }) => {
            const start = Date.now();
            const meta = getComponentMeta(name);
            const meta_ = recordStep("get_component", `${name} detail`, Date.now() - start);
            if (!meta) {
                return textResponse({
                    error: `Component '${name}' not found. Use list_components to see available components.`,
                    next_action: "list_components",
                    next_action_message: "Component not found. Call list_components to verify the exact name.",
                }, meta_);
            }
            return textResponse({
                ...meta,
                next_action: "get_css_tokens",
                next_action_message:
                    "Call get_css_tokens for design tokens to use in this component's styleSet, " +
                    "get_component_relationships to understand composition, " +
                    "or get_component_source to inspect the implementation.",
            }, meta_);
        }
    );
}
