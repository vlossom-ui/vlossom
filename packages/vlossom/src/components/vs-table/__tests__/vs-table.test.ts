import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { logUtil } from '@/utils';
import VsTable from './../VsTable.vue';
import type { VsTableCell, VsTableColumnDef, VsTableItem } from './../types';

const defaultColumns = ['name', 'age'];
const labeledColumns: VsTableColumnDef[] = [
    { key: 'name', label: '이름' },
    { key: 'age', label: '나이' },
];
const sortableColumns: VsTableColumnDef[] = labeledColumns.map((column) => ({ ...column, sortable: true }));
const tableItems = [
    { id: '1', name: 'Alice', age: 24 },
    { id: '2', name: 'Bob', age: 30 },
];

const draggableStub = {
    props: ['modelValue', 'itemKey', 'disabled'],
    emits: ['update:modelValue', 'update'],
    template: `<tbody data-testid="draggable-wrapper" :data-disabled="disabled">
        <slot name="item" v-for="(element, index) in modelValue" :key="index" :element="element" :index="index" />
    </tbody>`,
};

const defaultStubs = {
    'vs-checkbox': true,
    'vs-button': { template: '<button data-testid="vs-button"><slot /></button>' },
    'vs-expandable': { props: ['open'], template: '<div v-if="open" data-testid="vs-expandable"><slot /></div>' },
    'vs-pagination': {
        props: ['modelValue', 'length', 'showingLength', 'edgeButtons', 'disabled'],
        emits: ['update:modelValue'],
        template: `<button data-testid="vs-pagination" :disabled="!!disabled" :data-length="length"
            @click="$emit('update:modelValue', modelValue + 1)">Pagination</button>`,
    },
    'vs-select': {
        props: ['modelValue', 'options', 'disabled'],
        emits: ['update:modelValue'],
        template: '<select data-testid="vs-select" :disabled="!!disabled"></select>',
    },
    // 검색 필터는 VsSearchInput.match()에 위임하므로, stub도 keyword를 들고 match를 제공한다
    'vs-search-input': {
        props: ['disabled'],
        emits: ['search'],
        data() {
            return { searchText: '' };
        },
        template: '<input data-testid="search-input" :disabled="disabled" @input="onInput" />',
        methods: {
            onInput(event: Event) {
                (this as any).searchText = (event.target as HTMLInputElement).value;
                (this as any).$emit('search', (this as any).searchText);
            },
            match(text: string) {
                const keyword = (this as any).searchText;
                return !keyword || String(text).toLowerCase().includes(String(keyword).toLowerCase());
            },
        },
    },
    draggable: draggableStub,
    vuedraggable: draggableStub,
};

const mountTable = (
    options: { props?: Record<string, unknown>; slots?: Record<string, any>; stubs?: Record<string, any> } = {},
) =>
    mount(VsTable, {
        props: {
            columns: defaultColumns,
            items: tableItems,
            ...(options.props ?? {}),
        },
        slots: options.slots,
        global: { stubs: { ...defaultStubs, ...(options.stubs ?? {}) } },
    });

const headerTextsOf = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('th').map((th) => th.text());
const bodyTextsOf = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('tbody td').map((td) => td.text());
const rowNamesOf = (wrapper: ReturnType<typeof mount>) =>
    wrapper
        .findAll('tbody tr')
        .filter((tr) => !tr.find('.vs-table-no-data-cell').exists())
        .map((tr) => tr.find('td:not(.vs-table-drag-handle)').text());
const lastEmit = (wrapper: ReturnType<typeof mount>, event: string) => {
    const emitted = wrapper.emitted(event);
    return emitted?.[emitted.length - 1];
};

describe('VsTable', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('기본 렌더링', () => {
        it('컬럼 정의와 아이템을 기반으로 헤더와 바디를 렌더링한다', async () => {
            const wrapper = mountTable({ props: { columns: labeledColumns } });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['이름', '나이']);
            expect(bodyTextsOf(wrapper)).toEqual(['Alice', '24', 'Bob', '30']);
        });

        it('문자열 컬럼은 key와 label이 같은 컬럼으로 취급한다', async () => {
            const wrapper = mountTable();

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['name', 'age']);
        });

        it('컬럼 정의가 없으면 첫 아이템의 키로 헤더를 만든다', async () => {
            const wrapper = mountTable({ props: { columns: [] } });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['id', 'name', 'age']);
        });

        it('중첩 키 컬럼의 값을 읽어 렌더링한다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: [{ key: 'metadata.email', label: 'Email' }],
                    items: [{ metadata: { email: 'alice@example.com' } }],
                },
            });

            await nextTick();

            expect(bodyTextsOf(wrapper)).toEqual(['alice@example.com']);
        });

        it('caption 슬롯과 styleSet의 $caption을 적용한다', async () => {
            const wrapper = mountTable({
                props: { styleSet: { $caption: { color: 'red' } } },
                slots: { caption: () => 'Caption' },
            });

            await nextTick();

            const caption = wrapper.find('caption');
            expect(caption.text()).toBe('Caption');
            expect(caption.attributes('style')).toContain('color: red');
        });
    });

    describe('empty', () => {
        it('items가 비어있고 empty 슬롯이 있으면 슬롯을 렌더링한다', async () => {
            const wrapper = mountTable({ props: { items: [] }, slots: { empty: () => 'NO RESULT' } });

            await nextTick();

            expect(wrapper.find('.vs-table-no-data').text()).toBe('NO RESULT');
        });

        it('items가 비어있고 empty 슬롯이 없으면 기본 자리표시자를 렌더링한다', async () => {
            const wrapper = mountTable({ props: { items: [] } });

            await nextTick();

            expect(wrapper.find('.vs-table-no-data-text').exists()).toBe(true);
        });

        it('loading이면 empty 슬롯보다 로딩 인디케이터가 우선한다', async () => {
            const wrapper = mountTable({ props: { items: [], loading: true }, slots: { empty: () => 'NO RESULT' } });

            await nextTick();

            expect(wrapper.find('.vs-table-no-data').text()).not.toBe('NO RESULT');
        });
    });

    describe('cell slot 우선순위', () => {
        it('`header-${colKey}` / `item-${colKey}` 슬롯이 기본 렌더링보다 우선한다', async () => {
            const wrapper = mountTable({
                slots: {
                    'header-name': ({ item }: { item: VsTableColumnDef }) => `HEADER-${item.key}`,
                    'item-name': ({ item }: { item: VsTableItem }) => `ITEM-${item.name}`,
                },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['HEADER-name', 'age']);
            expect(bodyTextsOf(wrapper)).toEqual(['ITEM-Alice', '24', 'ITEM-Bob', '30']);
        });

        it('`item-${colKey}` 슬롯이 위치 기반 슬롯보다 우선한다', async () => {
            const wrapper = mountTable({
                slots: {
                    'item-age': ({ item }: { item: VsTableItem }) => `AGE-${item.age}`,
                    'item-col1-row0': () => 'ROWCOL-OVERRIDE',
                },
            });

            await nextTick();

            expect(bodyTextsOf(wrapper)).toEqual(['Alice', 'AGE-24', 'Bob', 'AGE-30']);
        });

        it('`item-col${colIdx}-row${rowIdx}` 슬롯이 `item-col${colIdx}` 슬롯보다 우선한다', async () => {
            const wrapper = mountTable({
                slots: {
                    'item-col1': () => 'COL',
                    'item-col1-row0': () => 'COL-ROW',
                },
            });

            await nextTick();

            expect(bodyTextsOf(wrapper)).toEqual(['Alice', 'COL-ROW', 'Bob', 'COL']);
        });

        it('"header", "item" 슬롯은 최후 fallback으로 적용된다', async () => {
            const wrapper = mountTable({
                slots: {
                    header: ({ colIdx, item }: { colIdx: number; item: VsTableColumnDef }) =>
                        `HEADER-${colIdx}-${item.key}`,
                    item: ({ item }: { item: VsTableItem }) => `ITEM-${item.id}`,
                },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['HEADER-0-name', 'HEADER-1-age']);
            expect(bodyTextsOf(wrapper)).toEqual(['ITEM-1', 'ITEM-1', 'ITEM-2', 'ITEM-2']);
        });

        it('camelCase colKey가 literal 형태의 슬롯 이름과 매칭된다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: ['firstName', 'lastName'],
                    items: [{ firstName: 'Alice', lastName: 'Kim' }],
                },
                slots: {
                    'header-firstName': ({ item }: { item: VsTableColumnDef }) => `HEAD-${item.key}`,
                    'item-firstName': ({ item }: { item: VsTableItem }) => `FIRST-${item.firstName}`,
                },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['HEAD-firstName', 'lastName']);
            expect(bodyTextsOf(wrapper)).toEqual(['FIRST-Alice', 'Kim']);
        });
    });

    describe('emits', () => {
        it('셀 클릭 시 click-cell을 item 기반 payload로 발생시킨다', async () => {
            const wrapper = mountTable();

            await nextTick();
            await wrapper.get('tbody td').trigger('click');

            const [cell, event] = lastEmit(wrapper, 'click-cell') as [VsTableCell, Event];
            expect(event).toBeInstanceOf(Event);
            expect(cell).toEqual({ item: tableItems[0], value: 'Alice', colKey: 'name', rowIdx: 0, colIdx: 0 });
            expect(cell.item).toStrictEqual(tableItems[0]);
        });

        it('셀 클릭 시 click-row를 item과 index와 함께 발생시킨다', async () => {
            const wrapper = mountTable();

            await nextTick();
            await wrapper.findAll('tbody tr')[1].findAll('td')[0].trigger('click');

            const [item, index, event] = lastEmit(wrapper, 'click-row') as [VsTableItem, number, Event];
            expect(item).toStrictEqual(tableItems[1]);
            expect(index).toBe(1);
            expect(event).toBeInstanceOf(Event);
        });

        it('선택 셀 클릭 시 select-row를 (item, index, selected, event)로 발생시킨다', async () => {
            const wrapper = mountTable({ props: { selectable: true } });

            await nextTick();
            await wrapper.get('tbody tr td').trigger('click');

            const [item, index, selected, event] = lastEmit(wrapper, 'select-row') as [
                VsTableItem,
                number,
                boolean,
                Event,
            ];
            expect(item).toStrictEqual(tableItems[0]);
            expect(index).toBe(0);
            expect(selected).toBe(true);
            expect(event).toBeInstanceOf(Event);
        });

        it('selectable이 false를 반환하는 행에서는 select-row가 발생하지 않는다', async () => {
            const wrapper = mountTable({ props: { selectable: (item: VsTableItem) => item.name === 'Bob' } });

            await nextTick();
            await wrapper.get('tbody tr td').trigger('click');

            expect(wrapper.emitted('select-row')).toBeUndefined();
        });

        it('expand 버튼 클릭 시 expand-row를 (item, index, expanded, event)로 발생시킨다', async () => {
            const wrapper = mountTable({ slots: { expand: () => h('div') } });

            await nextTick();
            await wrapper.get('tbody tr button').trigger('click');

            const [item, index, expanded, event] = lastEmit(wrapper, 'expand-row') as [
                VsTableItem,
                number,
                boolean,
                Event,
            ];
            expect(item).toStrictEqual(tableItems[0]);
            expect(index).toBe(0);
            expect(expanded).toBe(true);
            expect(event).toBeInstanceOf(Event);
        });

        it('검색 시 search 이벤트를 (표시 중인 items, 검색어)와 함께 발생시킨다', async () => {
            const wrapper = mountTable({ props: { search: true } });

            await nextTick();
            await wrapper.get('[data-testid="search-input"]').setValue('Alice');

            const [items, searchText] = lastEmit(wrapper, 'search') as [VsTableItem[], string];
            expect(searchText).toBe('Alice');
            expect(items).toHaveLength(1);
            expect(items[0]).toStrictEqual(tableItems[0]);
        });
    });

    describe('selection', () => {
        it('selectedItems prop에 포함된 행에 선택 클래스를 적용한다', async () => {
            const wrapper = mountTable({ props: { selectable: true, selectedItems: [tableItems[1]] } });

            await nextTick();

            const rows = wrapper.findAll('tbody tr');
            expect(rows[0].classes()).not.toContain('vs-selected');
            expect(rows[1].classes()).toContain('vs-selected');
        });

        it('선택 셀 클릭으로 update:selectedItems를 발생시킨다', async () => {
            const wrapper = mountTable({ props: { selectable: true } });

            await nextTick();
            await wrapper.get('tbody tr td').trigger('click');

            expect(lastEmit(wrapper, 'update:selectedItems')).toEqual([[tableItems[0]]]);

            await wrapper.get('tbody tr td').trigger('click');

            expect(lastEmit(wrapper, 'update:selectedItems')).toEqual([[]]);
        });

        it('헤더 선택 셀 클릭으로 선택 가능한 전체 아이템을 선택한다', async () => {
            const wrapper = mountTable({ props: { selectable: (item: VsTableItem) => item.name !== 'Bob' } });

            await nextTick();
            await wrapper.get('thead th').trigger('click');

            expect(lastEmit(wrapper, 'update:selectedItems')).toEqual([[tableItems[0]]]);
        });

        it('selectedItems prop이 바뀌면 선택 상태를 따라간다', async () => {
            const wrapper = mountTable({ props: { selectable: true } });

            await wrapper.setProps({ selectedItems: [tableItems[0]] });
            await nextTick();

            expect(wrapper.findAll('tbody tr')[0].classes()).toContain('vs-selected');
        });

        it('실제 체크박스를 클릭해도 선택 상태가 토글된다', async () => {
            const wrapper = mount(VsTable, {
                props: { columns: defaultColumns, items: tableItems, itemKey: 'id', selectable: true },
                global: { stubs: { ...defaultStubs, 'vs-checkbox': false } },
            });

            await nextTick();
            const checkbox = wrapper.find('tbody input[type="checkbox"]');
            expect(checkbox.exists()).toBe(true);

            await checkbox.trigger('click');
            await nextTick();

            expect(lastEmit(wrapper, 'update:selectedItems')).toEqual([[tableItems[0]]]);
            expect(wrapper.findAll('tbody tr')[0].classes()).toContain('vs-selected');
        });

        it('selectable이 false면 선택 셀을 렌더링하지 않는다', async () => {
            const wrapper = mountTable();

            await nextTick();

            expect(wrapper.findAll('thead th')).toHaveLength(defaultColumns.length);
        });
    });

    describe('expandable', () => {
        it('expand 슬롯이 있으면 확장 버튼과 패널을 렌더링한다', async () => {
            const wrapper = mountTable({
                slots: {
                    expand: ({ item, rowIdx }: { item: VsTableItem; rowIdx: number }) =>
                        h('div', {}, `${rowIdx}-${item.name}`),
                },
            });

            await nextTick();
            const expandButtons = wrapper.findAll('tbody tr button');
            expect(expandButtons).toHaveLength(tableItems.length);

            await expandButtons[0].trigger('click');

            expect(wrapper.find('[data-testid="vs-expandable"]').text()).toBe('0-Alice');
        });

        it('expand 슬롯이 없으면 확장 UI를 렌더링하지 않는다', async () => {
            const wrapper = mountTable({ props: { expandable: true } });

            await nextTick();

            expect(wrapper.findAll('tbody tr button')).toHaveLength(0);
            expect(wrapper.find('.vs-table-expand-handle').exists()).toBe(false);
        });

        it('expandable이 false이면 expand 슬롯이 있어도 확장 UI를 렌더링하지 않는다', async () => {
            const wrapper = mountTable({ props: { expandable: false }, slots: { expand: () => h('div') } });

            await nextTick();

            expect(wrapper.find('.vs-table-expand-handle').exists()).toBe(false);
        });

        it('expand(index) / collapse(index) 메서드로 행을 펼치고 접는다', async () => {
            const wrapper = mountTable({
                slots: { expand: ({ item }: { item: VsTableItem }) => h('div', {}, String(item.name)) },
            });
            const vm = wrapper.vm as unknown as { expand: (index: number) => void; collapse: (index: number) => void };

            await nextTick();
            expect(wrapper.find('[data-testid="vs-expandable"]').exists()).toBe(false);

            vm.expand(0);
            await nextTick();
            expect(wrapper.find('[data-testid="vs-expandable"]').text()).toBe('Alice');

            vm.collapse(0);
            await nextTick();
            expect(wrapper.find('[data-testid="vs-expandable"]').exists()).toBe(false);
        });

        it('없는 index나 expandable하지 않은 행은 expand(index)로 펼쳐지지 않는다', async () => {
            const wrapper = mountTable({
                props: { expandable: (item: VsTableItem) => item.name === 'Alice' },
                slots: { expand: ({ item }: { item: VsTableItem }) => h('div', {}, String(item.name)) },
            });
            const vm = wrapper.vm as unknown as { expand: (index: number) => void };

            await nextTick();

            vm.expand(99);
            vm.expand(1);
            await nextTick();

            expect(wrapper.find('[data-testid="vs-expandable"]').exists()).toBe(false);
        });
    });

    describe('sort', () => {
        const unsortedItems = [
            { id: '2', name: 'Bob', age: 30 },
            { id: '1', name: 'Alice', age: 24 },
        ];

        it('정렬 아이콘 클릭마다 오름차순 → 내림차순 → 원래 순서로 순환한다', async () => {
            const wrapper = mountTable({ props: { columns: sortableColumns, items: unsortedItems } });

            await nextTick();
            expect(rowNamesOf(wrapper)).toEqual(['Bob', 'Alice']);

            const sortIcon = wrapper.findAll('.vs-table-sort-icon')[0];

            await sortIcon.trigger('click');
            expect(rowNamesOf(wrapper)).toEqual(['Alice', 'Bob']);

            await sortIcon.trigger('click');
            expect(rowNamesOf(wrapper)).toEqual(['Bob', 'Alice']);

            await sortIcon.trigger('click');
            expect(rowNamesOf(wrapper)).toEqual(['Bob', 'Alice']);
        });

        it('다른 컬럼의 정렬 아이콘을 클릭하면 그 컬럼 기준 오름차순으로 정렬한다', async () => {
            const wrapper = mountTable({ props: { columns: sortableColumns, items: unsortedItems } });

            await nextTick();
            await wrapper.findAll('.vs-table-sort-icon')[1].trigger('click');

            expect(rowNamesOf(wrapper)).toEqual(['Alice', 'Bob']);
        });

        it('sortable이 아닌 컬럼에는 정렬 아이콘을 렌더링하지 않는다', async () => {
            const wrapper = mountTable({ props: { columns: labeledColumns } });

            await nextTick();

            expect(wrapper.findAll('.vs-table-sort-icon')).toHaveLength(0);
        });
    });

    describe('search', () => {
        it('검색어와 일치하는 행만 렌더링한다', async () => {
            const wrapper = mountTable({ props: { search: true } });

            await nextTick();
            await wrapper.get('[data-testid="search-input"]').setValue('Bob');

            expect(rowNamesOf(wrapper)).toEqual(['Bob']);
        });

        it('skipSearch 컬럼의 값으로는 검색되지 않는다', async () => {
            const wrapper = mountTable({
                props: {
                    search: true,
                    columns: [
                        { key: 'name', label: '이름' },
                        { key: 'memo', label: '메모', skipSearch: true },
                    ],
                    items: [
                        { name: 'Alice', memo: 'hidden' },
                        { name: 'Bob', memo: 'shown' },
                    ],
                },
            });

            await nextTick();
            await wrapper.get('[data-testid="search-input"]').setValue('hidden');

            expect(rowNamesOf(wrapper)).toEqual([]);
        });

        it('search.extraKeys에 지정한 필드로 검색된다', async () => {
            const wrapper = mountTable({
                props: {
                    search: { extraKeys: ['tags'] },
                    columns: [{ key: 'name', label: '이름' }],
                    items: [
                        { name: 'Alice', tags: 'vip' },
                        { name: 'Bob', tags: 'normal' },
                    ],
                },
            });

            await nextTick();
            await wrapper.get('[data-testid="search-input"]').setValue('vip');

            expect(rowNamesOf(wrapper)).toEqual(['Alice']);
        });

        it('transform으로 표시된 값 그대로 검색된다', async () => {
            const wrapper = mountTable({
                props: {
                    search: true,
                    columns: [{ key: 'age', label: '나이', transform: (value: number) => `${value}세` }],
                    items: [{ age: 24 }, { age: 30 }],
                },
            });

            await nextTick();
            await wrapper.get('[data-testid="search-input"]').setValue('24세');

            expect(bodyTextsOf(wrapper)).toEqual(['24세']);
        });
    });

    describe('pagination', () => {
        const manyItems = Array.from({ length: 120 }, (_, index) => ({
            id: `${index}`,
            name: `User ${index}`,
            age: index,
        }));

        it('pagination을 활성화하면 페이지네이션과 페이지 크기 셀렉터를 렌더링한다', async () => {
            const wrapper = mountTable({ props: { items: manyItems, pagination: true } });

            await nextTick();

            expect(wrapper.find('[data-testid="vs-pagination"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="vs-select"]').exists()).toBe(true);
        });

        it('기본 pageSize(50)만큼만 렌더링한다', async () => {
            const wrapper = mountTable({ props: { items: manyItems, pagination: true } });

            await nextTick();

            expect(wrapper.findAll('tbody tr')).toHaveLength(50);
        });

        it('페이지를 변경하면 paginate와 update:page를 발생시키고 해당 페이지를 렌더링한다', async () => {
            const wrapper = mountTable({ props: { items: manyItems, pagination: true, pageSize: 50 } });

            await nextTick();
            await wrapper.get('[data-testid="vs-pagination"]').trigger('click');

            expect(lastEmit(wrapper, 'update:page')).toEqual([1]);
            expect(lastEmit(wrapper, 'paginate')).toEqual([1, 50]);
            expect(rowNamesOf(wrapper)[0]).toBe('User 50');
        });

        it('page size를 변경하면 page를 0으로 리셋하고 paginate를 한 번만 발생시킨다', async () => {
            const wrapper = mountTable({
                props: { items: manyItems, pagination: true },
                stubs: {
                    'vs-select': {
                        props: ['modelValue', 'options'],
                        emits: ['update:modelValue'],
                        template: `<button data-testid="vs-select"
                            @click="$emit('update:modelValue', 100)" />`,
                    },
                },
            });

            await nextTick();
            await wrapper.get('[data-testid="vs-pagination"]').trigger('click');
            const paginateCount = wrapper.emitted('paginate')?.length ?? 0;

            await wrapper.get('[data-testid="vs-select"]').trigger('click');

            expect(wrapper.emitted('paginate')).toHaveLength(paginateCount + 1);
            expect(lastEmit(wrapper, 'paginate')).toEqual([0, 100]);
        });

        it('page가 v-model로 바인딩되어 있어도 페이지 변경을 알린다', async () => {
            const wrapper = mountTable({ props: { items: manyItems, pagination: true, page: 0, pageSize: 50 } });

            await nextTick();
            await wrapper.get('[data-testid="vs-pagination"]').trigger('click');

            expect(lastEmit(wrapper, 'update:page')).toEqual([1]);

            await wrapper.setProps({ page: 1 });

            expect(lastEmit(wrapper, 'paginate')).toEqual([1, 50]);
            expect(rowNamesOf(wrapper)[0]).toBe('User 50');
        });

        it('초기 pageSize가 없으면 pageSizeOptions의 첫 번째 값을 사용한다', async () => {
            const wrapper = mountTable({
                props: {
                    items: manyItems,
                    pagination: { pageSizeOptions: [{ label: '5', value: 5 }] },
                },
            });

            await nextTick();

            expect(wrapper.findAll('tbody tr')).toHaveLength(5);
        });

        it('page와 pageSize prop이 주어지면 해당 페이지를 렌더링한다', async () => {
            const wrapper = mountTable({ props: { items: manyItems, pagination: true, page: 2, pageSize: 10 } });

            await nextTick();

            expect(wrapper.findAll('tbody tr')).toHaveLength(10);
            expect(rowNamesOf(wrapper)[0]).toBe('User 20');
        });

        it('클라이언트 모드에서는 마운트 시 paginate를 발생시키지 않는다', async () => {
            const wrapper = mountTable({ props: { items: manyItems, pagination: true } });

            await nextTick();

            expect(wrapper.emitted('paginate')).toBeUndefined();
        });

        describe('server mode', () => {
            it('마운트 시 초기 데이터 로드를 위해 paginate를 발생시킨다', async () => {
                const wrapper = mountTable({
                    props: { serverMode: true, pagination: { totalItemCount: 100 }, pageSize: 10 },
                });

                await nextTick();

                expect(lastEmit(wrapper, 'paginate')).toEqual([0, 10]);
            });

            it('페이지를 바꾸면 update:page와 paginate로 다음 페이지를 요청한다', async () => {
                const wrapper = mountTable({
                    props: {
                        items: manyItems.slice(0, 10),
                        serverMode: true,
                        pagination: { totalItemCount: 120 },
                        page: 0,
                        pageSize: 10,
                    },
                });

                await nextTick();
                const paginateCount = wrapper.emitted('paginate')?.length ?? 0;

                await wrapper.get('[data-testid="vs-pagination"]').trigger('click');
                expect(lastEmit(wrapper, 'update:page')).toEqual([1]);

                await wrapper.setProps({ page: 1 });

                expect(wrapper.emitted('paginate')).toHaveLength(paginateCount + 1);
                expect(lastEmit(wrapper, 'paginate')).toEqual([1, 10]);
            });

            it('totalItemCount 기반으로 페이지 수를 계산한다', async () => {
                const wrapper = mountTable({
                    props: { serverMode: true, pagination: { totalItemCount: 100 }, pageSize: 10 },
                });

                await nextTick();

                expect(wrapper.find('[data-testid="vs-pagination"]').attributes('data-length')).toBe('10');
            });

            it('client-side pagination을 수행하지 않고 전달된 items를 모두 렌더링한다', async () => {
                const wrapper = mountTable({
                    props: {
                        items: manyItems.slice(0, 12),
                        serverMode: true,
                        pagination: { totalItemCount: 120 },
                        pageSize: 10,
                    },
                });

                await nextTick();

                expect(wrapper.findAll('tbody tr')).toHaveLength(12);
            });

            it('totalItemCount가 없으면 prop 에러를 남긴다', async () => {
                const propError = vi.spyOn(logUtil, 'propError').mockImplementation(() => {});

                mountTable({ props: { serverMode: true, pagination: true } });
                await nextTick();

                expect(propError).toHaveBeenCalled();
            });

            it('totalItemCount가 0이면 pagination을 렌더링하지 않는다', async () => {
                const wrapper = mountTable({ props: { serverMode: true, pagination: { totalItemCount: 0 } } });

                await nextTick();

                expect(wrapper.find('[data-testid="vs-pagination"]').exists()).toBe(false);
            });
        });
    });

    describe('v-model:pagedItems / v-model:totalItems', () => {
        it('마운트 시 현재 페이지 아이템과 전체 아이템을 내보낸다', async () => {
            const wrapper = mountTable();

            await nextTick();

            expect(lastEmit(wrapper, 'update:pagedItems')).toEqual([tableItems]);
            expect(lastEmit(wrapper, 'update:totalItems')).toEqual([tableItems]);
        });

        it('검색 결과가 반영된다', async () => {
            const wrapper = mountTable({ props: { search: true } });

            await nextTick();
            await wrapper.get('[data-testid="search-input"]').setValue('Bob');

            expect(lastEmit(wrapper, 'update:pagedItems')).toEqual([[tableItems[1]]]);
            expect(lastEmit(wrapper, 'update:totalItems')).toEqual([[tableItems[1]]]);
        });

        it('정렬 결과가 반영된다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: sortableColumns,
                    items: [tableItems[1], tableItems[0]],
                },
            });

            await nextTick();
            await wrapper.findAll('.vs-table-sort-icon')[0].trigger('click');

            expect(lastEmit(wrapper, 'update:totalItems')).toEqual([[tableItems[0], tableItems[1]]]);
        });

        it('pagination이 있으면 pagedItems는 현재 페이지, totalItems는 전체를 담는다', async () => {
            const items = Array.from({ length: 4 }, (_, index) => ({ id: `${index}`, name: `User ${index}` }));
            const wrapper = mountTable({
                props: { items, pagination: { pageSizeOptions: [{ label: '2', value: 2 }] } },
            });

            await nextTick();

            expect(lastEmit(wrapper, 'update:pagedItems')).toEqual([items.slice(0, 2)]);
            expect(lastEmit(wrapper, 'update:totalItems')).toEqual([items]);
        });
    });

    describe('draggable', () => {
        const findDraggable = (wrapper: ReturnType<typeof mount>) =>
            wrapper.findComponent('[data-testid="draggable-wrapper"]') as unknown as VueWrapper;

        it('draggable이 true일 때만 draggable wrapper를 렌더링한다', async () => {
            const plain = mountTable();
            const draggable = mountTable({ props: { draggable: true } });

            await nextTick();

            expect(plain.find('[data-testid="draggable-wrapper"]').exists()).toBe(false);
            expect(draggable.find('[data-testid="draggable-wrapper"]').exists()).toBe(true);
        });

        it('loading이면 드래그를 비활성화한다', async () => {
            const wrapper = mountTable({ props: { draggable: true, loading: true } });

            await nextTick();

            expect(wrapper.find('[data-testid="draggable-wrapper"]').attributes('data-disabled')).toBe('true');
        });

        it('drag 이벤트를 부모에게 전달한다', async () => {
            const wrapper = mountTable({ props: { draggable: true } });

            await nextTick();
            findDraggable(wrapper).vm.$emit('update', { oldIndex: 0, newIndex: 1 });

            expect(lastEmit(wrapper, 'drag')).toEqual([{ oldIndex: 0, newIndex: 1 }]);
        });

        it('드래그로 바뀐 순서를 화면과 pagedItems/totalItems에 반영한다', async () => {
            const wrapper = mountTable({ props: { draggable: true } });

            await nextTick();
            findDraggable(wrapper).vm.$emit('update:modelValue', [tableItems[1], tableItems[0]]);
            await nextTick();

            expect(rowNamesOf(wrapper)).toEqual(['Bob', 'Alice']);
            expect(lastEmit(wrapper, 'update:pagedItems')).toEqual([[tableItems[1], tableItems[0]]]);
            expect(lastEmit(wrapper, 'update:totalItems')).toEqual([[tableItems[1], tableItems[0]]]);
        });

        it('정렬이 켜져 있어도 드래그로 바꾼 순서를 유지한다', async () => {
            const wrapper = mountTable({
                props: { columns: sortableColumns, items: [tableItems[1], tableItems[0]], draggable: true },
            });

            await nextTick();
            await wrapper.findAll('.vs-table-sort-icon')[0].trigger('click');
            expect(rowNamesOf(wrapper)).toEqual(['Alice', 'Bob']);

            findDraggable(wrapper).vm.$emit('update:modelValue', [tableItems[1], tableItems[0]]);
            await nextTick();

            expect(rowNamesOf(wrapper)).toEqual(['Bob', 'Alice']);
        });

        it('현재 페이지 안에서의 드래그는 다른 페이지 아이템 순서를 바꾸지 않는다', async () => {
            const items = Array.from({ length: 4 }, (_, index) => ({ id: `${index}`, name: `User ${index}` }));
            const wrapper = mountTable({
                props: {
                    items,
                    draggable: true,
                    page: 1,
                    pagination: { pageSizeOptions: [{ label: '2', value: 2 }] },
                },
            });

            await nextTick();
            findDraggable(wrapper).vm.$emit('update:modelValue', [items[3], items[2]]);
            await nextTick();

            expect(lastEmit(wrapper, 'update:totalItems')).toEqual([[items[0], items[1], items[3], items[2]]]);
        });

        it('stub 없이 실제 draggable로 마운트해도 행을 렌더링한다', async () => {
            const wrapper = mount(VsTable, {
                props: { columns: defaultColumns, items: tableItems, itemKey: 'id', draggable: true },
            });

            await nextTick();

            expect(wrapper.findAll('tbody tr')).toHaveLength(tableItems.length);
            expect(wrapper.find('tbody').classes()).toContain('vs-table-tbody');
        });

        it('items가 바뀌면 드래그 순서를 버린다', async () => {
            const wrapper = mountTable({ props: { draggable: true } });

            await nextTick();
            findDraggable(wrapper).vm.$emit('update:modelValue', [tableItems[1], tableItems[0]]);
            await nextTick();
            expect(rowNamesOf(wrapper)).toEqual(['Bob', 'Alice']);

            await wrapper.setProps({ items: [...tableItems] });

            expect(rowNamesOf(wrapper)).toEqual(['Alice', 'Bob']);
        });
    });

    describe('행 갱신 범위', () => {
        it('아이템 하나만 갱신하면 나머지 행의 DOM 노드를 그대로 유지한다', async () => {
            const wrapper = mountTable({ props: { itemKey: 'id' } });

            await nextTick();
            const firstRowElement = wrapper.findAll('tbody tr')[0].element;

            await wrapper.setProps({ items: [tableItems[0], { ...tableItems[1], name: 'Bobby' }] });

            expect(wrapper.findAll('tbody tr')[0].element).toBe(firstRowElement);
            expect(rowNamesOf(wrapper)).toEqual(['Alice', 'Bobby']);
        });

        it('정렬로 순서가 바뀌어도 행 DOM 노드를 재사용한다', async () => {
            const wrapper = mountTable({
                props: { columns: sortableColumns, items: [tableItems[1], tableItems[0]], itemKey: 'id' },
            });

            await nextTick();
            const bobRowElement = wrapper.findAll('tbody tr')[0].element;

            await wrapper.findAll('.vs-table-sort-icon')[0].trigger('click');

            expect(rowNamesOf(wrapper)).toEqual(['Alice', 'Bob']);
            expect(wrapper.findAll('tbody tr')[1].element).toBe(bobRowElement);
        });
    });

    describe('itemKey', () => {
        it('itemKey가 있으면 아이템 객체가 교체돼도 선택/확장 상태를 유지한다', async () => {
            const wrapper = mountTable({
                props: { itemKey: 'id', selectable: true },
                slots: { expand: ({ item }: { item: VsTableItem }) => h('div', {}, String(item.name)) },
            });

            await nextTick();
            await wrapper.get('tbody tr td').trigger('click');
            await wrapper.get('tbody tr button').trigger('click');
            expect(wrapper.findAll('tbody tr')[0].classes()).toContain('vs-selected');
            expect(wrapper.find('[data-testid="vs-expandable"]').exists()).toBe(true);

            await wrapper.setProps({ items: tableItems.map((item) => ({ ...item })) });

            expect(wrapper.findAll('tbody tr')[0].classes()).toContain('vs-selected');
            expect(wrapper.find('[data-testid="vs-expandable"]').exists()).toBe(true);
        });
    });

    describe('grid tracks', () => {
        const tracksOf = (wrapper: ReturnType<typeof mount>) =>
            wrapper.find('.vs-table-table').attributes('style') ?? '';

        it('ColumnDef의 width/minWidth/maxWidth를 grid-template-columns에 반영한다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: [
                        { key: 'name', label: '이름', width: 120 },
                        { key: 'age', label: '나이', minWidth: '5rem', maxWidth: '10rem' },
                    ],
                },
            });

            await nextTick();

            expect(tracksOf(wrapper)).toContain('grid-template-columns: 120px minmax(5rem, 10rem)');
        });

        it('width 지정이 없으면 기본 트랙을 사용한다', async () => {
            const wrapper = mountTable({ props: { columns: labeledColumns } });

            await nextTick();

            expect(tracksOf(wrapper)).toContain('minmax(max-content, 1fr) minmax(max-content, 1fr)');
        });

        it('drag / select / expand 트랙을 필요한 경우에만 추가한다', async () => {
            const plain = mountTable({ props: { columns: labeledColumns } });
            const full = mountTable({
                props: { columns: labeledColumns, draggable: true, selectable: true },
                slots: { expand: () => h('div') },
            });

            await nextTick();

            expect(tracksOf(plain)).toContain(
                'grid-template-columns: minmax(max-content, 1fr) minmax(max-content, 1fr)',
            );
            expect(tracksOf(full)).toContain(
                'grid-template-columns: auto auto minmax(max-content, 1fr) minmax(max-content, 1fr) auto',
            );
        });
    });

    describe('sticky header', () => {
        // thead(.vs-table-thead)는 display:contents라 박스가 없어 직접 관측할 수 없다.
        // 박스를 갖는 sentinel 마커를 관측 대상으로 삼는지 회귀로 고정한다.
        const mockIntersectionObserver = () => {
            const observed: Element[] = [];
            const callbacks: IntersectionObserverCallback[] = [];
            const original = globalThis.IntersectionObserver;
            class MockIntersectionObserver {
                constructor(callback: IntersectionObserverCallback) {
                    callbacks.push(callback);
                }
                observe(el: Element) {
                    observed.push(el);
                }
                unobserve() {}
                disconnect() {}
                takeRecords() {
                    return [];
                }
            }
            globalThis.IntersectionObserver = MockIntersectionObserver as unknown as typeof IntersectionObserver;
            return { observed, callbacks, restore: () => (globalThis.IntersectionObserver = original) };
        };

        it('display:contents인 thead가 아니라 sentinel(.vs-table-header-sentinel)을 관측한다', async () => {
            const { observed, restore } = mockIntersectionObserver();

            try {
                const wrapper = mountTable({ props: { stickyHeader: true } });
                await nextTick();
                await nextTick();

                const target = observed[observed.length - 1] as HTMLElement | undefined;
                expect(target?.classList.contains('vs-table-header-sentinel')).toBe(true);

                wrapper.unmount();
            } finally {
                restore();
            }
        });

        it('원본 헤더가 보이면 sticky 복제 헤더를 렌더링하지 않고, 벗어나면 렌더링한다', async () => {
            const { callbacks, restore } = mockIntersectionObserver();

            try {
                const wrapper = mountTable({ props: { stickyHeader: true } });
                await nextTick();
                await nextTick();

                const fire = (isIntersecting: boolean) => {
                    const callback = callbacks[callbacks.length - 1];
                    callback?.(
                        [{ isIntersecting }] as unknown as IntersectionObserverEntry[],
                        {} as IntersectionObserver,
                    );
                };

                fire(true);
                await nextTick();
                expect(wrapper.find('.vs-table-sticky-header').exists()).toBe(false);

                fire(false);
                await nextTick();
                expect(wrapper.find('.vs-table-sticky-header').exists()).toBe(true);

                wrapper.unmount();
            } finally {
                restore();
            }
        });

        it('styleSet의 $stickyHeaderTop을 sticky wrapper의 top 오프셋으로 적용한다', async () => {
            const wrapper = mountTable({ props: { stickyHeader: true, styleSet: { $stickyHeaderTop: '60px' } } });

            await nextTick();

            expect(wrapper.find('.vs-table-sticky-wrapper').attributes('style')).toContain('top: 60px');
            wrapper.unmount();
        });
    });

    describe('loading', () => {
        it('검색 입력을 비활성화한다', async () => {
            const wrapper = mountTable({ props: { search: true, loading: true } });

            await nextTick();

            expect(wrapper.find('[data-testid="search-input"]').attributes('disabled')).toBeDefined();
        });

        it('페이지네이션을 비활성화한다', async () => {
            const items = Array.from({ length: 120 }, (_, index) => ({ id: `${index}`, name: `User ${index}` }));
            const wrapper = mountTable({ props: { items, pagination: true, loading: true } });

            await nextTick();

            expect(wrapper.find('[data-testid="vs-pagination"]').attributes('disabled')).toBeDefined();
        });

        it('데이터가 있던 셀을 무너지지 않는 높이의 스켈레톤으로 대체한다', async () => {
            const wrapper = mountTable({ props: { loading: true } });

            await nextTick();

            const skeleton = wrapper.find('.vs-skeleton');
            expect(skeleton.exists()).toBe(true);
            expect(skeleton.attributes('style') ?? '').toContain('height');
        });

        it('선택 셀 클릭으로 선택되지 않는다', async () => {
            const wrapper = mountTable({ props: { selectable: true, loading: true } });

            await nextTick();
            await wrapper.get('tbody tr td').trigger('click');

            expect(wrapper.emitted('select-row')).toBeUndefined();
            expect(wrapper.emitted('update:selectedItems')).toBeUndefined();
            expect(wrapper.findAll('tbody tr')[0].classes()).not.toContain('vs-selected');
        });

        it('헤더 선택 셀 클릭으로 전체 선택되지 않는다', async () => {
            const wrapper = mountTable({ props: { selectable: true, loading: true } });

            await nextTick();
            await wrapper.get('thead th').trigger('click');

            expect(wrapper.emitted('update:selectedItems')).toBeUndefined();
        });

        it('셀 클릭으로 click-cell / click-row를 발생시키지 않는다', async () => {
            const wrapper = mountTable({ props: { loading: true } });

            await nextTick();
            await wrapper.get('tbody tr td').trigger('click');

            expect(wrapper.emitted('click-cell')).toBeUndefined();
            expect(wrapper.emitted('click-row')).toBeUndefined();
        });

        it('정렬 아이콘 클릭으로 정렬하지 않는다', async () => {
            const unsortedItems = [
                { id: '2', name: 'Bob', age: 30 },
                { id: '1', name: 'Alice', age: 24 },
            ];
            const wrapper = mountTable({ props: { columns: sortableColumns, items: unsortedItems, loading: true } });

            await nextTick();
            await wrapper.findAll('.vs-table-sort-icon')[0].trigger('click');
            await wrapper.setProps({ loading: false });

            expect(rowNamesOf(wrapper)).toEqual(['Bob', 'Alice']);
        });
    });

    describe('size', () => {
        it.each(['xs', 'sm', 'md', 'lg', 'xl'] as const)('size="%s"이면 vs-%s 클래스가 적용된다', async (size) => {
            const wrapper = mountTable({ props: { size } });

            await nextTick();

            expect(wrapper.find('.vs-table').classes()).toContain(`vs-${size}`);
        });

        it('기본 size는 md이다', async () => {
            const wrapper = mountTable();

            await nextTick();

            expect(wrapper.find('.vs-table').classes()).toContain('vs-md');
        });
    });
});
