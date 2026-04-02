import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const GITHUB_RELEASES_API = "https://api.github.com/repos/vlossom-ui/vlossom/releases";

interface GitHubRelease {
    tag_name: string;
    name: string;
    published_at: string;
    prerelease: boolean;
    body: string;
}

interface ChangelogEntry {
    version: string;
    date: string;
    breaking: string[];
    features: string[];
    fixes: string[];
    notes?: string;
}

/** Fetch release metadata from GitHub Releases API. */
async function fetchGitHubReleases(): Promise<GitHubRelease[]> {
    const res = await fetch(`${GITHUB_RELEASES_API}?per_page=100`, {
        headers: { "User-Agent": "vlossom-mcp", Accept: "application/vnd.github+json" },
    });
    if (!res.ok) throw new Error(`GitHub API error: ${res.status}`);
    return (await res.json()) as GitHubRelease[];
}

/** Extract version string from a tag like "v1.2.3" or "1.2.3". */
function tagToVersion(tag: string): string {
    return tag.replace(/^v/, "");
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

/** Parse a markdown release body into breaking/features/fixes sections. */
function parseReleaseBody(body: string): { breaking: string[]; features: string[]; fixes: string[] } {
    const breaking: string[] = [];
    const features: string[] = [];
    const fixes: string[] = [];

    if (!body) return { breaking, features, fixes };

    const lines = body.split("\n");
    let section: "breaking" | "features" | "fixes" | null = null;

    for (const raw of lines) {
        const line = raw.trim();
        const lower = line.toLowerCase();

        if (/^#+\s/.test(line)) {
            if (lower.includes("break") || lower.includes("migration")) section = "breaking";
            else if (lower.includes("feat") || lower.includes("new") || lower.includes("add")) section = "features";
            else if (lower.includes("fix") || lower.includes("bug") || lower.includes("patch")) section = "fixes";
            else section = null;
            continue;
        }

        const item = line.replace(/^[-*]\s*/, "").trim();
        if (!item) continue;

        if (section === "breaking") breaking.push(item);
        else if (section === "features") features.push(item);
        else if (section === "fixes") fixes.push(item);
    }

    // If no sections found, put the entire body as a note
    return { breaking, features, fixes };
}

/** Build a ChangelogEntry from a GitHub release. */
function buildEntry(release: GitHubRelease): ChangelogEntry {
    const version = tagToVersion(release.tag_name);
    const date = release.published_at.slice(0, 10);
    const { breaking, features, fixes } = parseReleaseBody(release.body ?? "");
    const notes = release.body?.trim() || undefined;

    return { version, date, breaking, features, fixes, notes };
}

export function registerGetChangelog(server: McpServer): void {
    server.tool(
        "get_changelog",
        "Fetches the Vlossom version history from the GitHub repository. " +
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

            let releases: GitHubRelease[];
            try {
                releases = await fetchGitHubReleases();
            } catch (err) {
                const meta = recordStep("get_changelog", "Fetch failed", Date.now() - start);
                return textResponse({ error: `Failed to fetch changelog: ${(err as Error).message}` }, meta);
            }

            let stable = releases.filter((r) => !r.prerelease && !r.tag_name.includes("-"));
            stable.sort((a, b) =>
                semverGte(tagToVersion(a.tag_name), tagToVersion(b.tag_name)) ? -1 : 1
            );

            const latestStable = stable[0] ? tagToVersion(stable[0].tag_name) : "unknown";

            if (to) stable = stable.filter((r) => semverLte(tagToVersion(r.tag_name), to));
            if (from) stable = stable.filter((r) => semverGte(tagToVersion(r.tag_name), from));

            stable = stable.slice(0, limit);

            const versions: ChangelogEntry[] = stable.map(buildEntry);

            const label = from ? `Changelog from ${from}` : `Latest ${limit} versions`;
            const meta = recordStep("get_changelog", label, Date.now() - start);

            return textResponse({ latestStable, versions }, meta);
        },
    );
}
