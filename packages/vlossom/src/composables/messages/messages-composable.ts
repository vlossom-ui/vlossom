import { useOptionsStore } from '@/stores';
import type { VlossomMessage, MessageParams } from '@/declaration';

export function useMessages() {
    const { messages: optionMessages } = useOptionsStore();

    function formatMessage(template: VlossomMessage, params: MessageParams = {}): string {
        return typeof template === 'function' ? template(params) : template;
    }

    return { optionMessages, formatMessage };
}
