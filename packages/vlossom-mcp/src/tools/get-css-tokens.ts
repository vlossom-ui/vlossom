import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

interface CssToken {
    name: string;
    defaultValue: string;
    darkValue?: string;
    category: string;
}

let cache: CssToken[] | null = null;

function loadTokens(): CssToken[] {
    if (cache) return cache;
    const jsonPath = `${__dirname}/../data/css-tokens.json`;
    cache = require(jsonPath) as CssToken[];
    return cache;
}

export function registerGetCssTokens(server: McpServer): void {
    server.tool(
        "get_css_tokens",
        "Returns Vlossom CSS custom properties (--vs-* tokens) with their default and dark-mode values. " +
            "Call this when the user asks about color tokens, design variables, spacing, radius, or z-index. " +
            "Filter by category: 'color-scheme' for semantic colors, 'palette' for raw color values, " +
            "'typography', 'radius', 'spacing', 'size', 'z-index', or 'all' for everything. " +
            "Always use these tokens instead of hardcoded values when generating styled code.",
        {
            category: z
                .enum(["color-scheme", "palette", "typography", "radius", "spacing", "size", "z-index", "misc", "all"])
                .optional()
                .default("all")
                .describe("Token category to filter by. Default: 'all'."),
            search: z
                .string()
                .optional()
                .describe("Optional keyword to filter token names (e.g. 'blue', 'padding', 'comp-height')."),
        },
        async ({ category, search }) => {
            const start = Date.now();
            let tokens = loadTokens();

            if (category && category !== "all") {
                tokens = tokens.filter((t) => t.category === category);
            }
            if (search) {
                const q = search.toLowerCase();
                tokens = tokens.filter((t) => t.name.includes(q));
            }

            const label = search ? `Tokens: ${search}` : category === "all" ? "All tokens" : `Tokens: ${category}`;
            const meta = recordStep("get_css_tokens", label, Date.now() - start);

            return textResponse({
                tokens,
                count: tokens.length,
                next_action: "get_vlossom_options",
                next_action_message:
                    "Call get_vlossom_options to configure these tokens globally via createVlossom(), " +
                    "or call get_component to apply them in a specific component's styleSet.",
            }, meta);
        },
    );
}
