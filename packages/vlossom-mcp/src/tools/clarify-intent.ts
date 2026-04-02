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
            "Brief hint of which tools will run, e.g. 'get_component' or 'suggest_components → get_component → generate_component_code'",
        ),
});

export function registerClarifyIntent(server: McpServer): void {
    server.tool(
        "clarify_intent",
        "Call this FIRST — before search_components or suggest_components — when the user's input is a free-form description, " +
            "a vague phrase, or a mixed/compound term that does not clearly map to a single component name. " +
            "ALSO call this when the user asks something unrelated to Vlossom (general programming, off-topic requests, etc.) — " +
            "use it to steer the conversation back by offering Vlossom-relevant interpretations of what they might actually need. " +
            "ALSO call this when search_components returns no results — " +
            "the query may be poorly worded and clarification may find an existing component. " +
            "Generate exactly 3 candidate interpretations as candidates, each with a distinct pipeline. " +
            "After the server returns choices, present them to the user using the presentation_format " +
            "field from the response — render it verbatim so the numbered options are clear. " +
            "Once the user picks, execute the chosen prompt as the next query without calling clarify_intent again.",
        {
            query: z.string().describe("The original user query verbatim"),
            candidates: z
                .array(choiceSchema)
                .min(1)
                .max(5)
                .describe("3 candidate interpretations (1–5 accepted; server normalizes to exactly 3)"),
        },
        async ({ query, candidates }) => {
            const start = Date.now();

            // Normalize to exactly 3: trim if too many, pad with last item if too few
            const normalized = candidates.slice(0, 3);
            while (normalized.length < 3) normalized.push(normalized[normalized.length - 1]);

            const choices = normalized.map((c, i) => ({
                index: i + 1,
                label:
                    c.label.length > MAX_LABEL_LENGTH
                        ? c.label.slice(0, MAX_LABEL_LENGTH - 1) + "…"
                        : c.label,
                prompt: c.prompt,
                pipeline: c.pipeline,
            }));

            const shortQuery =
                query.length > 24 ? query.slice(0, 23) + "…" : query;
            const meta = recordStep(
                "clarify_intent",
                `Clarify: ${shortQuery}`,
                Date.now() - start,
            );

            const presentation_format =
                "💬 I want to make sure I understand what you need. Which of these best matches?\n\n" +
                choices
                    .map((c) => `[${c.index}] ${c.label}`)
                    .join("\n") +
                "\n\nPlease reply with a number (1–3).";

            return textResponse({ query, choices, presentation_format }, meta);
        },
    );
}
