/** Individual tool call step info included in every MCP response. */
export interface StepInfo {
    /** Sequential step number within the current session (1-based). */
    step: number;
    /** Human-readable label, e.g. "VsButton detail" or "Search: login form". */
    label: string;
    /** MCP tool name, e.g. "get_vlossom_reference". */
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
// Tools that start a new pipeline — their step becomes the tree root.
// ---------------------------------------------------------------------------

const INITIATING_TOOLS = new Set(['search_vlossom', 'scaffold_vlossom_code']);

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
 * (search_vlossom, scaffold_vlossom_code) so that each new
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
        summary = summary.slice(0, 59) + '\u2026';
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
    const toolsUsed = [...counts.entries()].map(([name, n]) => (n > 1 ? `${name} \u00d7${n}` : name));

    const totalDurationMs = steps.reduce((sum, s) => sum + s.durationMs, 0);

    return {
        steps: [...steps],
        toolsUsed,
        totalDurationMs,
    };
}

/**
 * Wrap any data as an MCP text response.
 *
 * Content block order:
 *   1. JSON data payload (always) — LLM reads this for tool output
 *   2. Extra blocks (optional) — human-facing content the LLM outputs verbatim
 *      e.g. prompt-facing guidance blocks
 *   3. Stepper block (when stepper is enabled) — pipeline trace
 */
export function textResponse(data: unknown, meta?: McpResponseMeta, extra?: string[]) {
    const payload: Record<string, unknown> =
        data !== null && typeof data === 'object' && !Array.isArray(data)
            ? { ...(data as Record<string, unknown>) }
            : { result: data };

    if (meta) {
        payload._meta = { ...meta };
    }

    const content: Array<{ type: 'text'; text: string }> = [{ type: 'text' as const, text: JSON.stringify(payload) }];

    if (extra) {
        for (const text of extra) {
            content.push({ type: 'text' as const, text });
        }
    }

    return { content };
}

/** Wrap data as both MCP structuredContent and legacy JSON text content. */
export function structuredResponse<TData>(data: TData, meta?: McpResponseMeta, extra?: string[]) {
    const response = textResponse(data, meta, extra);
    return {
        ...response,
        structuredContent: data,
        ...(meta ? { _meta: { ...meta } } : {}),
    };
}
