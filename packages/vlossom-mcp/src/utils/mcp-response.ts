export function textResponse(data: unknown) {
    return {
        content: [{ type: "text" as const, text: JSON.stringify(data) }],
    };
}
