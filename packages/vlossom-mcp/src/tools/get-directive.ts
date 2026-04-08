import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

interface DirectiveOption {
    binding: string;
    type: string;
    default: string;
    description: string;
}

interface DirectiveMeta {
    name: string;
    kebabName: string;
    description: string;
    availableVersion: string;
    options: DirectiveOption[];
    example: string;
}

let cache: DirectiveMeta[] | null = null;

function loadDirectives(): DirectiveMeta[] {
    if (cache) return cache;
    const jsonPath = `${__dirname}/../data/directives.json`;
    cache = require(jsonPath) as DirectiveMeta[];
    return cache;
}

export function registerGetDirective(server: McpServer): void {
    server.tool(
        "get_directive",
        "Call this when the user asks about Vlossom directives (e.g. v-scroll-shadow) or wants declarative template alternatives. " +
            "Returns directive documentation — omit name to list all, or pass a name for binding options and usage example. " +
            "Then call get_composables to check if a composable equivalent exists for programmatic usage.",
        { name: z.string().optional().describe('Directive name, e.g. "v-scroll-shadow". Omit to list all directives.') },
        async ({ name }) => {
            const start = Date.now();
            const all = loadDirectives();

            if (!name) {
                const meta = recordStep("get_directive", "List all directives", Date.now() - start, { summary: `${all.length} directives` });
                return textResponse(
                    {
                        directives: all.map((d) => ({ name: d.name, description: d.description })),
                        count: all.length,
                        next_actions: [
                            { tool: "get_directive", reason: "call with a name for binding options and usage example" },
                            { tool: "get_composables", reason: "explore composable alternatives for programmatic usage" },
                        ],
                    },
                    meta,
                );
            }

            // Normalize: accept "scroll-shadow", "v-scroll-shadow", "vs-scroll-shadow"
            const normalized = name.startsWith("v-") ? name : `v-${name.replace(/^vs-/, "")}`;
            const entry = all.find((d) => d.name === normalized || d.kebabName === name);
            const meta = recordStep("get_directive", `${normalized} detail`, Date.now() - start, { summary: "directive detail" });

            if (!entry) {
                return textResponse(
                    {
                        error: `Directive '${name}' not found.`,
                        available: all.map((d) => d.name),
                        next_actions: [
                            { tool: "check_github_token", reason: "file an enhancement issue for the missing directive" },
                        ],
                    },
                    meta,
                );
            }

            return textResponse(
                {
                    ...entry,
                    next_actions: [
                        { tool: "get_composables", reason: "check if a composable equivalent exists for programmatic usage" },
                    ],
                },
                meta,
            );
        },
    );
}
