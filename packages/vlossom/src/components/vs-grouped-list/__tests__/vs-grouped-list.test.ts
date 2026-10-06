import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick, ref } from 'vue';
import { mount } from '@vue/test-utils';
import type { OptionItem } from '@/declaration';
import { useOptionList } from '@/composables';
import type { VsGroupedListGroup } from './../types';
import VsGroupedList from './../VsGroupedList.vue';

function createManyOptionItems(count: number): OptionItem[] {
    return createOptionItems(
        Array.from({ length: count }, (_, i) => ({
            id: i + 1,
            name: `아이템 ${i + 1}`,
            category: i % 2 ? 'odd' : 'even',
        })),
    );
}

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

        it('groupOrder에 중복된 그룹이 있어도 그룹은 한 번만 나와야 한다', () => {
            // given
            const rawItems = [
                { id: 1, name: '아이템 1', category: 'A' },
                { id: 2, name: '아이템 2', category: 'B' },
            ];
            const items = createOptionItems(rawItems);

            // when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items,
                    groupBy: (item: any) => item.category,
                    groupOrder: ['A', 'A', 'B'],
                },
            });

            // then
            const groupedItems: VsGroupedListGroup[] = wrapper.vm.groupedItems;
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

    describe('empty slot', () => {
        it('빈 items 배열일 때 empty slot이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: [],
                },
                slots: {
                    empty: '<p class="custom-empty">데이터가 없습니다</p>',
                },
            });

            // then
            expect(wrapper.find('.custom-empty').exists()).toBe(true);
        });

        it('items가 있으면 empty slot이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: {
                    items: defaultItems,
                },
                slots: {
                    empty: '<p class="custom-empty">데이터가 없습니다</p>',
                },
            });

            // then
            expect(wrapper.find('.custom-empty').exists()).toBe(false);
        });
    });

    describe('scrollToItem', () => {
        it('존재하지 않는 id로 호출해도 오류가 발생하지 않아야 한다', () => {
            // given
            const wrapper = mount(VsGroupedList, {
                props: { items: defaultItems },
            });

            // when, then
            expect(() => wrapper.vm.scrollToItem('non-existent-id')).not.toThrow();
        });

        it('offset 없이 호출하면 오류가 발생하지 않아야 한다', () => {
            // given
            const wrapper = mount(VsGroupedList, {
                props: { items: defaultItems },
            });

            // when, then
            const targetId = defaultItems[0].id;
            expect(() => wrapper.vm.scrollToItem(targetId)).not.toThrow();
        });

        it('offset을 전달하면 오류가 발생하지 않아야 한다', () => {
            // given
            const wrapper = mount(VsGroupedList, {
                props: { items: defaultItems },
            });

            // when, then
            const targetId = defaultItems[0].id;
            expect(() => wrapper.vm.scrollToItem(targetId, 50)).not.toThrow();
        });
    });

    describe('virtual scroll', () => {
        // jsdom은 레이아웃을 계산하지 않으므로 스크롤 영역(320px)과 행 높이(32px)를 흉내낸다
        beforeEach(() => {
            const isScrollBody = (el: HTMLElement) => el.classList.contains('vs-inner-scroll-body');
            vi.spyOn(HTMLElement.prototype, 'offsetHeight', 'get').mockImplementation(function (this: HTMLElement) {
                return isScrollBody(this) ? 320 : 32;
            });
            vi.spyOn(HTMLElement.prototype, 'clientHeight', 'get').mockImplementation(function (this: HTMLElement) {
                return isScrollBody(this) ? 320 : 32;
            });
            vi.spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockImplementation(function (this: HTMLElement) {
                return isScrollBody(this) ? 100000 : 32;
            });
        });

        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('items가 100개 이하이면 virtual 없이 모든 아이템을 렌더링해야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: { items: createManyOptionItems(100) },
            });

            // then
            expect(wrapper.vm.isVirtual).toBe(false);
            expect(wrapper.find('.vs-grouped-list-list').classes()).not.toContain('vs-virtual');
            expect(wrapper.findAll('.vs-grouped-list-item')).toHaveLength(100);
        });

        it('items가 100개를 초과하면 virtual로 일부 아이템만 렌더링해야 한다', async () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: { items: createManyOptionItems(1000) },
            });
            await nextTick();

            // then
            const list = wrapper.find('.vs-grouped-list-list');
            expect(wrapper.vm.isVirtual).toBe(true);
            expect(list.classes()).toContain('vs-virtual');
            expect(list.attributes('style')).toContain('height: 32000px');
            const renderedItems = wrapper.findAll('.vs-grouped-list-item');
            expect(renderedItems.length).toBeGreaterThan(0);
            expect(renderedItems.length).toBeLessThan(1000);
        });

        it('noVirtual이 true이면 items가 많아도 모든 아이템을 렌더링해야 한다', () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: { items: createManyOptionItems(150), noVirtual: true },
            });

            // then
            expect(wrapper.vm.isVirtual).toBe(false);
            expect(wrapper.findAll('.vs-grouped-list-item')).toHaveLength(150);
        });

        it('groupBy가 있으면 virtual에서도 group 헤더가 아이템과 함께 렌더링되어야 한다', async () => {
            // given, when
            const wrapper = mount(VsGroupedList, {
                props: { items: createManyOptionItems(1000), groupBy: (item: any) => item.category },
            });
            await nextTick();

            // then
            const rows = wrapper.findAll('.vs-grouped-list-list > div');
            expect(rows[0].classes()).toContain('vs-grouped-list-group');
            expect(rows[0].text()).toBe('even');
            expect(rows[1].classes()).toContain('vs-grouped-list-item');
            expect(rows[1].text()).toBe('아이템 1');
        });

        it('virtual에서도 click-item에 그룹 기준 인덱스가 전달되어야 한다', async () => {
            // given
            const wrapper = mount(VsGroupedList, {
                props: { items: createManyOptionItems(1000), groupBy: (item: any) => item.category },
            });
            await nextTick();

            // when
            await wrapper.findAll('.vs-grouped-list-item')[1].trigger('click');

            // then
            const emittedData: any = wrapper.emitted('click-item')?.[0]?.[0];
            expect(emittedData.label).toBe('아이템 3');
            expect(emittedData.groupedIndex).toBe(1);
            expect(emittedData.groupIndex).toBe(0);
        });

        it('virtual에서 scrollToItem은 offset을 scrollPaddingStart로 반영해 index 기준으로 스크롤해야 한다', async () => {
            // given
            const items = createManyOptionItems(1000);
            const wrapper = mount(VsGroupedList, {
                props: { items },
            });
            await nextTick();
            const scrollToIndexSpy = vi.spyOn(wrapper.vm.virtualizer, 'scrollToIndex');

            // when
            wrapper.vm.scrollToItem(items[500].id, 50);
            await nextTick();

            // then
            expect(wrapper.vm.virtualizer.options.scrollPaddingStart).toBe(50);
            expect(scrollToIndexSpy).toHaveBeenCalledWith(500, { align: 'start' });
        });

        it('virtual에서 groupBy가 있으면 scrollToItem은 group 헤더 행을 포함한 index로 스크롤해야 한다', async () => {
            // given
            const items = createManyOptionItems(1000);
            const wrapper = mount(VsGroupedList, {
                props: { items, groupBy: (item: any) => item.category },
            });
            await nextTick();
            const scrollToIndexSpy = vi.spyOn(wrapper.vm.virtualizer, 'scrollToIndex');

            // when: odd 그룹의 첫 아이템(아이템 2) → [even 헤더, even 500개, odd 헤더] 다음 행
            wrapper.vm.scrollToItem(items[1].id);
            await nextTick();

            // then
            expect(scrollToIndexSpy).toHaveBeenCalledWith(502, { align: 'start' });
        });
    });
});
