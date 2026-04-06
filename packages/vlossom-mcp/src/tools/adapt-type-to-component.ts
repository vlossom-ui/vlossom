import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import { resolveComponent } from "../utils/component-resolution.js";
import { COMPONENT_ADAPTATION_GUIDES } from "../data/adaptation-guides.js";

export function registerAdaptTypeToComponent(server: McpServer): void {
    server.tool(
        "adapt_type_to_component",
        "ALWAYS call get_component before this to confirm the target component's props. " +
            "Call this when the user has an existing TypeScript interface and wants to use it with a specific Vlossom component. " +
            "Returns converted component data (e.g. columns array for VsTable, options array for VsSelect) with a usage example. " +
            "Then pass the converted data to generate_component_code for the final scaffold.",
        {
            userType: z
                .string()
                .describe(
                    'TypeScript interface or type definition, e.g. "interface User { id: number; name: string; email: string }"'
                ),
            targetComponent: z
                .string()
                .describe(
                    'Target Vlossom component — PascalCase ("VsTable") or kebab-case ("vs-table")'
                ),
        },
        async ({ userType, targetComponent }) => {
            const start = Date.now();

            const { meta, errorResponse } = resolveComponent(
                targetComponent,
                "adapt_type_to_component",
                start
            );
            if (!meta) return errorResponse!;

            const match = userType.match(/(?:export\s+)?(?:interface|type)\s+(\w+)/);
            const userTypeName = match ? match[1] : "YourType";
            const componentName = meta.name;

            const guide = COMPONENT_ADAPTATION_GUIDES[componentName];

            if (!guide) {
                const stepMeta = recordStep(
                    "adapt_type_to_component",
                    `Adapt: ${userTypeName} → ${componentName}`,
                    Date.now() - start
                );
                return textResponse(
                    {
                        component: componentName,
                        userTypeName,
                        guide:
                            `No specific adaptation guide for ${componentName}. ` +
                            "Review the component's props via get_component, then map your interface fields to the relevant props. " +
                            "Common patterns: array data → items/options prop, single value → modelValue, display config → dedicated prop.",
                        outputShape: "varies",
                        example: "",
                        rules: [],
                        next_actions: [
                            { tool: "generate_component_code", reason: "generate a component scaffold using the generic conversion" },
                            { tool: "get_component", reason: "review the target component's props before generating" },
                        ],
                    },
                    stepMeta
                );
            }

            const stepMeta = recordStep(
                "adapt_type_to_component",
                `Adapt: ${userTypeName} → ${componentName}`,
                Date.now() - start
            );
            return textResponse(
                {
                    component: componentName,
                    userTypeName,
                    guide: guide.description,
                    outputShape: guide.outputShape,
                    example: guide.example(userTypeName),
                    rules: guide.rules,
                    next_actions: [
                        { tool: "generate_component_code", reason: "generate a component scaffold using the converted data" },
                        { tool: "get_component", reason: "review the target component's props if needed" },
                    ],
                },
                stepMeta
            );
        }
    );
}
