import type { Ref } from 'vue';
import { useMessages } from '@/composables';

export function useVsCheckboxSetRules(required: Ref<boolean>, max: Ref<number | string>, min: Ref<number | string>) {
    const { messages, formatMessage } = useMessages();
    function requiredCheck(v: any[]) {
        return required.value && v && v.length === 0 ? messages.value.VS_VALIDATION_REQUIRED : '';
    }

    function maxCheck(v: any[]) {
        const limit = Number(max.value);
        return v && v.length > limit ? formatMessage(messages.value.VS_VALIDATION_MAX_ITEMS, { value: max.value }) : '';
    }

    function minCheck(v: any[]) {
        const limit = Number(min.value);
        return v && v.length < limit ? formatMessage(messages.value.VS_VALIDATION_MIN_ITEMS, { value: min.value }) : '';
    }

    return {
        requiredCheck,
        maxCheck,
        minCheck,
    };
}
