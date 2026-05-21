/**
 * H2 Scaffold: next_actions linked-list item.
 * Every tool response must include a `next_actions` array.
 * Each item describes a possible follow-up tool and the reason to choose it.
 */
export interface NextActionItem {
    /** Tool name to call next (matches registered server.tool name) */
    tool: string;
    /** Why to choose this tool — written for the LLM to match against conversation context */
    reason: string;
}
