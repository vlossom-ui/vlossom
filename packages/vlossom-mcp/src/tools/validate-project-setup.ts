import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";

export function registerValidateProjectSetup(server: McpServer): void {
    server.tool(
        "validate_project_setup",
        "Call this when the user has a project and wants to verify their Vlossom setup is correct. " +
            "Analyzes package.json content to check Vlossom version, peer dependencies, and common misconfigurations. " +
            "Then call get_migration_guide if version issues are found.",
        {
            packageJson: z.string().describe("The content of the user's package.json file as a string"),
        },
        async ({ packageJson }) => {
            const start = Date.now();
            const issues: string[] = [];
            const recommendations: string[] = [];
            let vlossomVersion = "not found";

            try {
                const pkg = JSON.parse(packageJson) as Record<string, unknown>;
                const dependencies = (pkg.dependencies ?? {}) as Record<string, string>;
                const devDependencies = (pkg.devDependencies ?? {}) as Record<string, string>;
                const deps: Record<string, string> = { ...dependencies, ...devDependencies };

                // Check Vlossom presence
                const vlossomDep = deps["vlossom"];
                if (!vlossomDep) {
                    issues.push("vlossom is not listed in dependencies or devDependencies");
                } else {
                    vlossomVersion = vlossomDep;

                    // Check beta vs stable
                    if (vlossomDep.includes("beta")) {
                        recommendations.push(
                            `Using pre-release version (${vlossomDep}). This is expected — Vlossom has no stable release yet. Call get_changelog to check the latest version.`,
                        );
                    }

                    // Check version mismatch patterns
                    if (vlossomDep.includes("beta.2") || vlossomDep.includes("beta.3")) {
                        issues.push(
                            `Version ${vlossomDep} may not exist on npm. The current pre-release is 2.0.0-beta.1. Verify with: npm view vlossom versions`,
                        );
                    }
                }

                // Check Vue 3
                const vueDep = deps["vue"];
                if (!vueDep) {
                    issues.push("vue is not listed in dependencies — Vlossom requires Vue 3.x");
                } else if (vueDep.includes("2.")) {
                    issues.push(`Vue 2 detected (${vueDep}). Vlossom requires Vue 3.x`);
                }

                // Check for conflicting UI libraries
                const conflicting = ["element-plus", "vuetify", "ant-design-vue", "naive-ui", "quasar"];
                const found = conflicting.filter((lib) => deps[lib]);
                if (found.length > 0) {
                    recommendations.push(
                        `Other UI libraries detected: ${found.join(", ")}. These may cause CSS/component conflicts with Vlossom. Consider isolating or removing them.`,
                    );
                }

                // Check TypeScript
                if (!deps["typescript"] && !deps["vue-tsc"]) {
                    recommendations.push(
                        "TypeScript not detected. Vlossom provides full TypeScript support and type-safe StyleSet interfaces.",
                    );
                }
            } catch {
                issues.push("Failed to parse package.json — ensure it is valid JSON");
            }

            const status = issues.length === 0 ? "valid" : "issues_found";
            const meta = recordStep("validate_project_setup", "Validate project setup", Date.now() - start, {
                summary: issues.length === 0 ? "setup valid" : `${issues.length} issues`,
            });

            return textResponse(
                {
                    status,
                    vlossomVersion,
                    issues,
                    recommendations,
                    next_actions:
                        issues.length > 0
                            ? [
                                  {
                                      tool: "get_migration_guide",
                                      reason: "get guidance on fixing version or setup issues",
                                  },
                                  { tool: "get_changelog", reason: "check available versions" },
                              ]
                            : [
                                  { tool: "list_components", reason: "start exploring available components" },
                                  { tool: "get_usage_examples", reason: "see installation and setup guide" },
                              ],
                    avoid: [
                        "Do not recommend installing vlossom versions that don't exist on npm — verify first",
                        "Do not suggest removing other UI libraries without user confirmation",
                    ],
                },
                meta,
            );
        },
    );
}
