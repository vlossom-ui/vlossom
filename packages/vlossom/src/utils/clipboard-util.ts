import { logUtil } from './log-util';

export const clipboardUtil = {
    async copy(text: string): Promise<boolean> {
        try {
            if (!navigator.clipboard) {
                logUtil.error('clipboard-util', 'Clipboard API is not supported');
                return false;
            }
            await navigator.clipboard.writeText(text);
            return true;
        } catch (error) {
            logUtil.error('clipboard-util', `Failed to copy to clipboard: ${error}`);
            return false;
        }
    },
};
