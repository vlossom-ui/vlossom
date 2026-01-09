import type { PropType } from 'vue';
import type { SearchProps } from '@/declaration';

export function getSearchProps() {
    return {
        search: {
            type: [Boolean, Object] as PropType<SearchProps>,
            default: false,
        },
    };
}
