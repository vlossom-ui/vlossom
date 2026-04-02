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
        "Returns documentation for Vlossom directives (e.g. v-scroll-shadow). " +
            "Call without a name to list all available directives. " +
            "Call with a name to get binding options and usage example for a specific directive.",
        { name: z.string().optional().describe('Directive name, e.g. "v-scroll-shadow". Omit to list all directives.') },
        async ({ name }) => {
            const start = Date.now();
            const all = loadDirectives();

            if (!name) {
                const meta = recordStep("get_directive", "List all directives", Date.now() - start);
                return textResponse(
                    {
                        directives: all.map((d) => ({ name: d.name, description: d.description })),
                        count: all.length,
                    },
                    meta,
                );
            }

            // Normalize: accept "scroll-shadow", "v-scroll-shadow", "vs-scroll-shadow"
            const normalized = name.startsWith("v-") ? name : `v-${name.replace(/^vs-/, "")}`;
            const entry = all.find((d) => d.name === normalized || d.kebabName === name);
            const meta = recordStep("get_directive", `${normalized} detail`, Date.now() - start);

            if (!entry) {
                return textResponse(
                    {
                        error: `Directive '${name}' not found.`,
                        available: all.map((d) => d.name),
                    },
                    meta,
                );
            }

            return textResponse(entry, meta);
        },
    );
}
