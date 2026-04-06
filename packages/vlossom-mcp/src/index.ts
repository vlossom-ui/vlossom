#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { setStepperEnabled } from "./utils/mcp-response.js";

async function main(): Promise<void> {
    // Stepper UX — on by default, disable via VLOSSOM_MCP_STEPPER=off
    // In .mcp.json / claude_desktop_config.json:
    //   "env": { "VLOSSOM_MCP_STEPPER": "off" }
    const stepperEnv = process.env["VLOSSOM_MCP_STEPPER"];
    setStepperEnabled(stepperEnv !== "off");

    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error: unknown) => {
    process.stderr.write(`Server failed to start: ${String(error)}\n`);
    process.exit(1);
});
