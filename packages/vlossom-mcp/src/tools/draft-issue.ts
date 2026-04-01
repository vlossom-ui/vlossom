import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { textResponse } from "../utils/mcp-response.js";

export function registerDraftIssue(server: McpServer): void {
    server.tool(
        "draft_issue",
        "Generate a structured Markdown template for a GitHub issue. " +
            "ALWAYS call this before report_issue. " +
            "After receiving the template, go through each requiredSection with the user one by one " +
            "to collect detailed information before submitting.",
        {
            summary: z.string().describe("Brief one-line summary of the issue"),
            type: z
                .enum(["bug", "enhancement", "question"])
                .default("bug")
                .describe("Issue type"),
        },
        ({ summary, type }) => textResponse(buildDraft(summary, type))
    );
}

function buildDraft(
    summary: string,
    type: "bug" | "enhancement" | "question"
): { suggestedTitle: string; bodyTemplate: string; requiredSections: string[] } {
    switch (type) {
        case "enhancement":
            return {
                suggestedTitle: `feat: ${summary}`,
                bodyTemplate:
                    `## 요청 기능\n\n${summary}\n\n` +
                    `## 동기 / 사용 사례\n\n<!-- 이 기능이 왜 필요한지 설명해주세요 -->\n\n` +
                    `## 제안하는 API / 동작\n\n\`\`\`vue\n<!-- 예상 사용 예시 -->\n\`\`\`\n\n` +
                    `## 추가 컨텍스트\n\n<!-- 참고 자료, 스크린샷 등 -->`,
                requiredSections: ["동기 / 사용 사례", "제안하는 API / 동작"],
            };
        case "question":
            return {
                suggestedTitle: `question: ${summary}`,
                bodyTemplate:
                    `## 질문\n\n${summary}\n\n` +
                    `## 시도한 것\n\n<!-- 이미 시도해본 것들을 적어주세요 -->\n\n` +
                    `## 관련 코드\n\n\`\`\`vue\n<!-- 관련 코드 -->\n\`\`\``,
                requiredSections: ["시도한 것", "관련 코드"],
            };
        default:
            return {
                suggestedTitle: `fix: ${summary}`,
                bodyTemplate:
                    `## 버그 설명\n\n${summary}\n\n` +
                    `## 재현 방법\n\n1. \n2. \n3. \n\n` +
                    `## 예상 동작\n\n<!-- 어떻게 동작해야 하나요? -->\n\n` +
                    `## 실제 동작\n\n<!-- 실제로는 어떻게 동작하나요? -->\n\n` +
                    `## 코드 예시\n\n\`\`\`vue\n<!-- 재현 코드 -->\n\`\`\`\n\n` +
                    `## 환경\n\n- Vlossom 버전: \n- Vue 버전: \n- 브라우저: `,
                requiredSections: ["재현 방법", "예상 동작", "실제 동작", "코드 예시"],
            };
    }
}
