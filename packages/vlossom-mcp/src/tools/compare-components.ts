import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getComponentMeta } from "../services/meta-registry.js";
import { textResponse } from "../utils/mcp-response.js";
import type { ComponentMeta } from "../types/meta.js";

const RECOMMENDATIONS: Record<string, string> = {
    "VsModal vs VsDrawer":
        "Use VsModal for centered dialogs requiring user attention. Use VsDrawer for side panels and navigation menus.",
    "VsInput vs VsTextarea":
        "Use VsInput for single-line text. Use VsTextarea for multi-line content.",
    "VsInput vs VsSearchInput":
        "Use VsInput for general text input. Use VsSearchInput when you need built-in search functionality with regex/case options.",
    "VsSelect vs VsRadio":
        "Use VsSelect for dropdown selection (space-efficient). Use VsRadio when all options should be visible simultaneously.",
    "VsCheckbox vs VsSwitch":
        "Use VsCheckbox for multi-select or form submission. Use VsSwitch for immediate binary on/off toggles.",
    "VsLoading vs VsSkeleton":
        "Use VsLoading for action feedback (button clicks, data fetching). Use VsSkeleton as a content placeholder while page data loads.",
    "VsToast vs VsModal":
        "Use VsToast for brief non-blocking notifications. Use VsModal when you need user interaction or confirmation.",
    "VsTabs vs VsSteps":
        "Use VsTabs for parallel content switching. Use VsSteps for sequential workflows or wizards.",
    "VsAccordion vs VsBlock":
        "Use VsAccordion for collapsible sections. Use VsBlock for always-visible content sections with optional title.",
    "VsHeader vs VsBar":
        "Use VsHeader for the main app header at the top. Use VsBar for any horizontal toolbar within a layout.",
};

function getRecommendation(nameA: string, nameB: string): string {
    const keyAB = `${nameA} vs ${nameB}`;
    const keyBA = `${nameB} vs ${nameA}`;
    return (
        RECOMMENDATIONS[keyAB] ??
        RECOMMENDATIONS[keyBA] ??
        "Both components serve similar purposes. Check props for your specific use case."
    );
}

function computeDifferences(a: ComponentMeta, b: ComponentMeta): string[] {
    const differences: string[] = [];

    // 1. Props count difference
    const propsCountA = a.props.length;
    const propsCountB = b.props.length;
    differences.push(`${a.name} has ${propsCountA} props, ${b.name} has ${propsCountB} props`);

    // 2. Unique props
    const propNamesA = new Set(a.props.map((p) => p.name));
    const propNamesB = new Set(b.props.map((p) => p.name));

    const uniqueToA = [...propNamesA].filter((n) => !propNamesB.has(n));
    const uniqueToB = [...propNamesB].filter((n) => !propNamesA.has(n));

    if (uniqueToA.length > 0) {
        differences.push(`${a.name} has unique props: ${uniqueToA.join(", ")}`);
    }
    if (uniqueToB.length > 0) {
        differences.push(`${b.name} has unique props: ${uniqueToB.join(", ")}`);
    }

    // 3. StyleSet variables
    const varsA = Object.keys(a.styleSet.variables);
    const varsB = Object.keys(b.styleSet.variables);

    if (varsA.length > 0 || varsB.length > 0) {
        const varSummaryA = varsA.length > 0 ? varsA.join(", ") : "(none)";
        const varSummaryB = varsB.length > 0 ? varsB.join(", ") : "(none)";
        differences.push(
            `${a.name} styleSet variables: ${varSummaryA}; ${b.name} styleSet variables: ${varSummaryB}`
        );
    }

    // 4. Child component refs
    const refsA = a.styleSet.childRefs;
    const refsB = b.styleSet.childRefs;

    const onlyInA = refsA.filter((r) => !refsB.includes(r));
    const onlyInB = refsB.filter((r) => !refsA.includes(r));
    const inBoth = refsA.filter((r) => refsB.includes(r));

    if (onlyInA.length > 0) {
        differences.push(`${a.name} uses exclusively: ${onlyInA.join(", ")}`);
    }
    if (onlyInB.length > 0) {
        differences.push(`${b.name} uses exclusively: ${onlyInB.join(", ")}`);
    }
    if (inBoth.length > 0) {
        differences.push(`Both use: ${inBoth.join(", ")}`);
    }

    // 5. Events count (only if different)
    const eventsCountA = a.events.length;
    const eventsCountB = b.events.length;
    if (eventsCountA !== eventsCountB) {
        differences.push(
            `${a.name} has ${eventsCountA} events, ${b.name} has ${eventsCountB} events`
        );
    }

    return differences;
}

export function registerCompareComponents(server: McpServer): void {
    server.tool(
        "compare_components",
        "Call this when the user asks 'when should I use X vs Y', 'difference between X and Y', or 'which component should I choose'. " +
            "Returns both components' full metadata plus computed differences and a usage recommendation. " +
            "No follow-up tool call is needed — the response is self-contained.",
        {
            a: z
                .string()
                .describe('First component name — accepts PascalCase ("VsModal") or kebab-case ("vs-modal")'),
            b: z
                .string()
                .describe('Second component name — accepts PascalCase ("VsDrawer") or kebab-case ("vs-drawer")'),
        },
        async ({ a, b }) => {
            const metaA = getComponentMeta(a);
            if (!metaA) {
                return textResponse({
                    error: `Component '${a}' not found. Use list_components to see available components.`,
                });
            }

            const metaB = getComponentMeta(b);
            if (!metaB) {
                return textResponse({
                    error: `Component '${b}' not found. Use list_components to see available components.`,
                });
            }

            if (metaA.name === metaB.name) {
                return textResponse({
                    error: "Cannot compare a component with itself.",
                });
            }

            const differences = computeDifferences(metaA, metaB);
            const recommendation = getRecommendation(metaA.name, metaB.name);

            return textResponse({
                a: metaA,
                b: metaB,
                differences,
                recommendation,
            });
        }
    );
}
