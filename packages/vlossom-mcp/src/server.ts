import { createRequire } from "module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListComponents } from "./tools/list-components.js";
import { registerGetComponent } from "./tools/get-component.js";
import { registerSearchComponents } from "./tools/search-components.js";
import { registerCheckGitHubToken } from "./tools/check-github-token.js";
import { registerSetGitHubToken } from "./tools/set-github-token.js";
import { registerDraftIssue } from "./tools/draft-issue.js";
import { registerReportIssue } from "./tools/report-issue.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

const INSTRUCTIONS = `You are an assistant for the Vlossom Vue UI library.

Tool call flow guide:
- To list all components: list_components
- To look up a specific component: get_component (accepts VsButton or vs-button)
- To search components by keyword or use case: search_components → get_component for each result
- To generate component code:
    1. search_components (find relevant components)
    2. get_component (check props/StyleSet for each)
    3. generate_component_code (generate code)
- To file a GitHub issue: check_github_token → set_github_token (if needed) → draft_issue → report_issue

Always prefer search_components when the user describes a use case rather than naming a specific component.
`;

export function createServer(): McpServer {
    const server = new McpServer({ name: "vlossom-mcp", version }, { instructions: INSTRUCTIONS });

    registerListComponents(server);
    registerGetComponent(server);
    registerSearchComponents(server);
    registerCheckGitHubToken(server);
    registerSetGitHubToken(server);
    registerDraftIssue(server);
    registerReportIssue(server);

    return server;
}
