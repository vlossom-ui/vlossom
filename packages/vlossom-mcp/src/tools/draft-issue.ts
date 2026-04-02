import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import type { IssueDraft, IssueLanguage, IssueType } from "../types/issue.js";

export function registerDraftIssue(server: McpServer): void {
    server.tool(
        "draft_issue",
        "Generate a structured issue template for a GitHub issue. " +
            "ALWAYS call this before report_issue. " +
            "Detect the language from the user's request and pass it as the language parameter. " +
            "After receiving the template, go through each requiredSection with the user one by one " +
            "to collect detailed information before submitting. " +
            "Pass the returned sections and type as-is to report_issue to preserve formatting.",
        {
            summary: z.string().describe("Brief one-line summary of the issue"),
            type: z
                .enum(["bug", "feature", "enhancement", "question"])
                .default("bug")
                .transform((v) => (v === "enhancement" ? "feature" : v) as IssueType)
                .describe("Issue type: 'bug', 'feature' (or 'enhancement'), 'question'. Default: 'bug'"),
            language: z
                .enum(["ko", "en"])
                .default("ko")
                .describe(
                    "Language for section headings. Detect from the user's request language. " +
                        "Use 'en' if the user writes in English, 'ko' if in Korean."
                ),
        },
        ({ summary, type, language }) => {
            const start = Date.now();
            const draft = buildDraft(summary, type, language);
            const meta = recordStep("draft_issue", `Draft ${type} issue`, Date.now() - start);
            return textResponse({
                ...draft,
                next_action: "report_issue",
                next_action_message: "📝 Draft is ready. Go through each required section with the user one by one, then call report_issue once all sections are confirmed.",
            }, meta);
        }
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
