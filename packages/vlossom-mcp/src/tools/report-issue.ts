import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createIssue, getGitHubToken } from "../services/github-client.js";
import { textResponse } from "../utils/mcp-response.js";

export function registerReportIssue(server: McpServer): void {
    server.tool(
        "report_issue",
        "Create a GitHub issue on the Vlossom repository. " +
            "Call draft_issue first and fill in all requiredSections with the user before calling this. " +
            "Always confirm the final content with the user before submitting. " +
            "Requires VLOSSOM_GITHUB_TOKEN environment variable with issues:write scope.",
        {
            title: z.string().describe("Issue title"),
            body: z.string().describe("Issue body in Markdown, with all sections filled in"),
            labels: z
                .array(z.string())
                .optional()
                .describe("Optional labels such as 'bug', 'enhancement', 'question'"),
        },
        async ({ title, body, labels }) => {
            const token = getGitHubToken();
            if (!token) {
                throw new Error(
                    "VLOSSOM_GITHUB_TOKEN is not configured. " +
                        "Set the environment variable with a GitHub PAT that has issues:write scope."
                );
            }
            return textResponse(await createIssue(token, title, body, labels));
        }
    );
}
