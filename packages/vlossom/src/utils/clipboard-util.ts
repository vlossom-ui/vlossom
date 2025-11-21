export const clipboardUtil = {
    copy(text: string): void {
        navigator.clipboard.writeText(text);
    },
};

