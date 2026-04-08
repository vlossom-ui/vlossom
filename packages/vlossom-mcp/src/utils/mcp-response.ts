/** Individual tool call step info included in every MCP response. */
export interface StepInfo {
    /** Sequential step number within the current session (1-based). */
    step: number;
    /** Human-readable label, e.g. "VsButton detail" or "Search: login form". */
    label: string;
    /** MCP tool name, e.g. "get_component". */
    tool: string;
    /** Execution duration in milliseconds. */
    durationMs: number;
    /** Brief result description (≤ 60 chars), e.g. "50 components" or "props, styleSet, events". */
    summary?: string;
    /** Parent step number for tree structure. undefined = root node. */
    parentStep?: number;
}

/** Response metadata returned in every tool's `_meta` field. */
export interface McpResponseMeta {
    /** All tool call steps accumulated in the current session. */
    steps: StepInfo[];
    /** Deduplicated list of tool names used so far (with ×N counts). */
    toolsUsed: string[];
    /** Total elapsed time across all steps in the session (ms). */
    totalDurationMs: number;
}

/** Optional parameters for recordStep. */
export interface RecordStepOptions {
    /** Brief result description (≤ 60 chars). */
    summary?: string;
    /** Explicit parent step number. Overrides auto-detection. */
    parentStep?: number;
}

// ---------------------------------------------------------------------------
// Session tracker — simple in-memory, single-process state
// Resets automatically after TIMEOUT ms of inactivity.
// ---------------------------------------------------------------------------

let SESSION_TIMEOUT_MS = 30 * 60_000; // 30 minutes default

export function setSessionTimeoutMs(ms: number): void {
    SESSION_TIMEOUT_MS = ms;
}

interface SessionState {
    steps: StepInfo[];
    lastActivityMs: number;
    /** Step number of the most recent initiator (root) tool. */
    initiatorStep?: number;
}

let session: SessionState = { steps: [], lastActivityMs: Date.now() };

// ---------------------------------------------------------------------------
// Stepper on/off — controlled via VLOSSOM_MCP_STEPPER env var
// ---------------------------------------------------------------------------

let stepperEnabled = true;

export function setStepperEnabled(enabled: boolean): void {
    stepperEnabled = enabled;
}

export function isStepperEnabled(): boolean {
    return stepperEnabled;
}

// ---------------------------------------------------------------------------
// Tools that start a new pipeline — their step becomes the tree root.
// ---------------------------------------------------------------------------

const INITIATING_TOOLS = new Set([
    "search_components",
    "list_components",
    "clarify_intent",
    "check_github_token",
    "get_usage_examples",
]);

// ---------------------------------------------------------------------------

function getSession(): SessionState {
    const now = Date.now();
    if (now - session.lastActivityMs > SESSION_TIMEOUT_MS) {
        session = { steps: [], lastActivityMs: now };
    } else {
        session.lastActivityMs = now;
    }
    return session;
}

/**
 * Start a fresh session. Call this at the beginning of any "initiating" tool
 * (search_components, list_components) so that each new
 * workflow produces a clean _meta rather than accumulating across invocations.
 */
export function resetSession(): void {
    session = { steps: [], lastActivityMs: Date.now() };
}

/**
 * Record a completed tool call and return accumulated session metadata.
 * Call this at the END of each tool handler, after execution finishes.
 */
export function recordStep(
    tool: string,
    label: string,
    durationMs: number,
    options?: RecordStepOptions,
): McpResponseMeta {
    const sess = getSession();
    const steps = sess.steps;

    // Determine parent step
    let parentStep = options?.parentStep;
    if (parentStep === undefined) {
        if (INITIATING_TOOLS.has(tool)) {
            // Initiating tools are root nodes — track as current initiator
            parentStep = undefined;
        } else if (sess.initiatorStep !== undefined) {
            // Auto-attach to the most recent initiator
            parentStep = sess.initiatorStep;
        }
    }

    const stepNum = steps.length + 1;

    // Truncate summary to 60 chars
    let summary = options?.summary;
    if (summary && summary.length > 60) {
        summary = summary.slice(0, 59) + "\u2026";
    }

    steps.push({ step: stepNum, label, tool, durationMs, summary, parentStep });

    // Update initiator tracking
    if (INITIATING_TOOLS.has(tool)) {
        sess.initiatorStep = stepNum;
    }

    // Build "toolsUsed" with ×N multiplier for repeated calls
    const counts = new Map<string, number>();
    for (const s of steps) {
        counts.set(s.tool, (counts.get(s.tool) ?? 0) + 1);
    }
    const toolsUsed = [...counts.entries()].map(([name, n]) =>
        n > 1 ? `${name} \u00d7${n}` : name,
    );

    const totalDurationMs = steps.reduce((sum, s) => sum + s.durationMs, 0);

    return {
        steps: [...steps],
        toolsUsed,
        totalDurationMs,
    };
}

// ---------------------------------------------------------------------------
// Stepper rendering — produces complete tree-enhanced format (Layer 1 + 2)
// ---------------------------------------------------------------------------

const BAR = "\u2500".repeat(57);

function formatStepLine(s: StepInfo, indent: string = ""): string {
    const stepNum = String(s.step).padStart(2, " ");
    const tool = s.tool.padEnd(22).slice(0, 22);
    const label = s.label.length > 23
        ? s.label.slice(0, 22) + "\u2026"
        : s.label.padEnd(23);
    return `${indent}\u2714 ${stepNum}. ${tool}  ${label}`;
}

function formatSummaryLine(summary: string, indent: string): string {
    return `${indent}   \u2192 ${summary}`;
}

/**
 * Build a Resolution line from root steps and their children.
 */
function buildResolution(meta: McpResponseMeta): string {
    const roots = meta.steps.filter(s => !s.parentStep);
    const parts: string[] = [];

    for (const root of roots) {
        parts.push(root.summary || root.label);

        const children = meta.steps.filter(s => s.parentStep === root.step);
        if (children.length > 0) {
            const childLabels = children
                .map(c => c.summary || c.label)
                .slice(0, 5);
            parts.push(childLabels.join(", "));
        }
    }

    return parts.join(" \u2192 ");
}

/**
 * Pre-renders the complete stepper with tree structure, summaries, and resolution.
 * Server generates the full format — LLM outputs verbatim.
 */
function renderStepper(meta: McpResponseMeta): string {
    const lines: string[] = [];
    lines.push(`vlossom-mcp ${BAR}`);

    const roots = meta.steps.filter(s => !s.parentStep);

    for (let ri = 0; ri < roots.length; ri++) {
        const root = roots[ri];

        // Render root step
        lines.push(formatStepLine(root));
        if (root.summary) {
            lines.push(formatSummaryLine(root.summary, ""));
        }

        // Render children
        const children = meta.steps.filter(s => s.parentStep === root.step);
        if (children.length > 0) {
            lines.push("");
            for (let ci = 0; ci < children.length; ci++) {
                const child = children[ci];
                const isLast = ci === children.length - 1;
                const branch = isLast ? "\u2514\u2500" : "\u251c\u2500";
                const cont   = isLast ? "  " : "\u2502 ";

                lines.push(`   ${branch} ${formatStepLine(child)}`);
                if (child.summary) {
                    lines.push(`   ${cont}    \u2192 ${child.summary}`);
                }
                if (!isLast) {
                    lines.push(`   \u2502`);
                }
            }
        }

        // Blank line between root groups
        if (ri < roots.length - 1) {
            lines.push("");
        }
    }

    lines.push(BAR);

    // Resolution line for multi-step pipelines
    if (meta.steps.length >= 2) {
        lines.push(`Resolution: ${buildResolution(meta)}`);
    }

    lines.push(meta.toolsUsed.join(" \u00b7 "));

    return lines.join("\n");
}

// ---------------------------------------------------------------------------
// Verbatim instruction prefix for external LLM compliance
// ---------------------------------------------------------------------------

const VERBATIM_PREFIX =
    "[Output the block below verbatim after your main response \u2014 do not modify, summarize, or skip it.]\n\n";

/**
 * Wrap any data as an MCP text response.
 *
 * Content block order:
 *   1. JSON data payload (always) — LLM reads this for tool output
 *   2. Extra blocks (optional) — human-facing content the LLM outputs verbatim
 *      e.g. presentation_format from clarify_intent
 *   3. Stepper block (when stepper is enabled) — pipeline trace
 */
export function textResponse(
    data: unknown,
    meta?: McpResponseMeta,
    extra?: string[],
) {
    const payload: Record<string, unknown> =
        data !== null && typeof data === "object" && !Array.isArray(data)
            ? { ...(data as Record<string, unknown>) }
            : { result: data };

    if (meta) {
        payload._meta = { ...meta };
    }

    const content: Array<{ type: "text"; text: string }> = [
        { type: "text" as const, text: JSON.stringify(payload) },
    ];

    if (extra) {
        for (const text of extra) {
            content.push({ type: "text" as const, text });
        }
    }

    // Stepper: threshold >= 1 (always show when enabled)
    if (meta && stepperEnabled && meta.steps.length >= 1) {
        content.push({
            type: "text" as const,
            text: VERBATIM_PREFIX + renderStepper(meta),
        });
    }

    return { content };
}
