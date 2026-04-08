import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";

// Key breaking changes and migration notes per version range
const MIGRATION_NOTES: Record<string, { breaking: string[]; migration: string[] }> = {
    "2.0.0-beta.1": {
        breaking: [
            "StyleSet system completely redesigned: variables/component/child structure replaces flat properties",
            "SizeStyleSet and BoxStyleSet inheritance removed — use variables object instead",
            "CSS custom properties renamed (e.g. --vs-button-* simplified)",
            "Component size classes (vs-xs, vs-md, vs-lg) removed — use StyleSet or CSS tokens",
        ],
        migration: [
            "Replace flat StyleSet properties with { variables: { ... }, component: CSSProperties }",
            "Use get_component to check the new StyleSet interface for each component",
            "Use generate_style_set to scaffold new StyleSet objects",
            "Replace size prop usage with StyleSet variables or CSS tokens",
            "Update <style> blocks: move styles to :style-set prop (no .vs-* selector targeting)",
        ],
    },
};

export function registerGetMigrationGuide(server: McpServer): void {
    server.tool(
        "get_migration_guide",
        "Call this when the user needs to upgrade or migrate between Vlossom versions. " +
            "Returns breaking changes and step-by-step migration instructions. " +
            "Then call get_component to check updated interfaces for specific components.",
        {
            fromVersion: z
                .string()
                .optional()
                .describe("Current version the user is migrating FROM (e.g. '1.x', '2.0.0-alpha')"),
            toVersion: z
                .string()
                .optional()
                .default("2.0.0-beta.1")
                .describe("Target version to migrate TO (default: latest)"),
        },
        async ({ fromVersion, toVersion }) => {
            const start = Date.now();

            const notes = MIGRATION_NOTES[toVersion];

            if (!notes) {
                const meta = recordStep("get_migration_guide", `Migration → ${toVersion}`, Date.now() - start, {
                    summary: "no guide available",
                });
                return textResponse(
                    {
                        message: `No migration guide available for version ${toVersion}.`,
                        availableVersions: Object.keys(MIGRATION_NOTES),
                        next_actions: [{ tool: "get_changelog", reason: "check available versions and their changes" }],
                    },
                    meta,
                );
            }

            const meta = recordStep("get_migration_guide", `Migration → ${toVersion}`, Date.now() - start, {
                summary: `${notes.breaking.length} breaking, ${notes.migration.length} steps`,
            });

            return textResponse(
                {
                    fromVersion: fromVersion ?? "unknown",
                    toVersion,
                    breakingChanges: notes.breaking,
                    migrationSteps: notes.migration,
                    next_actions: [
                        { tool: "get_component", reason: "check the updated StyleSet interface for a specific component" },
                        { tool: "generate_style_set", reason: "generate a new StyleSet scaffold for a component" },
                        { tool: "get_changelog", reason: "see detailed changes per version" },
                    ],
                    avoid: [
                        "Do not assume old StyleSet property names still work — always check the current interface",
                        "Do not mix old flat StyleSet syntax with new variables/component structure",
                    ],
                },
                meta,
            );
        },
    );
}
