import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";
import { getAllComponentsMeta } from "../services/meta-registry.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

/**
 * Natural language → Vlossom concept keyword mapping.
 * Expands the search query so terms not in component metadata
 * still resolve to relevant components.
 */
const SYNONYM_MAP: Record<string, string[]> = {
    // Layout & Navigation
    chart: ["table", "grid", "data"],
    graph: ["table", "progress"],
    dashboard: ["layout", "grid", "header", "footer"],
    nav: ["header", "tabs", "steps"],
    navigation: ["header", "tabs", "steps"],
    sidebar: ["drawer", "layout"],
    panel: ["drawer", "block", "accordion"],
    menu: ["drawer", "tabs", "select"],

    // Overlay & Feedback
    popup: ["modal", "tooltip", "drawer"],
    overlay: ["modal", "dimmed", "drawer"],
    alert: ["toast", "modal", "message"],
    notification: ["toast", "message"],
    confirm: ["modal", "alert"],
    snackbar: ["toast"],
    dialog: ["modal"],
    banner: ["toast", "bar"],

    // Form & Input
    dropdown: ["select"],
    combobox: ["select", "search-input"],
    autocomplete: ["search-input", "select"],
    multiselect: ["select", "checkbox"],
    picker: ["select", "date"],
    toggle: ["switch"],
    slider: ["input", "range"],
    rating: ["input"],
    typeahead: ["search-input"],

    // Data Display
    list: ["table", "grouped-list"],
    grid: ["table", "layout"],
    card: ["block", "image"],
    tag: ["chip"],
    badge: ["chip", "message"],
    label: ["chip", "message"],
    pill: ["chip"],
    bubble: ["chip", "tooltip"],
    thumbnail: ["image", "avatar"],

    // Loading & Progress
    spinner: ["loading", "skeleton"],
    placeholder: ["skeleton"],
    shimmer: ["skeleton"],
    "progress bar": ["progress", "loading"],
    bar: ["progress", "bar"],

    // Interaction
    drag: ["file-drop"],
    "file upload": ["file-drop"],
    "drag and drop": ["file-drop"],
    collapse: ["accordion", "expandable"],
    expand: ["accordion", "expandable"],
    tree: ["accordion", "grouped-list"],
    stepper: ["steps"],
    wizard: ["steps"],
    carousel: ["tabs", "index-view"],
    gallery: ["image", "tabs"],

    // Typography & Content
    code: ["block", "text-wrap"],
    markdown: ["block", "text-wrap"],
    copy: ["text-wrap"],
    link: ["text-wrap"],
    hint: ["tooltip", "message"],
    helper: ["tooltip", "message"],
    error: ["message", "input"],
    validation: ["form", "input", "message"],

    // Misc
    theme: ["theme-button"],
    "dark mode": ["theme-button"],
    color: ["theme-button", "color-scheme"],
    scroll: ["inner-scroll", "bar"],
    sticky: ["bar", "header", "footer"],
    fixed: ["bar", "header", "footer"],
    divider: ["divider"],
    separator: ["divider"],
};

/** Expands a query string by appending synonym keywords. */
function expandQuery(query: string): string[] {
    const lower = query.toLowerCase();
    const terms = new Set([lower]);

    for (const [synonym, targets] of Object.entries(SYNONYM_MAP)) {
        if (lower.includes(synonym)) {
            for (const target of targets) {
                terms.add(target);
            }
        }
    }

    return [...terms];
}

export function registerSearchComponents(server: McpServer): void {
    server.tool(
        "search_components",
        "No prerequisite needed. " +
            "Call this when the user provides a specific component name or a clear, concrete keyword (e.g. 'button', 'input', 'drawer'). " +
            "Do NOT call this for vague or free-form descriptions — call clarify_intent first instead. " +
            "Searches component names, descriptions, and prop names/descriptions (case-insensitive) and returns all matching ComponentMeta objects. " +
            "Then call get_component for each result to get full details.",
        { query: z.string().describe("Search term to match against component names, descriptions, and prop names/descriptions") },
        async ({ query }) => {
            const start = Date.now();
            const all = getAllComponentsMeta();
            const expandedTerms = expandQuery(query);

            const results = all.filter((component) => {
                return expandedTerms.some((term) => {
                    if (component.name.toLowerCase().includes(term)) return true;
                    if (component.kebabName.toLowerCase().includes(term)) return true;
                    if (component.description.toLowerCase().includes(term)) return true;

                    return component.props.some(
                        (prop) =>
                            prop.name.toLowerCase().includes(term) ||
                            prop.description.toLowerCase().includes(term)
                    );
                });
            });

            const meta = recordStep("search_components", `Search: ${query}`, Date.now() - start);

            if (results.length === 0) {
                return textResponse({
                    results: [],
                    expandedTerms: expandedTerms.length > 1 ? expandedTerms : undefined,
                    message: `No components found for query '${query}'`,
                    next_action: "clarify_intent",
                    next_action_message:
                        "No components matched. Before filing an issue, call clarify_intent to check if the query " +
                        "can be rephrased — the user may be describing an existing component in different words. " +
                        "Only proceed to suggest_issue if clarification confirms the feature genuinely does not exist.",
                }, meta);
            }

            return textResponse({
                results,
                total: results.length,
                expandedTerms: expandedTerms.length > 1 ? expandedTerms : undefined,
                next_action: "get_component",
                next_action_message: "Call get_component for each result to get full props/StyleSet details.",
            }, meta);
        }
    );
}
