import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { recordStep, textResponse } from "../utils/mcp-response.js";

/**
 * A single step in a pipeline walkthrough.
 */
interface PipelineStep {
    step: number;
    tool: string;
    /** Short label shown in the stepper (≤24 chars). */
    stepperLabel: string;
    input: Record<string, unknown>;
    output_summary: string;
    why: string;
}

/**
 * A full end-to-end pipeline example.
 */
interface PipelineExample {
    id: string;
    title: string;
    user_prompt: string;
    outcome: string;
    pipeline: PipelineStep[];
}

const EXAMPLES: PipelineExample[] = [
    {
        id: "missing-component",
        title: "Requesting a component that does not exist in Vlossom",
        user_prompt: "I want to draw a chart with Vlossom.",
        outcome:
            "Vlossom has no chart component. The user is guided through filing an enhancement issue on GitHub.",
        pipeline: [
            {
                step: 1,
                tool: "search_components",
                stepperLabel: "Search: chart",
                input: { query: "chart" },
                output_summary:
                    '{ results: [], next_actions: [{tool:"clarify_intent",reason:"rephrase query to match existing components"},{tool:"check_github_token",reason:"file issue if feature does not exist"}] }',
                why: "First attempt: keyword search across all component names, descriptions, and prop text. Empty result means no direct match.",
            },
            {
                step: 2,
                tool: "clarify_intent",
                stepperLabel: "Clarify: chart options",
                input: {
                    query: "I want to draw a chart with Vlossom.",
                    candidates: [
                        {
                            label: "Look for a data-visualization component",
                            prompt: "search_components query: data visualization graph",
                            pipeline: "search_components → get_component",
                        },
                        {
                            label: "Look for a progress/bar-style display",
                            prompt: "suggest_components for showing numeric progress visually",
                            pipeline: "suggest_components → get_component",
                        },
                        {
                            label: "File an enhancement issue for a chart component",
                            prompt: "chart component does not exist; file issue",
                            pipeline:
                                "check_github_token → set_github_token → draft_issue → report_issue",
                        },
                    ],
                },
                output_summary:
                    '{ choices: [{index:1,...},{index:2,...},{index:3,...}], presentation_format: "[1] Look for a data-visualization component\\n[2] ..." }',
                why: 'search_components returned next_actions with clarify_intent. Before concluding the feature is missing, offer rephrasing alternatives. One candidate always includes the issue-filing path.',
            },
            {
                step: 3,
                tool: "suggest_components",
                stepperLabel: "Suggest: data visual…",
                input: { useCase: "data visualization graph" },
                output_summary:
                    '{ components: [], next_actions: [{tool:"check_github_token",reason:"file an enhancement issue for the missing feature"}] }',
                why: "User chose option 1 (rephrase). Metadata search returns nothing → confirmed missing.",
            },
            {
                step: 4,
                tool: "check_github_token",
                stepperLabel: "Check GitHub token",
                input: {},
                output_summary:
                    '{ isConfigured: false, next_actions: [{tool:"set_github_token",reason:"provide a GitHub PAT"}] }',
                why: 'suggest_components returned next_actions with check_github_token. Before drafting, verify token availability.',
            },
            {
                step: 5,
                tool: "set_github_token",
                stepperLabel: "Set GitHub token",
                input: { token: "<user-provided PAT>" },
                output_summary:
                    '{ success: true, next_actions: [{tool:"draft_issue",reason:"token is now set, proceed to draft the issue"}] }',
                why: "Token was missing; user provides it. Now the issue-filing pipeline can proceed.",
            },
            {
                step: 6,
                tool: "draft_issue",
                stepperLabel: "Draft enhancement iss…",
                input: {
                    type: "enhancement",
                    title: "Add chart/data-visualization component",
                    body: "Motivation: users need to render line/bar/pie charts. Proposed API: <VsChart :data='...' type='line' />",
                },
                output_summary:
                    '{ title: "Add chart/data-visualization component", labels: ["enhancement"], requiredSections: [...], next_actions: [{tool:"report_issue",reason:"all sections confirmed, submit"}] }',
                why: "Generates the structured issue draft. All required sections must be confirmed with the user before proceeding.",
            },
            {
                step: 7,
                tool: "report_issue",
                stepperLabel: "Report to GitHub",
                input: {
                    title: "Add chart/data-visualization component",
                    body: "<confirmed body text>",
                    labels: ["enhancement"],
                },
                output_summary: '{ url: "https://github.com/vlossom-ui/vlossom/issues/NNN" }',
                why: "User confirmed the draft. Creates the real GitHub issue. Never call without explicit user approval.",
            },
        ],
    },
    {
        id: "build-login-form",
        title: "Building a login form with Vlossom components",
        user_prompt: "I want to build a login form.",
        outcome:
            "Recommends VsForm, VsInput, VsButton. Returns full props/StyleSet for each, then generates ready-to-use Vue template code.",
        pipeline: [
            {
                step: 1,
                tool: "suggest_components",
                stepperLabel: "Suggest: login form",
                input: { useCase: "login form" },
                output_summary:
                    '{ components: [VsForm, VsInput, VsButton], reasoning: "Based on \'login form\' use case: ...", next_actions: [{tool:"get_component",...}] }',
                why: "User described a use case, not a specific component name. suggest_components maps keywords to relevant components.",
            },
            {
                step: 2,
                tool: "get_component",
                stepperLabel: "VsForm detail",
                input: { name: "VsForm" },
                output_summary:
                    '{ name: "VsForm", props: [...], styleSet: {...}, events: [...], next_actions: [{tool:"get_css_tokens",...}] }',
                why: "Fetch full props/StyleSet detail for each suggested component before generating code.",
            },
            {
                step: 3,
                tool: "get_component",
                stepperLabel: "VsInput detail",
                input: { name: "VsInput" },
                output_summary:
                    '{ name: "VsInput", props: [...], styleSet: {...}, events: [...], next_actions: [{tool:"get_css_tokens",...}] }',
                why: "Same as step 2 for VsInput.",
            },
            {
                step: 4,
                tool: "get_component",
                stepperLabel: "VsButton detail",
                input: { name: "VsButton" },
                output_summary:
                    '{ name: "VsButton", props: [...], styleSet: {...}, events: [...], next_actions: [{tool:"get_css_tokens",...}] }',
                why: "Same as step 2 for VsButton.",
            },
        ],
    },
    {
        id: "lookup-specific-component",
        title: "Looking up a specific component and its design tokens",
        user_prompt: "Tell me everything about VsDrawer.",
        outcome:
            "Returns full VsDrawer props, StyleSet, events, slots. Then shows CSS design tokens for customization. Also hints at the composable/directive cross-domain.",
        pipeline: [
            {
                step: 1,
                tool: "get_component",
                stepperLabel: "VsDrawer detail",
                input: { name: "VsDrawer" },
                output_summary:
                    '{ name: "VsDrawer", description: "...", props: [...], styleSet: {...}, events: [...], slots: [...], next_actions: [{tool:"get_css_tokens",...}] }',
                why: "User named a specific component. get_component is the direct lookup tool.",
            },
            {
                step: 2,
                tool: "get_css_tokens",
                stepperLabel: "CSS tokens: drawer",
                input: { filter: "drawer" },
                output_summary:
                    '{ tokens: [{name:"--vs-drawer-size",...},...], next_actions: [{tool:"get_vlossom_options",reason:"configure tokens globally"},{tool:"generate_style_set",reason:"use tokens in StyleSet"}] }',
                why: "get_component returned next_actions including get_css_tokens. Design tokens show which CSS variables are available for VsDrawer customization.",
            },
            {
                step: 3,
                tool: "get_component_relationships",
                stepperLabel: "VsDrawer relationships",
                input: { name: "VsDrawer" },
                output_summary:
                    '{ parent: null, children: ["VsDimmed", "VsInnerScroll"], next_actions: [{tool:"get_component",...}] }',
                why: "Optional lateral step — understanding composition helps generate more accurate usage code.",
            },
        ],
    },
];

export function registerGetUsageExamples(server: McpServer): void {
    server.tool(
        "get_usage_examples",
        "No prerequisite needed. " +
            "Call this when the user asks how to use vlossom-mcp, what it can do, or requests a demo of tool pipelines. " +
            "Returns annotated end-to-end pipeline walkthroughs showing exactly which tools run, " +
            "what inputs they receive, what they return, and why each step exists. " +
            "Then call clarify_intent with the clarify_intent_candidates from the response to ask which example to explore.",
        {},
        () => {
            const start = Date.now();
            const meta = recordStep("get_usage_examples", "Usage examples", Date.now() - start);

            return textResponse(
                {
                    description:
                        "🔗 vlossom-mcp works as a chain of single-responsibility tools. " +
                        "Each tool does one thing and emits next_actions to guide the LLM to the most relevant next step. " +
                        "The examples below show full input→output flows for common tasks.",
                    examples: EXAMPLES,
                    next_actions: [
                        { tool: "clarify_intent", reason: "pick a pipeline example to explore in more detail" },
                    ],
                    clarify_intent_candidates: EXAMPLES.map((e) => ({
                        label: e.title.length > 50 ? e.title.slice(0, 49) + "…" : e.title,
                        prompt: e.user_prompt,
                        pipeline: e.pipeline.map((s) => s.tool).join(" → "),
                    })),
                },
                meta,
            );
        },
    );
}
