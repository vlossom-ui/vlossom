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
    /**
     * When true, the result set is ambiguous enough that Claude should call
     * clarify_intent before proceeding with further tool calls.
     */
    clarify?: boolean;
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
 *
 * @param clarify  When true, signals Claude to call clarify_intent before continuing.
 */
export function recordStep(
    tool: string,
    label: string,
    durationMs: number,
    clarify?: boolean,
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
        ...(clarify && { clarify: true }),
    };
}

/**
 * Wrap any data as an MCP text response.
 * When `meta` is provided it is appended as a `_meta` field on the payload.
 */
export function textResponse(data: unknown, meta?: McpResponseMeta) {
    const payload: Record<string, unknown> =
        data !== null && typeof data === "object" && !Array.isArray(data)
            ? { ...(data as Record<string, unknown>) }
            : { result: data };

    if (meta) {
        payload._meta = meta;
    }

    return {
        content: [{ type: "text" as const, text: JSON.stringify(payload) }],
    };
}
