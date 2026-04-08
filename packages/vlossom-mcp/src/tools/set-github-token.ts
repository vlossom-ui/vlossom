import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { setGitHubToken } from "../services/github-client.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

export function registerSetGitHubToken(server: McpServer): void {
    server.tool(
        "set_github_token",
        "Store a GitHub Personal Access Token (PAT) for this session so that report_issue can submit issues. " +
            "Call this when check_github_token returns isConfigured: false. " +
            "Ask the user to provide a PAT with issues:write scope, then pass it here. " +
            "The token is kept in memory only and is not persisted to disk.",
        {
            token: z
                .string()
                .min(1)
                .regex(
                    /^(ghp_|github_pat_|gho_|ghu_|ghs_|ghr_)/,
                    "Token must be a valid GitHub PAT (must start with ghp_, github_pat_, gho_, ghu_, ghs_, or ghr_)"
                )
                .describe("GitHub Personal Access Token with issues:write scope (e.g. ghp_xxxx or github_pat_xxxx)"),
        },
        ({ token }) => {
            const start = Date.now();
            setGitHubToken(token);
            const meta = recordStep("set_github_token", "Set GitHub token", Date.now() - start, { summary: "token configured" });
            return textResponse({
                success: true,
                message: "🔑 GitHub token has been set for this session.",
                next_actions: [
                    { tool: "report_issue", reason: "token is now set, proceed to draft the issue (draft=true)" },
                ],
            }, meta);
        }
    );
}
