import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const NPM_REGISTRY = "https://registry.npmjs.org/vlossom";

interface NpmRelease {
    version: string;
    date: string;
    description: string;
}

interface ChangelogEntry {
    version: string;
    date: string;
    breaking: string[];
    features: string[];
    fixes: string[];
    notes?: string;
}

/** Fetch release metadata from npm registry. */
async function fetchNpmReleases(): Promise<NpmRelease[]> {
    const res = await fetch(NPM_REGISTRY);
    if (!res.ok) throw new Error(`npm registry error: ${res.status}`);
    const data = (await res.json()) as {
        time: Record<string, string>;
        versions: Record<string, { description?: string }>;
    };

    const time = data.time ?? {};
    const versions = data.versions ?? {};

    return Object.entries(time)
        .filter(([v]) => v !== "created" && v !== "modified" && /^\d+\.\d+\.\d+/.test(v))
        .map(([version, date]) => ({
            version,
            date: date.slice(0, 10),
            description: versions[version]?.description ?? "",
        }))
        .sort((a, b) => b.version.localeCompare(a.version, undefined, { numeric: true }));
}

/** Parse semver string into [major, minor, patch]. */
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

/**
 * Build a ChangelogEntry from version metadata.
 * Without a full GitHub releases API, we derive info from the version number
 * and any description field from npm.
 */
function buildEntry(release: NpmRelease): ChangelogEntry {
    const [major, minor] = parseSemver(release.version);

    const breaking: string[] = [];
    const features: string[] = [];
    const fixes: string[] = [];

    // Heuristic: major bumps signal breaking changes
    if (minor === 0 && major > 0) {
        breaking.push(`Major release — see GitHub release notes for migration guide.`);
    }

    if (release.description) {
        features.push(release.description);
    }

    return { version: release.version, date: release.date, breaking, features, fixes };
}

export function registerGetChangelog(server: McpServer): void {
    server.tool(
        "get_changelog",
        "Fetches the Vlossom version history from the npm registry. " +
            "Call this when the user asks what changed in a specific version, how to migrate, " +
            "or what the latest stable release is. " +
            "Optionally filter from/to specific versions. " +
            "Pairs with check_vlossom_setup: when setup check reports an outdated version, " +
            "call get_changelog(from: currentVersion) to show migration steps.",
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

            let releases: NpmRelease[];
            try {
                releases = await fetchNpmReleases();
            } catch (err) {
                const meta = recordStep("get_changelog", "Fetch failed", Date.now() - start);
                return textResponse({ error: `Failed to fetch changelog: ${(err as Error).message}` }, meta);
            }

            const latestStable = releases.find((r) => !r.version.includes("-"))?.version ?? "unknown";

            let filtered = releases.filter((r) => !r.version.includes("-")); // skip pre-releases

            if (to) filtered = filtered.filter((r) => semverLte(r.version, to));
            if (from) filtered = filtered.filter((r) => semverGte(r.version, from));

            filtered = filtered.slice(0, limit);

            const versions: ChangelogEntry[] = filtered.map(buildEntry);

            const label = from ? `Changelog from ${from}` : `Latest ${limit} versions`;
            const meta = recordStep("get_changelog", label, Date.now() - start);

            return textResponse({ latestStable, versions }, meta);
        },
    );
}
