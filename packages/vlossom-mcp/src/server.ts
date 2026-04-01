import { createRequire } from "module";
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { registerListComponents } from "./tools/list-components.js";
import { registerCheckGitHubToken } from "./tools/check-github-token.js";
import { registerDraftIssue } from "./tools/draft-issue.js";
import { registerReportIssue } from "./tools/report-issue.js";

const require = createRequire(import.meta.url);
const { version } = require("../package.json") as { version: string };

export function createServer(): McpServer {
    const server = new McpServer({ name: "vlossom-mcp", version });

    registerListComponents(server);
    registerCheckGitHubToken(server);
    registerDraftIssue(server);
    registerReportIssue(server);

    return server;
}
