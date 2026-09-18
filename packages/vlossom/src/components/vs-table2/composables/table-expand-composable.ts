import { computed, reactive, type Ref } from 'vue';
import { functionUtil } from '@/utils';
import type { VsTable2Item } from './../types';

export function useTableExpandComposable(
    rawExpandable: Ref<boolean | ((item: VsTable2Item, index?: number, items?: VsTable2Item[]) => boolean)>,
    items: Ref<VsTable2Item[]>,
    getItemKey: (item: VsTable2Item) => string | number,
) {
    const isExpandable = computed(() =>
        functionUtil.toCallable<[VsTable2Item, number?, VsTable2Item[]?], boolean>(rawExpandable.value),
    );

    const expandedKeys = reactive(new Set<string | number>());

    // expandable이 boolean이면 아이템을 순회하지 않는다 (대량 items에서는 갱신마다 전체 스캔이 된다)
    const anyExpandable = computed<boolean>(() => {
        if (typeof rawExpandable.value === 'boolean') {
            return rawExpandable.value && items.value.length > 0;
        }
        return items.value.some(isExpandable.value);
    });

    function isExpanded(item: VsTable2Item): boolean {
        return expandedKeys.has(getItemKey(item));
    }

    function expandItem(item: VsTable2Item, index: number, expanded: boolean): boolean {
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
