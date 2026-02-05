import type { PropType } from 'vue';
import type { SearchProps } from '@/declaration';
import { objectUtil } from '@/utils';

export function getSearchProps() {
    return {
        search: {
            type: [Boolean, Object] as PropType<SearchProps>,
            default: false,
            validator: (value: SearchProps) => {
                if (typeof value === 'boolean') {
                    return true;
                }
                return !objectUtil.isEmpty(value);
            },
        },
    };
}
