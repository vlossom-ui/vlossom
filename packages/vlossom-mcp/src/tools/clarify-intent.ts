import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const MAX_LABEL_LENGTH = 50;

const choiceSchema = z.object({
    label: z
        .string()
        .describe(`Short display label shown to the user (max ${MAX_LABEL_LENGTH} chars)`),
    prompt: z
        .string()
        .describe("The full prompt to execute if the user selects this option"),
    pipeline: z
        .string()
        .describe(
            "Brief hint of which tools will run, e.g. 'get_component' or 'search_components → get_component → generate_component_code'",
        ),
});

export function registerClarifyIntent(server: McpServer): void {
    server.tool(
        "clarify_intent",
        "Call this when the user's next step is unclear and multiple tool pipelines could apply. " +
            "Also call this when the user's input is a free-form description that doesn't clearly map to a single tool. " +
            "Also call this when search_components returns no results — the query may need rephrasing. " +
            "Presents candidate tool pipelines so the user can choose their direction. " +
            "Other tools point to this via next_actions when the user could branch in multiple directions. " +
            "Once the user picks, execute the chosen prompt without calling clarify_intent again.",
        {
            query: z.string().describe("The original user query or context description"),
            candidates: z
                .array(choiceSchema)
                .min(1)
                .max(5)
                .describe("1–5 candidate tool pipelines, each with a distinct direction"),
        },
        async ({ query, candidates }) => {
            const start = Date.now();

            const choices = candidates.map((c, i) => ({
                index: i + 1,
                label:
                    c.label.length > MAX_LABEL_LENGTH
                        ? c.label.slice(0, MAX_LABEL_LENGTH - 1) + "\u2026"
                        : c.label,
                prompt: c.prompt,
                pipeline: c.pipeline,
            }));

            const shortQuery =
                query.length > 24 ? query.slice(0, 23) + "\u2026" : query;
            const meta = recordStep(
                "clarify_intent",
                `Clarify: ${shortQuery}`,
                Date.now() - start,
                { summary: `${choices.length} options offered` },
            );

            const choiceList = choices
                .map((c) => `[${c.index}] ${c.label}`)
                .join("\n");
            const rangeLabel = choices.length === 1 ? "1" : `1\u2013${choices.length}`;

            const presentation_format =
                "\uD83D\uDCAC Which direction would you like to go?\n\n" +
                choiceList +
                `\n\nPlease reply with a number (${rangeLabel}).`;

            return textResponse(
                {
                    query,
                    choices,
                    next_actions: [
                        { tool: "_await_user_choice", reason: "present the numbered menu to the user, wait for their selection, then execute the chosen prompt" },
                    ],
                },
                meta,
                [presentation_format],
            );
        },
    );
}
