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
        // groupBy가 없으면 모든 아이템을 하나의 그룹으로 반환
        if (!groupByFn) {
            return [
                {
                    name: '',
                    items: items.value,
                },
            ];
        }

        // 그룹별로 아이템 분류 및 등장 순서 기록
        const groupMap = new Map<string, OptionItem[]>();
        // item에서 등장하는 그룹 순서
        const groupOrderInItems: string[] = [];

        items.value.forEach((item, index) => {
            const groupName: string = groupByFn(item.item, index) || '';
            if (!groupMap.has(groupName)) {
                groupMap.set(groupName, []);
            }
            groupMap.get(groupName)?.push(item);

            // 처음 등장하는 그룹이면 순서에 추가 (빈 스트링 제외)
            if (groupName !== '' && !groupOrderInItems.includes(groupName)) {
                groupOrderInItems.push(groupName);
            }
        });

        // 그룹 순서 결정
        const allGroups: string[] = Array.from(groupMap.keys()).filter((g) => g !== '');
        let orderedGroups: string[] = [];

        if (!groupOrder.value || groupOrder.value.length === 0) {
            orderedGroups = groupOrderInItems;
        } else {
            // groupOrder가 있으면 그 순서대로, 나머지는 순서대로
            const orderedSet = new Set<string>();
            for (const groupName of groupOrder.value) {
                if (!orderedSet.has(groupName) && allGroups.includes(groupName)) {
                    orderedSet.add(groupName);
                    orderedGroups.push(groupName);
                }
            }
            // 나머지 그룹들 추가 (item에서 등장하는 순서대로)
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

        // ungrouped는 제일 밑으로
        const ungroupedItems = groupMap.get('') || [];
        if (ungroupedItems.length > 0) {
            result.push({ name: '', items: ungroupedItems });
        }

        return result;
    });

    return { groupedItems };
}
