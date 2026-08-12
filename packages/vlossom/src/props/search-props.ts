import type { PropType } from 'vue';
import type { SearchOptions } from '@/declaration';
import { objectUtil } from '@/utils';

export function getSearchProps<T extends SearchOptions = SearchOptions>() {
    return {
        search: {
            type: [Boolean, Object] as PropType<boolean | T>,
            default: false,
            validator: (value: boolean | T) => {
                if (typeof value === 'boolean') {
                    return true;
                }
                return !objectUtil.isEmpty(value);
            },
        },
    };
}
