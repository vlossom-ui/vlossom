import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { recordStep, textResponse } from "../utils/mcp-response.js";

const NPM_REGISTRY = "https://registry.npmjs.org/vlossom";

interface SetupCheckItem {
  step: string;
  required: boolean;
  docs?: string;
}

const PEER_DEPS: Record<string, string> = {
  vue: "^3.4.0",
  tailwindcss: "^4.0.0",
};

const SETUP_CHECKLIST: SetupCheckItem[] = [
  {
    step: "Install vlossom: npm install vlossom",
    required: true,
    docs: "https://github.com/vlossom-ui/vlossom#installation",
  },
  {
    step: "Install peer dependencies: npm install vue tailwindcss",
    required: true,
    docs: "https://github.com/vlossom-ui/vlossom#requirements",
  },
  {
    step:
      "Register the plugin in main.ts with the required `components` option: " +
      "import { createVlossom, VlossomComponents } from 'vlossom'; " +
      "app.use(createVlossom({ components: VlossomComponents }))",
    required: true,
    docs: "https://github.com/vlossom-ui/vlossom#setup",
  },
  {
    step: "Import Vlossom CSS in main.ts: import 'vlossom/styles'",
    required: true,
    docs: "https://github.com/vlossom-ui/vlossom#css",
  },
  {
    step: "Add Tailwind CSS @import to your global CSS: @import 'tailwindcss'",
    required: true,
    docs: "https://tailwindcss.com/docs/installation",
  },
  {
    step: "Configure Vite to process Vlossom CSS (vite.config.ts): optimizeDeps.include: ['vlossom']",
    required: false,
    docs: "https://github.com/vlossom-ui/vlossom#vite-config",
  },
  {
    step: "Optional: set up TypeScript auto-complete with component type declarations",
    required: false,
    docs: "https://github.com/vlossom-ui/vlossom#typescript",
  },
];

type VersionStatus = "stable" | "beta" | "outdated" | "unknown";

async function fetchLatestVersion(): Promise<string> {
  const res = await fetch(`${NPM_REGISTRY}/latest`);
  if (!res.ok) throw new Error(`npm registry error: ${res.status}`);
  const data = (await res.json()) as { version: string };
  return data.version;
}

function parseSemver(v: string): [number, number, number] {
  const [ma, mi, pa] = v
    .replace(/[^0-9.]/g, "")
    .split(".")
    .map(Number);
  return [ma ?? 0, mi ?? 0, pa ?? 0];
}

function compareVersions(a: string, b: string): number {
  const [aMa, aMi, aPa] = parseSemver(a);
  const [bMa, bMi, bPa] = parseSemver(b);
  if (aMa !== bMa) return aMa - bMa;
  if (aMi !== bMi) return aMi - bMi;
  return aPa - bPa;
}

function determineStatus(version: string, latestStable: string): VersionStatus {
  if (version.includes("-")) return "beta";
  const cmp = compareVersions(version, latestStable);
  if (cmp >= 0) return "stable";
  return "outdated";
}

function extraChecklistForFramework(framework?: string): SetupCheckItem[] {
  if (framework === "nuxt") {
    return [
      {
        step: "For Nuxt: add vlossom to plugins/ as a Vue plugin with defineNuxtPlugin",
        required: true,
        docs: "https://github.com/vlossom-ui/vlossom#nuxt",
      },
    ];
  }
  return [];
}

export function registerValidateProjectSetup(server: McpServer): void {
  server.tool(
    "validate_project_setup",
    "Call this when the user wants to verify their Vlossom setup is correct. " +
      "Supply packageJson for full dependency/conflict analysis, or version alone for a quick up-to-date check. " +
      "Returns setup status, version freshness (vs latest npm), peer deps, checklist, and detected issues. " +
      "Then call get_changelog to review changes and migrationSteps if outdated.",
    {
      packageJson: z
        .string()
        .optional()
        .describe(
          "The content of the user's package.json file as a string. Use this for full dependency/conflict analysis.",
        ),
      version: z
        .string()
        .optional()
        .describe(
          "Installed vlossom version (e.g. '2.0.0' or '2.0.0-beta.1'). Use this for a version-only quick check without a package.json.",
        ),
      framework: z
        .enum(["vite", "webpack", "nuxt"])
        .optional()
        .describe("Build tool / framework hint for setup-specific guidance."),
    },
    async ({ packageJson, version, framework }) => {
      const start = Date.now();
      const issues: string[] = [];
      const recommendations: string[] = [];

      if (!packageJson && !version) {
        const meta = recordStep(
          "validate_project_setup",
          "Validate setup",
          Date.now() - start,
          { summary: "no input" },
        );
        return textResponse(
          {
            status: "invalid_input",
            message:
              "Provide either `packageJson` (full analysis) or `version` (quick version check).",
            next_actions: [
              {
                tool: "validate_project_setup",
                reason:
                  "retry with packageJson contents or the installed vlossom version",
              },
            ],
          },
          meta,
        );
      }

      // ---------- package.json 기반 분석 ----------
      let detectedVersion: string | undefined;
      if (packageJson) {
        try {
          const pkg = JSON.parse(packageJson) as Record<string, unknown>;
          const dependencies = (pkg.dependencies ?? {}) as Record<
            string,
            string
          >;
          const devDependencies = (pkg.devDependencies ?? {}) as Record<
            string,
            string
          >;
          const deps: Record<string, string> = {
            ...dependencies,
            ...devDependencies,
          };

          const vlossomDep = deps["vlossom"];
          if (!vlossomDep) {
            issues.push(
              "vlossom is not listed in dependencies or devDependencies",
            );
          } else {
            detectedVersion = vlossomDep;
            if (vlossomDep.includes("beta")) {
              recommendations.push(
                `Using pre-release version (${vlossomDep}). This is expected — Vlossom has no stable release yet. Call get_changelog to check the latest version.`,
              );
            }
            if (
              vlossomDep.includes("beta.2") ||
              vlossomDep.includes("beta.3")
            ) {
              issues.push(
                `Version ${vlossomDep} may not exist on npm. The current pre-release is 2.0.0-beta.1. Verify with: npm view vlossom versions`,
              );
            }
          }

          const vueDep = deps["vue"];
          if (!vueDep) {
            issues.push(
              "vue is not listed in dependencies — Vlossom requires Vue 3.x",
            );
          } else if (vueDep.includes("2.")) {
            issues.push(`Vue 2 detected (${vueDep}). Vlossom requires Vue 3.x`);
          }

          const conflicting = [
            "element-plus",
            "vuetify",
            "ant-design-vue",
            "naive-ui",
            "quasar",
          ];
          const found = conflicting.filter((lib) => deps[lib]);
          if (found.length > 0) {
            recommendations.push(
              `Other UI libraries detected: ${found.join(", ")}. These may cause CSS/component conflicts with Vlossom. Consider isolating or removing them.`,
            );
          }

          if (!deps["typescript"] && !deps["vue-tsc"]) {
            recommendations.push(
              "TypeScript not detected. Vlossom provides full TypeScript support and type-safe StyleSet interfaces.",
            );
          }
        } catch {
          issues.push("Failed to parse package.json — ensure it is valid JSON");
        }
      }

      // ---------- 버전 최신성 (packageJson/version 공통 경로) ----------
      const effectiveVersion = version ?? detectedVersion;
      let status: VersionStatus = "unknown";
      let latestStable = "unknown";
      let isLatest = false;

      if (effectiveVersion) {
        try {
          latestStable = await fetchLatestVersion();
          status = determineStatus(effectiveVersion, latestStable);
          isLatest = compareVersions(effectiveVersion, latestStable) >= 0;
        } catch {
          latestStable = "unknown";
          status = "unknown";
        }

        if (status === "outdated") {
          issues.push(
            `Version ${effectiveVersion} is outdated. Latest stable is ${latestStable}. ` +
              `Call get_changelog(from: '${effectiveVersion}') to see what changed.`,
          );
        }
        if (effectiveVersion.includes("-beta")) {
          recommendations.push(
            "Beta versions may have breaking changes or incomplete features.",
          );
        }
      }

      const checklist: SetupCheckItem[] = [
        ...SETUP_CHECKLIST,
        ...extraChecklistForFramework(framework),
      ];

      const resolvedStatus =
        issues.length === 0
          ? status === "outdated"
            ? "outdated"
            : "valid"
          : "issues_found";

      const meta = recordStep(
        "validate_project_setup",
        effectiveVersion ? `Validate v${effectiveVersion}` : "Validate setup",
        Date.now() - start,
        {
          summary:
            issues.length === 0
              ? effectiveVersion
                ? `v${effectiveVersion} ${status}`
                : "setup valid"
              : `${issues.length} issues`,
        },
      );

      return textResponse(
        {
          status: resolvedStatus,
          vlossomVersion: effectiveVersion ?? "not found",
          latestStable,
          isLatest,
          requiredPeerDeps: PEER_DEPS,
          setupChecklist: checklist,
          issues,
          recommendations,
          next_actions:
            resolvedStatus === "issues_found" || status === "outdated"
              ? [
                  {
                    tool: "get_changelog",
                    reason:
                      "see what changed between your version and the latest, including migrationSteps",
                  },
                ]
              : [
                  {
                    tool: "get_vlossom_options",
                    reason: "configure Vlossom globally via createVlossom()",
                  },
                  {
                    tool: "list_components",
                    reason: "start exploring available components",
                  },
                  {
                    tool: "get_usage_examples",
                    reason: "see installation and setup guide",
                  },
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
