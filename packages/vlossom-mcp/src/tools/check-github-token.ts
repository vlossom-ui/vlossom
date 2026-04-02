import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getGitHubToken } from "../services/github-client.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

export function registerCheckGitHubToken(server: McpServer): void {
    server.tool(
        "check_github_token",
        "Check whether a GitHub token is configured for submitting issues.",
        {},
        () => {
            const start = Date.now();
            const isConfigured = !!getGitHubToken();
            const meta = recordStep("check_github_token", "Check GitHub token", Date.now() - start);
            return textResponse({
                isConfigured,
                next_action: isConfigured ? "draft_issue" : "set_github_token",
                next_action_message: isConfigured
                    ? "Token is configured. Proceed to draft_issue."
                    : "🔑 Token is not configured. Please provide a GitHub PAT with issues:write scope, then call set_github_token.",
            }, meta);
        }
    );
}
