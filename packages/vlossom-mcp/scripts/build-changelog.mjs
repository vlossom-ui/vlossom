#!/usr/bin/env node
// Fetches release notes from GitHub Releases API and writes to:
//   src/data/changelog.json
//   dist/data/changelog.json  (if dist/data exists)
// Run before build: npm run generate

import { existsSync, mkdirSync, readFileSync, writeFileSync } from "fs";
import { resolve, dirname, join } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDataDir = resolve(__dirname, "../src/data");
const distDataDir = resolve(__dirname, "../dist/data");

const GITHUB_RELEASES_API = "https://api.github.com/repos/vlossom-ui/vlossom/releases";

/** "vlossom-v2.0.0-beta.1" → "2.0.0-beta.1",  "v1.2.3" → "1.2.3" */
function tagToVersion(tag) {
    return tag.replace(/^(?:.*-)?v/, "");
}

function parseSemver(v) {
    const [ma, mi, pa] = v.replace(/[^0-9.]/g, "").split(".").map(Number);
    return [ma ?? 0, mi ?? 0, pa ?? 0];
}

function semverGte(a, b) {
    const [aMa, aMi, aPa] = parseSemver(a);
    const [bMa, bMi, bPa] = parseSemver(b);
    if (aMa !== bMa) return aMa > bMa;
    if (aMi !== bMi) return aMi > bMi;
    return aPa >= bPa;
}

function parseReleaseBody(body) {
    const breaking = [];
    const features = [];
    const fixes = [];

    if (!body) return { breaking, features, fixes };

    const lines = body.split("\n");
    let section = null;

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

    return { breaking, features, fixes };
}

async function main() {
    console.log("[build-changelog] Fetching releases from GitHub…");

    let releases;
    try {
        const res = await fetch(`${GITHUB_RELEASES_API}?per_page=100`, {
            headers: { "User-Agent": "vlossom-mcp", Accept: "application/vnd.github+json" },
        });
        if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText}`);
        releases = await res.json();
    } catch (err) {
        console.error(`  ✗ Failed to fetch: ${err.message}`);
        console.error("  Skipping changelog.json generation.");
        process.exit(0); // non-fatal — build can proceed without it
    }

    const sorted = releases
        .filter((r) => !r.draft)
        .sort((a, b) => (semverGte(tagToVersion(a.tag_name), tagToVersion(b.tag_name)) ? -1 : 1));

    const entries = sorted.map((r) => {
        const version = tagToVersion(r.tag_name);
        const date = r.published_at.slice(0, 10);
        const { breaking, features, fixes } = parseReleaseBody(r.body ?? "");
        const notes = r.body?.trim() || undefined;
        return { version, date, prerelease: r.prerelease, breaking, features, fixes, notes };
    });

    const latestStable = entries.find((e) => !e.prerelease)?.version ?? null;
    const latestPrerelease = entries.find((e) => e.prerelease)?.version ?? null;
    const latestVersion = entries[0]?.version ?? "unknown";

    // Read the current in-development version from vlossom package.json (may be ahead of published releases)
    let currentVersion = latestVersion;
    const vlossomPkgPath = resolve(__dirname, "../../vlossom/package.json");
    if (existsSync(vlossomPkgPath)) {
        try {
            const pkg = JSON.parse(readFileSync(vlossomPkgPath, "utf-8"));
            if (pkg.version) currentVersion = pkg.version;
        } catch { /* ignore */ }
    }

    const data = { latestStable, latestPrerelease, latestVersion, currentVersion, entries };
    const json = JSON.stringify(data, null, 2);

    mkdirSync(srcDataDir, { recursive: true });
    writeFileSync(join(srcDataDir, "changelog.json"), json, "utf-8");
    console.log(`  Wrote src/data/changelog.json (${entries.length} releases, latest: ${latestStable})`);

    if (existsSync(distDataDir)) {
        writeFileSync(join(distDataDir, "changelog.json"), json, "utf-8");
        console.log(`  Wrote dist/data/changelog.json`);
    }

    console.log("  ✓ Done.");
}

main();
