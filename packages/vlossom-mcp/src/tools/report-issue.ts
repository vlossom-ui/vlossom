import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createIssue, getGitHubToken, type CreateIssueResult } from "../services/github-client.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import type { IssueLanguage, IssueType, SectionContent } from "../types/issue.js";

const ALLOWED_LABELS = ["bug", "feature", "question"] as const;

export function registerReportIssue(server: McpServer): void {
    server.tool(
        "report_issue",
        "ALWAYS call draft_issue before this and fill in all required sections with the user. " +
            "Call this when the user has explicitly confirmed all sections and approved submission. " +
            "Creates a real GitHub issue on the Vlossom repository from the confirmed sections. " +
            "Pass title, type, language, and sections exactly as returned by draft_issue — do NOT restructure or rename sections.",
        {
            title: z.string().max(256).describe("Issue title — use the suggestedTitle from draft_issue"),
            type: z
                .enum(["bug", "feature", "enhancement", "question"])
                .transform((v) => (v === "enhancement" ? "feature" : v) as IssueType)
                .describe("Issue type — 'bug', 'feature' (or 'enhancement'), 'question'. Must match draft_issue type."),
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
                        content: z.string().max(65536).describe("User-provided content for this section"),
                    })
                )
                .describe(
                    "Content for each section in the same order as draft_issue sections. " +
                        "Headings must not be renamed or reordered."
                ),
            labels: z
                .array(z.enum(ALLOWED_LABELS))
                .optional()
                .describe(
                    "Labels to apply — pass the suggestedLabels from draft_issue (e.g. ['bug'], ['feature']). " +
                    "Do not omit; GitHub issue templates always include a label.",
                ),
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
            let result: CreateIssueResult;
            try {
                result = await createIssue(token, title, body, labels);
            } catch (error) {
                const meta = recordStep("report_issue", `Report issue: ${title}`, Date.now() - start);
                return textResponse({
                    error: error instanceof Error ? error.message : "Failed to create GitHub issue.",
                    next_action: "check_github_token",
                    next_action_message: "Issue creation failed. Verify your GitHub token and try again.",
                }, meta);
            }
            const meta = recordStep("report_issue", `Report issue: ${title}`, Date.now() - start);
            return textResponse({
                ...result,
                next_action: "get_component",
                next_action_message: "Issue submitted. Call get_component if you want to continue exploring Vlossom components.",
            }, meta);
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
