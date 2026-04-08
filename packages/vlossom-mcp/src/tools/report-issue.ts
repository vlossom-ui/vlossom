import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createIssue, getGitHubToken, type CreateIssueResult } from "../services/github-client.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import type { IssueDraft, IssueLanguage, IssueType, SectionContent } from "../types/issue.js";

const ALLOWED_LABELS = ["bug", "feature", "question"] as const;

export function registerReportIssue(server: McpServer): void {
    server.tool(
        "report_issue",
        "ALWAYS call check_github_token before this to verify token availability. " +
            "Call this when the user wants to file a GitHub issue. " +
            "With draft=true: generates a structured issue template for the user to fill in. " +
            "With draft=false (default): creates a real GitHub issue from confirmed sections. " +
            "NEVER submit (draft=false) without explicit user approval.",
        {
            draft: z
                .boolean()
                .optional()
                .default(false)
                .describe(
                    "Set true to generate a draft template without submitting. " +
                        "Set false (default) to submit to GitHub."
                ),
            summary: z
                .string()
                .optional()
                .describe("Brief one-line summary (required when draft=true)"),
            type: z
                .enum(["bug", "feature", "enhancement", "question"])
                .optional()
                .default("bug")
                .transform((v) => (v === "enhancement" ? "feature" : v) as IssueType)
                .describe("Issue type (required when draft=true)"),
            language: z
                .enum(["ko", "en"])
                .optional()
                .default("ko")
                .describe("Language for section headings"),
            title: z
                .string()
                .max(256)
                .optional()
                .describe("Issue title (required when draft=false)"),
            sectionContents: z
                .array(
                    z.object({
                        heading: z
                            .string()
                            .describe("Section heading — must match headings from draft sections"),
                        content: z.string().max(65536).describe("User-provided content for this section"),
                    })
                )
                .optional()
                .describe("Section contents (required when draft=false)"),
            labels: z
                .array(z.enum(ALLOWED_LABELS))
                .optional()
                .describe("Labels to apply"),
        },
        async ({ draft, summary, type, language, title, sectionContents, labels }) => {
            if (draft) {
                return handleDraft(summary, type, language);
            }
            return handleSubmit(title, type, language, sectionContents, labels);
        }
    );
}

function handleDraft(
    summary: string | undefined,
    type: IssueType,
    language: IssueLanguage
): ReturnType<typeof textResponse> {
    const start = Date.now();
    const resolvedSummary = summary ?? "";
    const draftResult = buildDraft(resolvedSummary, type, language);
    const meta = recordStep("report_issue", `Draft ${type} issue`, Date.now() - start, {
        summary: `${type} draft ready`,
    });

    const preview = [
        `## Issue Draft Preview`,
        ``,
        `**Title:** ${draftResult.suggestedTitle}`,
        `**Type:** ${type} | **Labels:** ${draftResult.suggestedLabels.join(", ")}`,
        ``,
        ...draftResult.sections.map((s) =>
            `### ${s.heading} ${s.required ? "(required)" : "(optional)"}\n> ${s.placeholder}`
        ),
        ``,
        `---`,
        `Fill in each section above, then confirm to submit.`,
    ].join("\n");

    return textResponse(
        {
            ...draftResult,
            avoid: [
                "Do not submit the issue (draft=false) without explicit user approval",
                "Do not rename or reorder section headings — pass them exactly as returned",
                "Do not skip required sections — the user must provide content for each",
            ],
            next_actions: [
                {
                    tool: "report_issue",
                    reason: "all required sections confirmed, submit the issue to GitHub (draft=false)",
                },
            ],
        },
        meta,
        [preview],
    );
}

async function handleSubmit(
    title: string | undefined,
    type: IssueType,
    language: IssueLanguage,
    sectionContents: SectionContent[] | undefined,
    labels: readonly ("bug" | "feature" | "question")[] | undefined
): Promise<ReturnType<typeof textResponse>> {
    const start = Date.now();

    if (!title) {
        const meta = recordStep("report_issue", "Report issue", Date.now() - start, {
            summary: "title missing",
        });
        return textResponse(
            {
                error: "title is required when draft=false. Pass the suggestedTitle from the draft.",
                next_actions: [
                    {
                        tool: "report_issue",
                        reason: "generate a draft first (draft=true) to get a suggestedTitle",
                    },
                ],
            },
            meta
        );
    }

    if (!sectionContents || sectionContents.length === 0) {
        const meta = recordStep("report_issue", `Report issue: ${title}`, Date.now() - start, {
            summary: "sections missing",
        });
        return textResponse(
            {
                error:
                    "sectionContents is required when draft=false. " +
                    "Fill in all sections from the draft before submitting.",
                next_actions: [
                    {
                        tool: "report_issue",
                        reason: "generate a draft first (draft=true) to get section headings",
                    },
                ],
            },
            meta
        );
    }

    const token = getGitHubToken();
    if (!token) {
        const meta = recordStep("report_issue", `Report issue: ${title}`, Date.now() - start, {
            summary: "token missing",
        });
        return textResponse(
            {
                error:
                    "VLOSSOM_GITHUB_TOKEN is not configured. " +
                    "Set the environment variable with a GitHub PAT that has issues:write scope.",
                next_actions: [
                    {
                        tool: "set_github_token",
                        reason: "provide a GitHub PAT then retry report_issue",
                    },
                ],
            },
            meta
        );
    }

    const body = buildBody(type, language, sectionContents);
    let result: CreateIssueResult;
    try {
        result = await createIssue(token, title, body, labels as string[] | undefined);
    } catch (error) {
        const meta = recordStep("report_issue", `Report issue: ${title}`, Date.now() - start, {
            summary: "submission failed",
        });
        return textResponse(
            {
                error: error instanceof Error ? error.message : "Failed to create GitHub issue.",
                next_actions: [
                    {
                        tool: "check_github_token",
                        reason: "verify token validity and permissions then retry",
                    },
                ],
            },
            meta
        );
    }

    const meta = recordStep("report_issue", `Report issue: ${title}`, Date.now() - start, {
        summary: "issue created",
    });
    return textResponse(
        {
            ...result,
            next_actions: [
                { tool: "get_component", reason: "continue exploring Vlossom components" },
            ],
        },
        meta
    );
}

function buildDraft(summary: string, type: IssueType, language: IssueLanguage): IssueDraft {
    switch (type) {
        case "feature":
            return language === "en"
                ? {
                      suggestedTitle: `[feat] ${summary}`,
                      type,
                      language,
                      suggestedLabels: ["feature"],
                      sections: [
                          { heading: "Overview", placeholder: summary, required: false },
                          { heading: "Requirements", placeholder: "- ", required: true },
                          {
                              heading: "Description",
                              placeholder: "Provide a detailed description",
                              required: false,
                          },
                          {
                              heading: "References",
                              placeholder: "Links, screenshots, etc.",
                              required: false,
                          },
                      ],
                  }
                : {
                      suggestedTitle: `[feat] ${summary}`,
                      type,
                      language,
                      suggestedLabels: ["feature"],
                      sections: [
                          { heading: "개요", placeholder: summary, required: false },
                          { heading: "요구사항", placeholder: "- ", required: true },
                          {
                              heading: "설명",
                              placeholder: "상세 설명을 작성해주세요",
                              required: false,
                          },
                          {
                              heading: "참고",
                              placeholder: "참고 자료, 스크린샷 등",
                              required: false,
                          },
                      ],
                  };

        case "question":
            return language === "en"
                ? {
                      suggestedTitle: `question: ${summary}`,
                      type,
                      language,
                      suggestedLabels: ["question"],
                      sections: [
                          { heading: "Question", placeholder: summary, required: false },
                          {
                              heading: "What I've Tried",
                              placeholder: "Describe what you have already tried",
                              required: true,
                          },
                          {
                              heading: "Related Code",
                              placeholder: "```vue\n<!-- related code -->\n```",
                              required: true,
                          },
                      ],
                  }
                : {
                      suggestedTitle: `question: ${summary}`,
                      type,
                      language,
                      suggestedLabels: ["question"],
                      sections: [
                          { heading: "질문", placeholder: summary, required: false },
                          {
                              heading: "시도한 것",
                              placeholder: "이미 시도해본 것들을 적어주세요",
                              required: true,
                          },
                          {
                              heading: "관련 코드",
                              placeholder: "```vue\n<!-- 관련 코드 -->\n```",
                              required: true,
                          },
                      ],
                  };

        default:
            return language === "en"
                ? {
                      suggestedTitle: `[bug] ${summary}`,
                      type,
                      language,
                      suggestedLabels: ["bug"],
                      sections: [
                          {
                              heading: "Bug Description",
                              placeholder: summary,
                              required: false,
                          },
                          {
                              heading: "Steps to Reproduce",
                              placeholder: "1. \n2. \n3. ",
                              required: true,
                          },
                          {
                              heading: "Expected Behavior",
                              placeholder: "What should happen?",
                              required: true,
                          },
                          {
                              heading: "Screenshots",
                              placeholder: "Attach screenshots or a video if applicable",
                              required: false,
                          },
                          {
                              heading: "Environment",
                              placeholder: "- Device: \n- OS: \n- Browser: ",
                              required: false,
                          },
                      ],
                  }
                : {
                      suggestedTitle: `[bug] ${summary}`,
                      type,
                      language,
                      suggestedLabels: ["bug"],
                      sections: [
                          { heading: "버그 내용", placeholder: summary, required: false },
                          {
                              heading: "재현 스텝",
                              placeholder: "1. \n2. \n3. ",
                              required: true,
                          },
                          {
                              heading: "기대 동작",
                              placeholder: "어떻게 동작해야 하나요?",
                              required: true,
                          },
                          {
                              heading: "스크린샷",
                              placeholder: "스크린샷 또는 동영상을 첨부해주세요",
                              required: false,
                          },
                          {
                              heading: "개발 환경",
                              placeholder: "- Device: \n- OS: \n- Browser: ",
                              required: false,
                          },
                      ],
                  };
    }
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
