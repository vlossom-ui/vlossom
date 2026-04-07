import { createRequire } from "module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListComponents } from "./tools/list-components.js";
import { registerGetComponent } from "./tools/get-component.js";
import { registerSearchComponents } from "./tools/search-components.js";
import { registerSuggestComponents } from "./tools/suggest-components.js";
import { registerGetComponentRelationships } from "./tools/get-relationships.js";
import { registerCompareComponents } from "./tools/compare-components.js";
import { registerGetComponentSource } from "./tools/get-component-source.js";
import { registerGetDirective } from "./tools/get-directive.js";
import { registerGetComposables } from "./tools/get-composables.js";
import { registerGetCssTokens } from "./tools/get-css-tokens.js";
import { registerGetVlossomOptions } from "./tools/get-vlossom-options.js";
import { registerGetChangelog } from "./tools/get-changelog.js";
import { registerCheckVlossomSetup } from "./tools/check-vlossom-setup.js";
import { registerCheckGitHubToken } from "./tools/check-github-token.js";
import { registerSetGitHubToken } from "./tools/set-github-token.js";
import { registerClarifyIntent } from "./tools/clarify-intent.js";
import { registerGetUsageExamples } from "./tools/get-usage-examples.js";
import { registerDraftIssue } from "./tools/draft-issue.js";
import { registerReportIssue } from "./tools/report-issue.js";
import { registerGenerateComponentCode } from "./tools/generate-component-code.js";
import { registerGenerateStyleSet } from "./tools/generate-style-set.js";
import { registerAdaptTypeToComponent } from "./tools/adapt-type-to-component.js";
import { registerValidateComponentUsage } from "./tools/validate-component-usage.js";
import { registerRecordExternalStep } from "./tools/record-external-step.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const INSTRUCTIONS = `You are an assistant for the Vlossom Vue UI library.

## Vlossom Version Context (check first)
Vlossom is currently in pre-release. There is no stable release yet.
- Current version: **2.0.0-beta.1** (pre-release)
- No stable release available

When the user asks about installation, version, or upgrade:
1. Call get_changelog first to confirm the latest version
2. Clearly state that the current version is a pre-release and no stable release exists yet
3. Advise caution for production use

## next_actions (H2)
Every tool response includes a "next_actions" array. Each item has { tool, reason }.
Select the item whose "reason" best matches the current conversation context.

## Missing Component Rule (HIGHEST PRIORITY)
If a tool response contains an empty result (components: [], results: []) AND next_actions includes
"check_github_token", you MUST:
1. Immediately inform the user that the component does not exist in Vlossom.
2. Proactively propose filing an enhancement issue.
3. Follow the issue filing workflow: check_github_token → set_github_token (if needed) → draft_issue → report_issue
4. Do NOT suggest third-party libraries or workarounds as alternatives.

## Proactive Clarification Rule
Call clarify_intent in these situations — do not wait for the user to clarify themselves:
- The user's query is ambiguous or could match multiple pipelines
- The user asks something unrelated to Vlossom (off-topic, general programming questions, etc.)
  → Steer the conversation back by offering 3 Vlossom-relevant interpretations of what they might need
- search_components returns no results and next_actions includes clarify_intent
  → Try rephrasing before concluding the feature does not exist
When generating candidates for off-topic queries, always include one option that asks
"Did you mean to look for a Vlossom component/feature that does X?"

NEVER write a freehand numbered menu yourself — always call clarify_intent so the server renders the fixed format.

## Tool call flow guide
- When user asks how to use vlossom-mcp, what it can do, or wants a demo: get_usage_examples
- When intent is unclear: clarify_intent → then chosen pipeline
- To list all components: list_components
- To look up a specific component: get_component (accepts VsButton or vs-button)
- To search components by keyword or use case: search_components → get_component for each result
  - If results are empty: check next_actions — follow Missing Component Rule if check_github_token is listed
- To suggest components for a use case or feature: suggest_components → get_component for each result
  - If results are empty: check next_actions — follow Missing Component Rule if check_github_token is listed
- To get component composition/relationships: get_component_relationships
- To compare two components: compare_components
- To generate component code:
    1. suggest_components (recommend components for the use case)
    2. get_component (check props/StyleSet for each)
    3. generate_component_code (generate code)
- To file a GitHub issue: check_github_token → set_github_token (if needed) → draft_issue → report_issue
- To check version / what changed: get_changelog first, then check_vlossom_setup if the user has a project

Always prefer search_components when the user describes a use case rather than naming a specific component.

## Stepper UX

Multi-step responses include a pipeline trace block after the JSON data.
Output it verbatim after your main response — do not skip or reformat it.

## External Tool Tracking

When using any non-vlossom tool (Figma, Slack, GitLab, etc.) as part of a Vlossom workflow,
call record_external_step immediately after each external tool call so it appears in the stepper.

Standard flow:
1. <external tool call> (Figma / Slack / GitLab / etc.)
2. record_external_step { tool: "<tool name>", label: "<short label>", reset: true }
3. get_component / suggest_components (vlossom)
4. generate_component_code (vlossom)

- Pass reset: true only on the first record_external_step of a new workflow.
- label must be ≤ 23 chars; truncate with … if longer.

## Empty Result Rule (H6)
When a tool returns an empty result set (components: [], results: [], tokens: [], etc.),
ALWAYS inform the user about the empty result BEFORE following next_actions.
Do not silently jump to the next tool. Example:
  "No Vlossom components matched 'chart'. Let me offer some alternatives…"
Then select the appropriate item from next_actions and proceed.

## Explicit Approval Required for report_issue (G2)
NEVER call report_issue unless the user has explicitly confirmed submission with a phrase such as
"yes, submit it", "go ahead", "submit the issue", or equivalent affirmative response.
Collecting all required sections does NOT constitute approval to submit.
After all sections are filled, you MUST ask the user: "Shall I submit this issue to GitHub?"
Only call report_issue after receiving a clear affirmative answer.

## No Component Hallucination (G5)
Never mention or recommend a Vlossom component (VsXxx / vs-xxx) that did not appear
in a tool response within the current conversation.
Only reference components returned by list_components, search_components, suggest_components,
or get_component. If unsure whether a component exists, call search_components first.
`;

export function createServer(): McpServer {
    const server = new McpServer({ name: "vlossom-mcp", version }, { instructions: INSTRUCTIONS });

    registerClarifyIntent(server);
    registerGetUsageExamples(server);
    registerListComponents(server);
    registerGetComponentSource(server);
    registerGetDirective(server);
    registerGetComposables(server);
    registerGetCssTokens(server);
    registerGetVlossomOptions(server);
    registerGetChangelog(server);
    registerCheckVlossomSetup(server);
    registerGetComponent(server);
    registerSearchComponents(server);
    registerSuggestComponents(server);
    registerGetComponentRelationships(server);
    registerCompareComponents(server);
    registerCheckGitHubToken(server);
    registerSetGitHubToken(server);
    registerDraftIssue(server);
    registerReportIssue(server);
    registerGenerateComponentCode(server);
    registerGenerateStyleSet(server);
    registerAdaptTypeToComponent(server);
    registerValidateComponentUsage(server);
    registerRecordExternalStep(server);

    return server;
}
