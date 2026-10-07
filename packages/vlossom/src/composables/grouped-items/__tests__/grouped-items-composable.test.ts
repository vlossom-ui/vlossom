import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';
import type { OptionItem } from '@/declaration';
import { useOptionList } from '@/composables/option-list/option-list-composable';
import { useGroupedItems } from './../grouped-items-composable';

function createOptionItems(rawItems: any[]): OptionItem[] {
    const { computedOptions } = useOptionList(ref(rawItems), ref('name'), ref('id'), ref(false));
    return computedOptions.value;
}

function getGroupedItems({
    items,
    groupBy = null,
    groupOrder = [],
}: {
    items: OptionItem[];
    groupBy?: ((item: any, index: number) => string | null) | null;
    groupOrder?: string[];
}) {
    return useGroupedItems(ref(items), ref(groupBy), ref(groupOrder)).groupedItems.value;
}

describe('grouped-items-composable', () => {
    let defaultItems: OptionItem[];

    beforeEach(() => {
        const rawItems = [
            { id: 1, name: '아이템 1', category: 'A' },
            { id: 2, name: '아이템 2', category: 'A' },
            { id: 3, name: '아이템 3', category: 'B' },
            { id: 4, name: '아이템 4', category: 'B' },
            { id: 5, name: '아이템 5', category: 'C' },
        ];
        defaultItems = createOptionItems(rawItems);
    });

    describe('groupedItems', () => {
        it('groupBy가 없으면 모든 아이템을 하나의 그룹으로 반환해야 한다', () => {
            // given, when
            const groupedItems = getGroupedItems({
                items: defaultItems,
            });

            // then
            expect(groupedItems).toHaveLength(1);
            expect(groupedItems[0].name).toBe('');
            expect(groupedItems[0].items).toHaveLength(5);
        });

        it('groupBy가 있으면 그룹별로 아이템이 분류되어야 한다', () => {
            // given, when
            const groupedItems = getGroupedItems({
                items: defaultItems,
                groupBy: (item: any) => item.category,
            });

            // then
            expect(groupedItems).toHaveLength(3);
            expect(groupedItems[0].name).toBe('A');
            expect(groupedItems[0].items).toHaveLength(2);
            expect(groupedItems[1].name).toBe('B');
            expect(groupedItems[1].items).toHaveLength(2);
            expect(groupedItems[2].name).toBe('C');
            expect(groupedItems[2].items).toHaveLength(1);
        });

        it('groupBy가 null을 반환하면 ungrouped 그룹에 포함되어야 한다', () => {
            // given
            const rawItemsWithNull = [
                { id: 1, name: '아이템 1', category: 'A' },
                { id: 2, name: '아이템 2', category: null },
                { id: 3, name: '아이템 3', category: 'B' },
            ];
            const itemsWithNull = createOptionItems(rawItemsWithNull);

            // when
            const groupedItems = getGroupedItems({
                items: itemsWithNull,
                groupBy: (item: any) => item.category,
            });

            // then
            expect(groupedItems).toHaveLength(3);
            // ungrouped는 제일 밑에 있어야 함
            expect(groupedItems[2].name).toBe('');
            expect(groupedItems[2].items).toHaveLength(1);
            expect(groupedItems[2].items[0].item.id).toBe(2);
        });

        it('groupOrder가 있으면 그룹 순서가 지정된 순서대로 정렬되어야 한다', () => {
            // given, when
            const groupedItems = getGroupedItems({
                items: defaultItems,
                groupBy: (item: any) => item.category,
                groupOrder: ['C', 'A', 'B'],
            });

            // then
            expect(groupedItems).toHaveLength(3);
            expect(groupedItems[0].name).toBe('C');
            expect(groupedItems[1].name).toBe('A');
            expect(groupedItems[2].name).toBe('B');
        });

        it('groupOrder에 없는 그룹은 등장 순서대로 뒤에 추가되어야 한다', () => {
            // given
            const rawItems = [
                { id: 1, name: '아이템 1', category: 'A' },
                { id: 2, name: '아이템 2', category: 'B' },
                { id: 3, name: '아이템 3', category: 'C' },
                { id: 4, name: '아이템 4', category: 'D' },
            ];
            const items = createOptionItems(rawItems);

            // when
            const groupedItems = getGroupedItems({
                items,
                groupBy: (item: any) => item.category,
                groupOrder: ['C', 'A'],
            });

            // then
            expect(groupedItems).toHaveLength(4);
            expect(groupedItems[0].name).toBe('C');
            expect(groupedItems[1].name).toBe('A');
            expect(groupedItems[2].name).toBe('B'); // 등장 순서대로
            expect(groupedItems[3].name).toBe('D'); // 등장 순서대로
        });

        it('groupOrder에 중복된 그룹이 있어도 그룹은 한 번만 나와야 한다', () => {
            // given
            const rawItems = [
                { id: 1, name: '아이템 1', category: 'A' },
                { id: 2, name: '아이템 2', category: 'B' },
            ];
            const items = createOptionItems(rawItems);

            // when
            const groupedItems = getGroupedItems({
                items,
                groupBy: (item: any) => item.category,
                groupOrder: ['A', 'A', 'B'],
            });

            // then
            expect(groupedItems).toHaveLength(2);
            expect(groupedItems.map((group) => group.name)).toEqual(['A', 'B']);
        });

        it('ungrouped 아이템은 항상 제일 밑에 위치해야 한다', () => {
            // given
            const rawItems = [
                { id: 1, name: '아이템 1', category: 'A' },
                { id: 2, name: '아이템 2', category: null },
                { id: 3, name: '아이템 3', category: 'B' },
                { id: 4, name: '아이템 4', category: null },
            ];
            const items = createOptionItems(rawItems);

            // when
            const groupedItems = getGroupedItems({
                items,
                groupBy: (item: any) => item.category,
                groupOrder: ['B', 'A'],
            });

            // then
            expect(groupedItems).toHaveLength(3);
            expect(groupedItems[0].name).toBe('B');
            expect(groupedItems[1].name).toBe('A');
            expect(groupedItems[2].name).toBe(''); // ungrouped는 제일 밑
            expect(groupedItems[2].items).toHaveLength(2);
        });

        it('OptionItem의 disabled 속성이 올바르게 반영되어야 한다', () => {
            // given
            const itemsWithDisabled = defaultItems.map((item, index) => ({
                ...item,
                disabled: item.item.id === 2 || index === 3,
            }));

            // when
            const groupedItems = getGroupedItems({
                items: itemsWithDisabled,
            });

            // then
            expect(groupedItems[0].items[0].disabled).toBe(false); // id: 1
            expect(groupedItems[0].items[1].disabled).toBe(true); // id: 2
            expect(groupedItems[0].items[2].disabled).toBe(false); // id: 3
            expect(groupedItems[0].items[3].disabled).toBe(true); // index: 3
            expect(groupedItems[0].items[4].disabled).toBe(false); // id: 5
        });
    });

    describe('reactivity', () => {
        it('items, groupBy, groupOrder가 바뀌면 groupedItems가 다시 계산되어야 한다', () => {
            // given
            const items = ref(defaultItems);
            const groupBy = ref<((item: any) => string | null) | null>(null);
            const groupOrder = ref<string[]>([]);
            const { groupedItems } = useGroupedItems(items, groupBy, groupOrder);
            expect(groupedItems.value).toHaveLength(1);

            // when
            groupBy.value = (item: any) => item.category;
            groupOrder.value = ['C'];
            items.value = defaultItems.slice(2);

            // then
            expect(groupedItems.value.map((group) => group.name)).toEqual(['C', 'B']);
        });
    });
});
