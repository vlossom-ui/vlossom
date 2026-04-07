#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { createServer } from "./server.js";
import { setStepperEnabled, setSessionTimeoutMs } from "./utils/mcp-response.js";

async function main(): Promise<void> {
    // Stepper UX — on by default, disable via VLOSSOM_MCP_STEPPER=off
    // In .mcp.json / claude_desktop_config.json:
    //   "env": { "VLOSSOM_MCP_STEPPER": "off" }
    const stepperEnv = process.env["VLOSSOM_MCP_STEPPER"];
    setStepperEnabled(stepperEnv !== "off");

    // Session timeout — default 30 min, override via VLOSSOM_MCP_SESSION_TIMEOUT (minutes)
    // Set to 0 to disable timeout entirely (rely only on explicit resetSession() calls)
    // In .mcp.json: "env": { "VLOSSOM_MCP_SESSION_TIMEOUT": "60" }
    const timeoutEnv = process.env["VLOSSOM_MCP_SESSION_TIMEOUT"];
    if (timeoutEnv !== undefined) {
        const minutes = Number(timeoutEnv);
        setSessionTimeoutMs(minutes === 0 ? Infinity : minutes * 60_000);
    }

    const server = createServer();
    const transport = new StdioServerTransport();
    await server.connect(transport);
}

main().catch((error: unknown) => {
    process.stderr.write(`Server failed to start: ${String(error)}\n`);
    process.exit(1);
});
