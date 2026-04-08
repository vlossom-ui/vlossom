import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

interface ComposableArg {
    name: string;
    type: string;
    default: string;
    required: boolean;
    description: string;
}

interface ComposableMeta {
    name: string;
    dirName: string;
    description: string;
    availableVersion: string;
    isPublic: boolean;
    args: ComposableArg[];
    returns: string;
    example: string;
}

let cache: ComposableMeta[] | null = null;

function loadComposables(): ComposableMeta[] {
    if (cache) return cache;
    const jsonPath = `${__dirname}/../data/composables.json`;
    cache = require(jsonPath) as ComposableMeta[];
    return cache;
}

export function registerGetComposables(server: McpServer): void {
    server.tool(
        "get_composables",
        "Call this when the user asks about Vlossom composables (useColorScheme, useStyleSet, etc.) or wants to use them programmatically. " +
            "Returns composable documentation — omit name to list all, or pass a name for full details including args, return values, and usage example. " +
            "Then call get_directive to check if a directive equivalent exists for declarative template usage.",
        {
            name: z
                .string()
                .optional()
                .describe(
                    'Composable name, e.g. "useColorScheme" or "color-scheme". Omit to list all composables.',
                ),
            publicOnly: z
                .boolean()
                .optional()
                .default(false)
                .describe("When true, only return public (user-facing) composables. Default: false."),
        },
        async ({ name, publicOnly }) => {
            const start = Date.now();
            const all = loadComposables();

            if (!name) {
                const filtered = publicOnly ? all.filter((c) => c.isPublic) : all;
                const meta = recordStep("get_composables", "List composables", Date.now() - start, { summary: `${filtered.length} composables` });
                return textResponse(
                    {
                        composables: filtered.map((c) => ({
                            name: c.name,
                            dirName: c.dirName,
                            description: c.description,
                            isPublic: c.isPublic,
                        })),
                        count: filtered.length,
                        next_actions: [
                            { tool: "get_composables", reason: "call with a name for full args, return values, and usage example" },
                            { tool: "get_directive", reason: "explore directive alternatives for declarative template usage" },
                        ],
                    },
                    meta,
                );
            }

            // Normalize: useColorScheme → color-scheme, or accept color-scheme directly
            const dirName = name.startsWith("use")
                ? name
                      .slice(3) // remove 'use'
                      .replace(/([A-Z])/g, "-$1")
                      .toLowerCase()
                      .replace(/^-/, "")
                : name;

            const entry =
                all.find((c) => c.name === name) ??
                all.find((c) => c.dirName === dirName) ??
                all.find((c) => c.name.toLowerCase() === name.toLowerCase());

            const meta = recordStep("get_composables", `${name} detail`, Date.now() - start, { summary: `${name} detail` });

            if (!entry) {
                return textResponse(
                    {
                        error: `Composable '${name}' not found.`,
                        available: all.map((c) => c.name),
                        next_actions: [
                            { tool: "check_github_token", reason: "file an enhancement issue for the missing composable" },
                        ],
                    },
                    meta,
                );
            }

            return textResponse(
                {
                    ...entry,
                    next_actions: [
                        { tool: "get_directive", reason: "check if a directive equivalent exists for declarative template usage" },
                    ],
                },
                meta,
            );
        },
    );
}
