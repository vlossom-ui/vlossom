import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getGitHubToken } from "../services/github-client.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

export function registerCheckGitHubToken(server: McpServer): void {
    server.tool(
        "check_github_token",
        "Call this when starting the issue filing pipeline or when the user wants to submit a GitHub issue. " +
            "Checks whether a GitHub token is configured for submitting issues. " +
            "Then call set_github_token if the token is missing, or report_issue (draft=true) if it is already configured.",
        {},
        () => {
            const start = Date.now();
            const isConfigured = !!getGitHubToken();
            const meta = recordStep("check_github_token", "Check GitHub token", Date.now() - start, { summary: isConfigured ? "token present" : "token missing" });
            return textResponse({
                isConfigured,
                next_actions: isConfigured
                    ? [{ tool: "report_issue", reason: "token is ready, proceed to draft the issue (draft=true)" }]
                    : [{ tool: "set_github_token", reason: "provide a GitHub PAT with issues:write scope" }],
            }, meta);
        }
    );
}
