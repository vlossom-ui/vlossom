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

// ---------------------------------------------------------------------------
// Session tracker — simple in-memory, single-process state
// Resets automatically after TIMEOUT ms of inactivity.
// ---------------------------------------------------------------------------

const SESSION_TIMEOUT_MS = 60_000;

interface SessionState {
    steps: StepInfo[];
    lastActivityMs: number;
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

function getSession(): StepInfo[] {
    const now = Date.now();
    if (now - session.lastActivityMs > SESSION_TIMEOUT_MS) {
        session = { steps: [], lastActivityMs: now };
    } else {
        session.lastActivityMs = now;
    }
    return session.steps;
}

/**
 * Start a fresh session. Call this at the beginning of any "initiating" tool
 * (suggest_components, search_components, list_components) so that each new
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
): McpResponseMeta {
    const steps = getSession();
    steps.push({ step: steps.length + 1, label, tool, durationMs });

    // Build "toolsUsed" with ×N multiplier for repeated calls
    const counts = new Map<string, number>();
    for (const s of steps) {
        counts.set(s.tool, (counts.get(s.tool) ?? 0) + 1);
    }
    const toolsUsed = [...counts.entries()].map(([name, n]) =>
        n > 1 ? `${name} ×${n}` : name,
    );

    const totalDurationMs = steps.reduce((sum, s) => sum + s.durationMs, 0);

    return {
        steps: [...steps],
        toolsUsed,
        totalDurationMs,
    };
}

/**
 * Pre-renders the stepper as a string.
 * Server generates a flat list; LLM enriches with tree structure and summaries
 * using conversation context (see H4 in INSTRUCTIONS).
 */
function renderStepper(meta: McpResponseMeta): string {
    const BAR = "─────────────────────────────────────────────────────────";
    const lines: string[] = [];

    lines.push(`vlossom-mcp ${BAR}`);

    for (const s of meta.steps) {
        const stepNum = String(s.step).padStart(2, " ");
        const tool    = s.tool.padEnd(22).slice(0, 22);
        const label   = s.label.length > 23
            ? s.label.slice(0, 22) + "…"
            : s.label.padEnd(23);
        lines.push(`✔ ${stepNum}. ${tool}  ${label}`);
    }

    lines.push(BAR);
    lines.push(meta.toolsUsed.join(" · "));

    return lines.join("\n");
}

/**
 * Wrap any data as an MCP text response.
 *
 * Content block order:
 *   1. JSON data payload (always) — LLM reads this for tool output
 *   2. Extra blocks (optional) — human-facing content the LLM outputs verbatim
 *      e.g. presentation_format from clarify_intent
 *   3. Stepper block (when steps >= 2 and stepper is enabled) — pipeline trace
 *
 * Separating stepper and human-facing content into their own blocks means
 * the LLM naturally includes them without needing explicit skill instructions.
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

    if (meta && stepperEnabled && meta.steps.length >= 2) {
        content.push({ type: "text" as const, text: renderStepper(meta) });
    }

    return { content };
}
