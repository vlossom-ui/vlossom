import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import { validateCode, buildSummary } from "../utils/code-validators.js";
import type { ValidationIssue } from "../utils/code-validators.js";

export function registerValidateComponentUsage(server: McpServer): void {
    server.tool(
        "validate_component_usage",
        "No prerequisite needed. " +
            "Call this when the user wants to check if their Vue SFC follows Vlossom coding conventions. " +
            "Statically analyzes the code string for rule violations (import style, StyleSet usage, forbidden patterns). " +
            "Then call generate_component_code to get the corrected scaffold if critical violations are found.",
        {
            code: z.string().describe("Raw Vue SFC string to validate"),
            strict: z
                .boolean()
                .optional()
                .default(false)
                .describe(
                    "When true, also check recommended rules (R05, R06, R13). Default: false checks only critical rules."
                ),
        },
        async ({ code, strict }) => {
            const start = Date.now();

            if (!code || code.trim().length === 0) {
                const stepMeta = recordStep("validate_component_usage", "Validate SFC", Date.now() - start);
                return textResponse(
                    {
                        valid: true,
                        issues: [] as ValidationIssue[],
                        summary: "No code provided — nothing to validate.",
                        next_action: "get_component",
                        next_action_message:
                            "Pass a Vue SFC string to validate. Call get_component to explore components or generate_component_code for a scaffold.",
                    },
                    stepMeta
                );
            }

            const issues = validateCode(code, strict);
            const hasErrors = issues.some((i) => i.severity === "error");
            const summary = buildSummary(issues);
            const stepMeta = recordStep("validate_component_usage", "Validate SFC", Date.now() - start);

            return textResponse(
                {
                    valid: !hasErrors,
                    issues,
                    summary,
                    next_action: hasErrors ? "generate_component_code" : "get_component",
                    next_action_message: hasErrors
                        ? "Critical violations found. Call generate_component_code to get a corrected scaffold following Vlossom conventions."
                        : "Code looks good. Call get_component to explore more components or get_css_tokens for design tokens.",
                },
                stepMeta
            );
        }
    );
}
