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
        step: "Register the plugin in main.ts: import { createVlossom } from 'vlossom'; app.use(createVlossom({}))",
        required: true,
        docs: "https://github.com/vlossom-ui/vlossom#setup",
    },
    {
        step: "Import Vlossom CSS in main.ts: import 'vlossom/dist/vlossom.css'",
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

/** Fetch latest stable version from npm. */
async function fetchLatestVersion(): Promise<string> {
    const res = await fetch(`${NPM_REGISTRY}/latest`);
    if (!res.ok) throw new Error(`npm registry error: ${res.status}`);
    const data = (await res.json()) as { version: string };
    return data.version;
}

function parseSemver(v: string): [number, number, number] {
    const [ma, mi, pa] = v.replace(/[^0-9.]/g, "").split(".").map(Number);
    return [ma ?? 0, mi ?? 0, pa ?? 0];
}

function compareVersions(a: string, b: string): number {
    const [aMa, aMi, aPa] = parseSemver(a);
    const [bMa, bMi, bPa] = parseSemver(b);
    if (aMa !== bMa) return aMa - bMa;
    if (aMi !== bMi) return aMi - bMi;
    return aPa - bPa;
}

type VersionStatus = "stable" | "beta" | "outdated" | "unknown";

function determineStatus(version: string, latestStable: string): VersionStatus {
    if (version.includes("-")) return "beta";
    const cmp = compareVersions(version, latestStable);
    if (cmp >= 0) return "stable";
    return "outdated";
}

export function registerCheckVlossomSetup(server: McpServer): void {
    server.tool(
        "check_vlossom_setup",
        "Checks whether a given Vlossom version is up-to-date and returns a setup checklist. " +
            "Call this when the user asks 'is my vlossom setup correct?', 'what version should I use?', " +
            "or when diagnosing installation issues. " +
            "When the status is 'outdated', follow up with get_changelog(from: version) to show migration steps.",
        {
            version: z
                .string()
                .describe("The installed vlossom version, e.g. '2.0.0' or '2.0.0-beta.1'."),
            framework: z
                .enum(["vite", "webpack", "nuxt"])
                .optional()
                .describe("Build tool / framework hint for setup-specific guidance."),
        },
        async ({ version, framework }) => {
            const start = Date.now();

            let latestStable: string;
            try {
                latestStable = await fetchLatestVersion();
            } catch {
                latestStable = "unknown";
            }

            const status: VersionStatus =
                latestStable === "unknown" ? "unknown" : determineStatus(version, latestStable);

            const isLatest = latestStable !== "unknown" && compareVersions(version, latestStable) >= 0;

            const knownIssues: string[] = [];
            if (status === "outdated") {
                knownIssues.push(
                    `Version ${version} is outdated. Latest stable is ${latestStable}. ` +
                        `Call get_changelog(from: '${version}') to see what changed.`,
                );
            }
            if (version.includes("-beta")) {
                knownIssues.push("Beta versions may have breaking changes or incomplete features.");
            }

            const checklist: SetupCheckItem[] = [...SETUP_CHECKLIST];
            if (framework === "nuxt") {
                checklist.push({
                    step: "For Nuxt: add vlossom to plugins/ as a Vue plugin with defineNuxtPlugin",
                    required: true,
                    docs: "https://github.com/vlossom-ui/vlossom#nuxt",
                });
            }

            const meta = recordStep("check_vlossom_setup", `Check v${version}`, Date.now() - start);

            return textResponse(
                {
                    version,
                    status,
                    isLatest,
                    latestStable,
                    requiredPeerDeps: PEER_DEPS,
                    setupChecklist: checklist,
                    ...(knownIssues.length > 0 && { knownIssues }),
                    next_actions:
                        status === "outdated"
                            ? [
                                { tool: "get_changelog", reason: "see what changed and migration steps from your version" },
                            ]
                            : [
                                { tool: "get_vlossom_options", reason: "configure Vlossom globally via createVlossom()" },
                                { tool: "get_component", reason: "look up a specific component" },
                            ],
                },
                meta,
            );
        },
    );
}
