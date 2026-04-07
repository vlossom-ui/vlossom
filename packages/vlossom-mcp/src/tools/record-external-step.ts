import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, resetSession, textResponse } from "../utils/mcp-response.js";

export function registerRecordExternalStep(server: McpServer): void {
    server.tool(
        "record_external_step",
        "Call this immediately after calling any non-vlossom tool (e.g. Figma, Slack, GitLab) " +
            "that is part of the current vlossom workflow, so it appears in the pipeline stepper. " +
            "Records the external tool call into the vlossom-mcp session tracker. " +
            "Pass reset: true when this is the first step of a new workflow. " +
            "Then continue with vlossom tools as normal.",
        {
            tool: z.string().describe(
                'The external tool name as it was called (e.g. "get_design_context", "get_screenshot")',
            ),
            label: z.string().describe(
                'Short human-readable description, max 23 chars (e.g. "Ordo button design")',
            ),
            reset: z.boolean().optional().describe(
                "Set true when starting a brand-new Figma+Vlossom workflow to clear previous session steps",
            ),
        },
        async ({ tool, label, reset }) => {
            if (reset) resetSession();
            const meta = recordStep(tool, label, 0);
            return textResponse(
                {
                    recorded: true,
                    step: meta.steps.at(-1),
                    next_actions: [
                        { tool: "get_component",          reason: "get props/StyleSet for a component identified in the design" },
                        { tool: "suggest_components",     reason: "find matching vlossom components for the design use case" },
                        { tool: "generate_component_code", reason: "generate vlossom code from the captured design" },
                    ],
                },
                meta,
            );
        },
    );
}
