import { computed, type ComputedRef, type Ref } from 'vue';
import type { OptionItem } from '@/declaration';

export function useGroupedItems(
    items: Ref<OptionItem[]>,
    groupBy: Ref<((item: any, index: number) => string | null) | null>,
    groupOrder: Ref<string[]>,
): {
    groupedItems: ComputedRef<{ name: string; items: OptionItem[] }[]>;
} {
    const groupedItems = computed(() => {
        const groupByFn = groupBy.value;
        if (!groupByFn) {
            return [
                {
                    name: '',
                    items: items.value,
                },
            ];
        }

        const groupMap = new Map<string, OptionItem[]>();
        const groupOrderInItems: string[] = [];

        items.value.forEach((item, index) => {
            const groupName: string = groupByFn(item.item, index) || '';
            if (!groupMap.has(groupName)) {
                groupMap.set(groupName, []);
            }
            groupMap.get(groupName)?.push(item);

            if (groupName !== '' && !groupOrderInItems.includes(groupName)) {
                groupOrderInItems.push(groupName);
            }
        });

        const allGroups: string[] = Array.from(groupMap.keys()).filter((g) => g !== '');
        let orderedGroups: string[] = [];

        if (!groupOrder.value || groupOrder.value.length === 0) {
            orderedGroups = groupOrderInItems;
        } else {
            const orderedSet = new Set<string>();
            for (const groupName of groupOrder.value) {
                if (!orderedSet.has(groupName) && allGroups.includes(groupName)) {
                    orderedSet.add(groupName);
                    orderedGroups.push(groupName);
                }
            }
            for (const groupName of groupOrderInItems) {
                if (!orderedSet.has(groupName)) {
                    orderedGroups.push(groupName);
                }
            }
        }

        const result: { name: string; items: OptionItem[] }[] = [];
        for (const groupName of orderedGroups) {
            const groupItems = groupMap.get(groupName);
            if (groupItems && groupItems.length > 0) {
                result.push({ name: groupName, items: groupItems });
            }
        }

        // ungrouped('')는 항상 마지막
        const ungroupedItems = groupMap.get('') || [];
        if (ungroupedItems.length > 0) {
            result.push({ name: '', items: ungroupedItems });
        }

        return result;
    });

    return { groupedItems };
}
