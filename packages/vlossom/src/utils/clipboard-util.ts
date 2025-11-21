export const clipboardUtil = {
    async copy(text: string): Promise<boolean> {
        try {
            if (!navigator.clipboard) {
                console.error('Clipboard API is not supported');
                return false;
            }
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            console.error('Failed to copy to clipboard:', error);
            return false;
        }
    },
};
