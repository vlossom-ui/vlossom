import type { Ref } from 'vue';
import { objectUtil, stringUtil } from '@/utils';
import type { VsTable2Item, VsTable2ItemKey } from './../types';

export function useTableItemKeyComposable(itemKey: Ref<VsTable2ItemKey | undefined>) {
    // itemKey가 없으면 아이템 객체 동일성에 key를 매달아, 정렬/검색으로 순서가 바뀌어도 같은 행으로 유지되게 한다
    const autoKeys = new WeakMap<object, string>();

    function getItemKey(item: VsTable2Item): string | number {
        const key = itemKey.value;
        if (typeof key === 'function') {
            const value = key(item);
            if (isRowKey(value)) {
                return value;
            }
        }
        if (typeof key === 'string' && key) {
            const value: unknown = objectUtil.get(item, key);
            if (isRowKey(value)) {
                return value;
            }
        }

        let autoKey = autoKeys.get(item);
        if (autoKey === undefined) {
            autoKey = stringUtil.createID();
            autoKeys.set(item, autoKey);
        }
        return autoKey;
    }

    return { getItemKey };
}

function isRowKey(value: unknown): value is string | number {
    return typeof value === 'string' || typeof value === 'number';
}
