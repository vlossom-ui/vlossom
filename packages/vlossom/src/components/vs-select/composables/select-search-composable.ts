import { computed, type Ref } from 'vue';

export function useSelectSearch(
    search: Ref<boolean | { useRegex?: boolean; useCaseSensitive?: boolean; placeholder?: string }>,
) {
    const isUsingSearch = computed(() => {
        if (typeof search.value === 'boolean') {
            return search.value;
        }

        return (
            search.value.useRegex !== undefined ||
            search.value.useCaseSensitive !== undefined ||
            search.value.placeholder !== undefined
        );
    });

    const searchProps = computed(() => {
        if (typeof search.value === 'boolean') {
            return {
                useRegex: true,
                useCaseSensitive: true,
                placeholder: '',
            };
        }
        return {
            useRegex: search.value.useRegex ?? true,
            useCaseSensitive: search.value.useCaseSensitive ?? true,
            placeholder: search.value.placeholder ?? '',
        };
    });

    return {
        isUsingSearch,
        searchProps,
    };
}
