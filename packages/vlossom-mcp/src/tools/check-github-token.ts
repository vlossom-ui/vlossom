import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { getGitHubToken } from "../services/github-client.js";
import { textResponse } from "../utils/mcp-response.js";

export function registerCheckGitHubToken(server: McpServer): void {
    server.tool(
        "check_github_token",
        "Check whether a GitHub token is configured for submitting issues.",
        {},
        () => textResponse({ isConfigured: !!getGitHubToken() })
    );
}
