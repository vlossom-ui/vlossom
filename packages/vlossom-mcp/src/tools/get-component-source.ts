import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

interface ComponentSource {
    name: string;
    kebabName: string;
    source: string;
    path: string;
}

let cache: Record<string, ComponentSource> | null = null;

function loadSourceData(): Record<string, ComponentSource> {
    if (cache) return cache;
    const jsonPath = `${__dirname}/../data/components-source.json`;
    cache = require(jsonPath) as Record<string, ComponentSource>;
    return cache;
}

function normalizeToName(input: string): string {
    if (input.includes("-")) {
        return input
            .split("-")
            .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
            .join("");
    }
    return input;
}

export function registerGetComponentSource(server: McpServer): void {
    server.tool(
        "get_component_source",
        "Returns the raw Vue source code (.vue file) for a Vlossom component. " +
            "Call this when you need to see the actual implementation details that go beyond the metadata returned by get_component — " +
            "e.g. to understand template structure, computed logic, or how StyleSet is applied in the template. " +
            "Accepts PascalCase (VsButton) or kebab-case (vs-button).",
        { name: z.string().describe('Component name — PascalCase ("VsButton") or kebab-case ("vs-button")') },
        async ({ name }) => {
            const start = Date.now();
            const all = loadSourceData();
            const normalized = normalizeToName(name);
            const entry = all[normalized] ?? Object.values(all).find((c) => c.kebabName === name);
            const meta = recordStep("get_component_source", `${name} source`, Date.now() - start);

            if (!entry) {
                return textResponse(
                    {
                        error: `Component '${name}' not found. Use list_components to see available components.`,
                        next_actions: [
                            { tool: "list_components", reason: "verify the exact component name" },
                        ],
                    },
                    meta,
                );
            }

            return textResponse(
                {
                    name: entry.name,
                    kebabName: entry.kebabName,
                    path: entry.path,
                    source: entry.source,
                    next_actions: [
                        { tool: "get_component", reason: "get structured metadata (props, events, styleSet)" },
                        { tool: "get_component_relationships", reason: "see parent and child component composition" },
                    ],
                },
                meta,
            );
        },
    );
}
