import { describe, it, expect, beforeEach } from 'vitest';
import { ref } from 'vue';
import { mount } from '@vue/test-utils';
import type { OptionItem } from '@/declaration';
import { useOptionList } from '@/composables';
import type { VsGroupedListGroup } from './../types';
import VsGroupedList from './../VsGroupedList.vue';

function createOptionItems(rawItems: any[]): OptionItem[] {
    const { computedOptions } = useOptionList(ref(rawItems), ref('name'), ref('id'), ref(false));
    return computedOptions.value;
}

describe('vs-grouped-list', () => {
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
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                },
            });

            // then
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;
            expect(groupedItems).toHaveLength(1);
            expect(groupedItems[0].name).toBe('');
            expect(groupedItems[0].items).toHaveLength(5);
        });

        it('groupBy가 있으면 그룹별로 아이템이 분류되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                    groupBy: (item: any) => item.category,
                },
            });

            // then
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;
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
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: itemsWithNull,
                    groupBy: (item: any) => item.category,
                },
            });

            // then
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;
            expect(groupedItems).toHaveLength(3);
            // ungrouped는 제일 밑에 있어야 함
            expect(groupedItems[2].name).toBe('');
            expect(groupedItems[2].items).toHaveLength(1);
            expect(groupedItems[2].items[0].item.id).toBe(2);
        });

        it('groupOrder가 있으면 그룹 순서가 지정된 순서대로 정렬되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                    groupBy: (item: any) => item.category,
                    groupOrder: ['C', 'A', 'B'],
                },
            });

            // then
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;
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
            const wrapper = mount(VsGroupedList, {
                props: {
                    items,
                    groupBy: (item: any) => item.category,
                    groupOrder: ['C', 'A'],
                },
            });

            // then
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;
            expect(groupedItems).toHaveLength(4);
            expect(groupedItems[0].name).toBe('C');
            expect(groupedItems[1].name).toBe('A');
            expect(groupedItems[2].name).toBe('B'); // 등장 순서대로
            expect(groupedItems[3].name).toBe('D'); // 등장 순서대로
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
            const wrapper = mount(VsGroupedList, {
                props: {
                    items,
                    groupBy: (item: any) => item.category,
                    groupOrder: ['B', 'A'],
                },
            });

            // then
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;
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
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: itemsWithDisabled,
                },
            });

            // then
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;
            expect(groupedItems[0].items[0].disabled).toBe(false); // id: 1
            expect(groupedItems[0].items[1].disabled).toBe(true); // id: 2
            expect(groupedItems[0].items[2].disabled).toBe(false); // id: 3
            expect(groupedItems[0].items[3].disabled).toBe(true); // index: 3
            expect(groupedItems[0].items[4].disabled).toBe(false); // id: 5
        });
    });

    describe('vs-grouped-list-list 렌더링', () => {
        it('vs-grouped-list-list가 올바르게 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                },
            });

            // then
            const itemsList = wrapper.find('.vs-grouped-list-list');
            expect(itemsList.exists()).toBe(true);
            const items = itemsList.findAll('.vs-grouped-list-item');
            expect(items).toHaveLength(5);
        });

        it('groupBy가 있을 때 그룹 헤더가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                    groupBy: (item: any) => item.category,
                },
            });

            // then
            const itemsList = wrapper.find('.vs-grouped-list-list');
            const groups = itemsList.findAll('.vs-grouped-list-group');
            expect(groups).toHaveLength(3);
            const items = itemsList.findAll('.vs-grouped-list-item');
            expect(items).toHaveLength(5);
        });

        it('groupBy가 없을 때 그룹 헤더가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                },
            });

            // then
            const itemsList = wrapper.find('.vs-grouped-list-list');
            const groups = itemsList.findAll('.vs-grouped-list-group');
            expect(groups).toHaveLength(0);
            const items = itemsList.findAll('.vs-grouped-list-item');
            expect(items).toHaveLength(5);
        });

        it('각 아이템이 올바른 id를 가져야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                },
            });

            // then
            const itemsList = wrapper.find('.vs-grouped-list-list');
            const items = itemsList.findAll('.vs-grouped-list-item');
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;

            items.forEach((itemElement, index) => {
                const item = groupedItems[0].items[index];
                expect(itemElement.attributes('id')).toBe(item.id);
            });
        });

        it('disabled 아이템에 vs-disabled 클래스가 적용되어야 한다', () => {
            // given
            const itemsWithDisabled = defaultItems.map((item) => ({
                ...item,
                disabled: item.item.id === 2 || item.item.id === 4,
            }));

            // when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: itemsWithDisabled,
                },
            });

            // then
            const itemsList = wrapper.find('.vs-grouped-list-list');
            const items = itemsList.findAll('.vs-grouped-list-item');
            expect(items[0].classes()).not.toContain('vs-disabled');
            expect(items[1].classes()).toContain('vs-disabled');
            expect(items[2].classes()).not.toContain('vs-disabled');
            expect(items[3].classes()).toContain('vs-disabled');
            expect(items[4].classes()).not.toContain('vs-disabled');
        });

        it('아이템 클릭 시 click-item 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                },
            });

            // when
            const itemsList = wrapper.find('.vs-grouped-list-list');
            const firstItem = itemsList.find('.vs-grouped-list-item');
            await firstItem.trigger('click');

            // then
            expect(wrapper.emitted('click-item')).toBeTruthy();
            expect(wrapper.emitted('click-item')?.[0]).toBeDefined();
            const emittedData = wrapper.emitted('click-item')?.[0]?.[0];
            expect(emittedData).toHaveProperty('item');
            expect(emittedData).toHaveProperty('index');
            expect(emittedData).toHaveProperty('group');
            expect(emittedData).toHaveProperty('groupIndex');
        });

        it('빈 items 배열일 때 아이템이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: [],
                },
            });

            // then
            const itemsList = wrapper.find('.vs-grouped-list-list');
            const items = itemsList.findAll('.vs-grouped-list-item');
            expect(items).toHaveLength(0);
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;
            expect(groupedItems).toHaveLength(1);
            expect(groupedItems[0].items).toHaveLength(0);
        });
    });

    describe('styleSet 하위 속성 전달', () => {
        it('layout styleSet이 vs-inner-scroll 컴포넌트에 전달되어야 한다', () => {
            // given
            const layoutStyleSet = {
                content: {
                    maxHeight: '400px',
                    overflowY: 'auto' as const,
                },
            };

            // when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                    styleSet: {
                        layout: layoutStyleSet,
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.layout).toEqual(layoutStyleSet);
            const vsInnerScroll = wrapper.findComponent({ name: 'VsInnerScroll' });
            expect(vsInnerScroll.exists()).toBe(true);
            expect(vsInnerScroll.props('styleSet')).toEqual(layoutStyleSet);
        });

        it('group styleSet이 componentStyleSet에 설정되어야 한다', () => {
            // given
            const groupStyle = {
                backgroundColor: '#f5f5f5',
                padding: '0.5rem 1rem',
                fontWeight: 'bold',
            };

            // when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                    groupBy: (item: any) => item.category,
                    styleSet: {
                        group: groupStyle,
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.group).toEqual(groupStyle);
        });

        it('item styleSet이 componentStyleSet에 설정되어야 한다', () => {
            // given
            const itemStyle = {
                padding: '0.75rem 1rem',
                borderBottom: '1px solid #eee',
            };

            // when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                    styleSet: {
                        item: itemStyle,
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.item).toEqual(itemStyle);
        });

        it('모든 styleSet 하위 속성이 함께 전달되어야 한다', () => {
            // given
            const fullStyleSet = {
                variables: {
                    gap: '0.5rem',
                    height: '300px',
                },
                layout: {
                    content: {
                        padding: '1rem',
                    },
                },
                group: {
                    backgroundColor: '#e3f2fd',
                    fontWeight: 600,
                },
                item: {
                    padding: '0.75rem',
                },
            };

            // when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                    groupBy: (item: any) => item.category,
                    styleSet: fullStyleSet,
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables['--vs-grouped-list-gap']).toBe('0.5rem');
            expect(wrapper.vm.componentStyleSet.layout).toEqual(fullStyleSet.layout);
            expect(wrapper.vm.componentStyleSet.group).toEqual(fullStyleSet.group);
            expect(wrapper.vm.componentStyleSet.item).toEqual(fullStyleSet.item);
        });
    });
});
