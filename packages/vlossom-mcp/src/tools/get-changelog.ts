import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

interface ChangelogEntry {
    version: string;
    date: string;
    prerelease: boolean;
    breaking: string[];
    features: string[];
    fixes: string[];
    notes?: string;
}

interface ChangelogData {
    latestStable: string;
    entries: ChangelogEntry[];
}

let cache: ChangelogData | null = null;

function loadChangelog(): ChangelogData {
    if (cache) return cache;
    const jsonPath = `${__dirname}/../data/changelog.json`;
    cache = require(jsonPath) as ChangelogData;
    return cache;
}

function parseSemver(v: string): [number, number, number] {
    const [ma, mi, pa] = v.replace(/[^0-9.]/g, "").split(".").map(Number);
    return [ma ?? 0, mi ?? 0, pa ?? 0];
}

function semverGte(a: string, b: string): boolean {
    const [aMa, aMi, aPa] = parseSemver(a);
    const [bMa, bMi, bPa] = parseSemver(b);
    if (aMa !== bMa) return aMa > bMa;
    if (aMi !== bMi) return aMi > bMi;
    return aPa >= bPa;
}

function semverLte(a: string, b: string): boolean {
    return semverGte(b, a);
}

export function registerGetChangelog(server: McpServer): void {
    server.tool(
        "get_changelog",
        "No prerequisite needed. " +
            "Call this when the user asks what changed in a specific version, how to migrate, " +
            "or what the latest stable release is. " +
            "Returns version history from the bundled changelog snapshot (built from GitHub Releases). " +
            "Pairs with check_vlossom_setup: when setup check reports an outdated version, " +
            "call get_changelog(from: currentVersion) to show what changed since then.",
        {
            from: z
                .string()
                .optional()
                .describe("Starting version (inclusive), e.g. '1.5.0'. Omit to show only the latest version."),
            to: z
                .string()
                .optional()
                .describe("Ending version (inclusive), e.g. '2.0.0'. Default: latest stable."),
            limit: z
                .number()
                .int()
                .min(1)
                .max(50)
                .optional()
                .default(10)
                .describe("Maximum number of versions to return. Default: 10."),
        },
        async ({ from, to, limit }) => {
            const start = Date.now();

            let data: ChangelogData;
            try {
                data = loadChangelog();
            } catch {
                const meta = recordStep("get_changelog", "Load failed", Date.now() - start);
                return textResponse(
                    {
                        error: "changelog.json not found. Run `npm run generate` to build it.",
                        next_action: "check_vlossom_setup",
                        next_action_message: "Changelog data unavailable. Check setup instead.",
                    },
                    meta,
                );
            }

            let entries = [...data.entries];

            if (to) entries = entries.filter((e) => semverLte(e.version, to));
            if (from) entries = entries.filter((e) => semverGte(e.version, from));
            entries = entries.slice(0, limit);

            const label = from ? `Changelog from ${from}` : `Latest ${limit} versions`;
            const meta = recordStep("get_changelog", label, Date.now() - start);

            return textResponse(
                {
                    latestStable: data.latestStable,
                    versions: entries,
                    next_action: "check_vlossom_setup",
                    next_action_message:
                        "Call check_vlossom_setup with your current version to see if you are up to date.",
                },
                meta,
            );
        },
    );
}
