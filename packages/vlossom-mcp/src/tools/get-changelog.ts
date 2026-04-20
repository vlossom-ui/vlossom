import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { createRequire } from "module";
import { dirname } from "path";
import { fileURLToPath } from "url";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

interface ChangelogEntryRaw {
  version: string;
  date: string;
  prerelease: boolean;
  breaking: string[];
  features: string[];
  fixes: string[];
  notes?: string;
}

interface ChangelogEntry extends ChangelogEntryRaw {
  /** Migration steps for major breaking versions (merged from the former get_migration_guide tool). */
  migrationSteps?: string[];
}

interface ChangelogData {
  latestStable: string | null;
  latestPrerelease: string | null;
  latestVersion: string;
  currentVersion: string;
  entries: ChangelogEntryRaw[];
}

/**
 * Per-version migration steps. Merged here from the former get_migration_guide tool
 * so version info, breaking changes, and migration guidance live in one place.
 */
const MIGRATION_STEPS: Record<string, string[]> = {
  "2.0.0-beta.1": [
    "Replace flat StyleSet properties with { variables: { ... }, component: CSSProperties }",
    "Use get_component to check the new StyleSet interface for each component",
    "Use generate_style_set to scaffold new StyleSet objects",
    "Replace size prop usage with StyleSet variables or CSS tokens",
    "Update <style> blocks: move styles to :style-set prop (no .vs-* selector targeting)",
  ],
};

let cache: ChangelogData | null = null;

function loadChangelog(): ChangelogData {
  if (cache) return cache;
  const jsonPath = `${__dirname}/../data/changelog.json`;
  cache = require(jsonPath) as ChangelogData;
  return cache;
}

function parseSemver(v: string): [number, number, number] {
  const [ma, mi, pa] = v
    .replace(/[^0-9.]/g, "")
    .split(".")
    .map(Number);
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

function enrichWithMigration(entry: ChangelogEntryRaw): ChangelogEntry {
  const steps = MIGRATION_STEPS[entry.version];
  return steps ? { ...entry, migrationSteps: steps } : entry;
}

export function registerGetChangelog(server: McpServer): void {
  server.tool(
    "get_changelog",
    "No prerequisite needed. " +
      "Call this when the user asks about the current Vlossom version, what changed, or how to migrate between versions. " +
      "Returns version summary (currentVersion, latestStable, latestPrerelease) and changelog entries with breaking changes, features, fixes, and migrationSteps (when applicable). " +
      "Pairs with validate_project_setup: when setup check reports an outdated version, call get_changelog(from: currentVersion) to show migration guidance.",
    {
      from: z
        .string()
        .optional()
        .describe(
          "Starting version (inclusive), e.g. '1.5.0'. Omit to show only the latest version.",
        ),
      to: z
        .string()
        .optional()
        .describe(
          "Ending version (inclusive), e.g. '2.0.0'. Default: latest stable.",
        ),
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
        const meta = recordStep(
          "get_changelog",
          "Load failed",
          Date.now() - start,
          { summary: "load failed" },
        );
        return textResponse(
          {
            error:
              "changelog.json not found. Run `npm run generate` to build it.",
            next_actions: [
              {
                tool: "validate_project_setup",
                reason:
                  "verify your installation status after reviewing the changelog",
              },
            ],
          },
          meta,
        );
      }

      let entries = [...data.entries];

      if (to) entries = entries.filter((e) => semverLte(e.version, to));
      if (from) entries = entries.filter((e) => semverGte(e.version, from));
      entries = entries.slice(0, limit);

      const enrichedEntries: ChangelogEntry[] =
        entries.map(enrichWithMigration);
      const hasMigrationGuidance = enrichedEntries.some(
        (e) => e.migrationSteps,
      );

      const label = from
        ? `Changelog from ${from}`
        : `Latest ${limit} versions`;
      const meta = recordStep("get_changelog", label, Date.now() - start, {
        summary: hasMigrationGuidance
          ? `${enrichedEntries.length} versions (+migration)`
          : `${enrichedEntries.length} versions`,
      });

      return textResponse(
        {
          currentVersion: data.currentVersion,
          latestStable: data.latestStable,
          latestPrerelease: data.latestPrerelease,
          isPrerelease:
            data.latestStable === null ||
            data.currentVersion !== data.latestStable,
          versions: enrichedEntries,
          next_actions: [
            {
              tool: "validate_project_setup",
              reason:
                "verify your installation status after reviewing the changelog",
            },
            {
              tool: "get_component",
              reason:
                "check the updated StyleSet interface for a specific component after migration",
            },
            {
              tool: "generate_style_set",
              reason:
                "generate a new StyleSet scaffold to adopt the new system",
            },
          ],
          avoid: [
            "Do not assume old StyleSet property names still work after a major version bump — always check the current interface",
            "Do not mix old flat StyleSet syntax with the new variables/component structure",
          ],
        },
        meta,
      );
    },
  );
}
