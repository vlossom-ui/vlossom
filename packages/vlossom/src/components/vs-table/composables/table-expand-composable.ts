import { computed, reactive, type Ref } from 'vue';
import { functionUtil } from '@/utils';
import type { VsTableItem } from './../types';

export function useTableExpandComposable(
    rawExpandable: Ref<boolean | ((item: VsTableItem, index?: number, items?: VsTableItem[]) => boolean)>,
    items: Ref<VsTableItem[]>,
    getItemKey: (item: VsTableItem) => string | number,
) {
    const isExpandable = computed(() =>
        functionUtil.toCallable<[VsTableItem, number?, VsTableItem[]?], boolean>(rawExpandable.value),
    );

    const expandedKeys = reactive(new Set<string | number>());

    // expandable이 boolean이면 아이템을 순회하지 않는다 (대량 items에서는 갱신마다 전체 스캔이 된다)
    const anyExpandable = computed<boolean>(() => {
        if (typeof rawExpandable.value === 'boolean') {
            return rawExpandable.value && items.value.length > 0;
        }
        return items.value.some(isExpandable.value);
    });

    function isExpanded(item: VsTableItem): boolean {
        return expandedKeys.has(getItemKey(item));
    }

    function expandItem(item: VsTableItem, index: number, expanded: boolean): boolean {
        if (!item || !isExpandable.value(item, index, items.value)) {
            return false;
        }

        const key = getItemKey(item);
        if (expanded) {
            expandedKeys.add(key);
        } else {
            expandedKeys.delete(key);
        }
        return true;
    }

    return { isExpandable, anyExpandable, isExpanded, expandItem };
}
