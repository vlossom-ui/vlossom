import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getComponentMeta } from "../services/meta-registry.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";
import type { ComponentMeta } from "../types/meta.js";


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
            const start = Date.now();
            const metaA = getComponentMeta(a);
            if (!metaA) {
                const meta = recordStep("compare_components", `${a} vs ${b}`, Date.now() - start);
                return textResponse({
                    error: `Component '${a}' not found. Use list_components to see available components.`,
                    next_actions: [
                        { tool: "list_components", reason: "verify the exact component name" },
                    ],
                }, meta);
            }

            const metaB = getComponentMeta(b);
            if (!metaB) {
                const meta = recordStep("compare_components", `${a} vs ${b}`, Date.now() - start);
                return textResponse({
                    error: `Component '${b}' not found. Use list_components to see available components.`,
                    next_actions: [
                        { tool: "list_components", reason: "verify the exact component name" },
                    ],
                }, meta);
            }

            if (metaA.name === metaB.name) {
                const meta = recordStep("compare_components", `${a} vs ${b}`, Date.now() - start);
                return textResponse({
                    error: "Cannot compare a component with itself.",
                    next_actions: [
                        { tool: "list_components", reason: "verify the exact component name" },
                    ],
                }, meta);
            }

            const differences = computeDifferences(metaA, metaB);
            const meta = recordStep("compare_components", `${a} vs ${b}`, Date.now() - start);

            return textResponse({
                a: metaA,
                b: metaB,
                differences,
                next_actions: [
                    { tool: "get_component", reason: "get full props and StyleSet for either component" },
                    { tool: "generate_component_code", reason: "generate code using the chosen component" },
                ],
            }, meta);
        }
    );
}
