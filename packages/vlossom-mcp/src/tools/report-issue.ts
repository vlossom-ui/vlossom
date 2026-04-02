import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createIssue, getGitHubToken } from "../services/github-client.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import type { IssueLanguage, IssueType, SectionContent } from "../types/issue.js";

export function registerReportIssue(server: McpServer): void {
    server.tool(
        "report_issue",
        "Create a GitHub issue on the Vlossom repository. " +
            "ALWAYS call draft_issue first and fill in all required sections with the user before calling this. " +
            "Pass the title, type, language, and sections exactly as returned by draft_issue — do NOT restructure or rename sections. " +
            "Always confirm the final content with the user before submitting. " +
            "Requires VLOSSOM_GITHUB_TOKEN environment variable with issues:write scope.",
        {
            title: z.string().describe("Issue title — use the suggestedTitle from draft_issue"),
            type: z
                .enum(["bug", "feature", "question"])
                .describe("Issue type — must match the type from draft_issue"),
            language: z
                .enum(["ko", "en"])
                .describe("Language — must match the language from draft_issue"),
            sectionContents: z
                .array(
                    z.object({
                        heading: z
                            .string()
                            .describe(
                                "Section heading — must match headings from draft_issue sections"
                            ),
                        content: z.string().describe("User-provided content for this section"),
                    })
                )
                .describe(
                    "Content for each section in the same order as draft_issue sections. " +
                        "Headings must not be renamed or reordered."
                ),
            labels: z
                .array(z.string())
                .optional()
                .describe("Optional labels such as 'bug', 'feature', 'question'"),
        },
        async ({ title, type, language, sectionContents, labels }) => {
            const start = Date.now();
            const token = getGitHubToken();
            if (!token) {
                const meta = recordStep("report_issue", `Report issue: ${title}`, Date.now() - start);
                return textResponse({
                    error:
                        "VLOSSOM_GITHUB_TOKEN is not configured. " +
                        "Set the environment variable with a GitHub PAT that has issues:write scope.",
                    next_action: "set_github_token",
                    next_action_message: "GitHub token is not configured. Please set a token first, then retry report_issue.",
                }, meta);
            }
            const body = buildBody(type, language, sectionContents);
            const result = await createIssue(token, title, body, labels);
            const meta = recordStep("report_issue", `Report issue: ${title}`, Date.now() - start);
            return textResponse(result, meta);
        }
    );
}

function buildBody(
    type: IssueType,
    language: IssueLanguage,
    sectionContents: SectionContent[]
): string {
    const sectionOrder = getSectionOrder(type, language);
    const contentMap = new Map(sectionContents.map((s) => [s.heading, s.content]));

    return sectionOrder
        .map((heading) => {
            const content = contentMap.get(heading) ?? "";
            return `**${heading}**\n\n${content}`;
        })
        .join("\n\n");
}

function getSectionOrder(type: IssueType, language: IssueLanguage): string[] {
    if (language === "en") {
        switch (type) {
            case "feature":
                return ["Overview", "Requirements", "Description", "References"];
            case "question":
                return ["Question", "What I've Tried", "Related Code"];
            default:
                return [
                    "Bug Description",
                    "Steps to Reproduce",
                    "Expected Behavior",
                    "Screenshots",
                    "Environment",
                ];
        }
    }

    switch (type) {
        case "feature":
            return ["개요", "요구사항", "설명", "참고"];
        case "question":
            return ["질문", "시도한 것", "관련 코드"];
        default:
            return ["버그 내용", "재현 스텝", "기대 동작", "스크린샷", "개발 환경"];
    }
}
