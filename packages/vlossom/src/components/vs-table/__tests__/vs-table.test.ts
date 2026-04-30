import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { h, nextTick } from 'vue';
import { stringUtil } from '@/utils';
import VsTable from './../VsTable.vue';
import type { VsTableBodyCell, VsTableItem, VsTableColumnDef } from './../types';
import { DEFAULT_PAGE_SIZE } from './../constants';

const defaultColumns = ['name', 'age'];
const labeledColumns = [
    { key: 'name', label: '이름' },
    { key: 'age', label: '나이' },
];
const tableItems = [
    { id: '1', name: 'Alice', age: 24 },
    { id: '2', name: 'Bob', age: 30 },
];

const defaultGlobal = {
    stubs: {
        'vs-render': true,
        'vs-checkbox': true,
        'vs-visible-render': { props: ['disabled', 'selector', 'rootMargin'], template: '<div><slot /></div>' },
        'vs-button': { template: '<button data-testid="vs-button"><slot /></button>' },
        'vs-expandable': { props: ['open'], template: '<div v-if="open" data-testid="vs-expandable"><slot /></div>' },
        'vs-pagination': {
            props: ['modelValue', 'length', 'showingLength', 'edgeButtons'],
            emits: ['update:modelValue', 'change'],
            template:
                '<button data-testid="vs-pagination" @click="$emit(\'update:modelValue\', modelValue + 1); $emit(\'change\', modelValue + 1)">Pagination</button>',
        },
        'vs-select': {
            props: ['modelValue', 'options'],
            template: '<select data-testid="vs-select" ></select>',
        },
        vuedraggable: {
            props: ['modelValue', 'itemKey', 'disabled'],
            template:
                '<tbody data-testid="draggable-wrapper" :data-disabled="disabled"><slot name="item" v-for="(element, index) in modelValue" :key="index" :element="element" :index="index" /><slot /></tbody>',
        },
        draggable: {
            props: ['modelValue', 'itemKey', 'disabled'],
            template:
                '<tbody data-testid="draggable-wrapper" :data-disabled="disabled"><slot name="item" v-for="(element, index) in modelValue" :key="index" :element="element" :index="index" /><slot /></tbody>',
        },
    },
};

const mountTable = (options: { props?: Record<string, unknown>; slots?: Record<string, any> } = {}) =>
    mount(VsTable, {
        props: {
            columns: defaultColumns,
            items: tableItems,
            ...(options.props ?? {}),
        },
        slots: options.slots,
        global: defaultGlobal,
    });

const headerTextsOf = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('th').map((th) => th.text());
const bodyTextsOf = (wrapper: ReturnType<typeof mount>) => wrapper.findAll('tbody td').map((td) => td.text());

describe('VsTable', () => {
    beforeEach(() => {
        let seq = 0;
        vi.spyOn(stringUtil, 'createID').mockImplementation(() => `id-${seq++}`);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('기본 렌더링', () => {
        it('caption 슬롯을 렌더링한다', async () => {
            const wrapper = mountTable({
                slots: {
                    caption: '<span>사용자 목록</span>',
                },
            });

            await nextTick();

            expect(wrapper.find('caption').text()).toBe('사용자 목록');
        });

        it('컬럼 정의와 아이템을 기반으로 헤더와 바디 셀을 렌더링한다', async () => {
            const wrapper = mountTable({
                props: { columns: labeledColumns },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['이름', '나이']);
            expect(wrapper.findAll('tbody tr')).toHaveLength(tableItems.length);
            expect(
                wrapper
                    .findAll('tbody tr')[0]
                    .findAll('td')
                    .map((td) => td.text()),
            ).toEqual(['Alice', '24']);
        });
    });

    describe('empty slot', () => {
        it('items가 비어있고 empty 슬롯이 제공되면 슬롯 내용이 렌더링된다', async () => {
            const wrapper = mountTable({
                props: { items: [] },
                slots: {
                    empty: '<div data-testid="empty-slot">No matching results</div>',
                },
            });

            await nextTick();

            expect(wrapper.find('[data-testid="empty-slot"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="empty-slot"]').text()).toBe('No matching results');
            expect(wrapper.find('.vs-table-no-data-text').exists()).toBe(false);
        });

        it('items가 비어있고 empty 슬롯이 없으면 기본 NO DATA 자리표시자가 렌더링된다', async () => {
            const wrapper = mountTable({
                props: { items: [] },
            });

            await nextTick();

            expect(wrapper.find('.vs-table-no-data-text').text()).toBe('NO DATA');
        });

        it('loading이면 empty 슬롯보다 로딩 인디케이터가 우선 표시된다', async () => {
            const wrapper = mountTable({
                props: { items: [], loading: true },
                slots: {
                    empty: '<div data-testid="empty-slot">No matching results</div>',
                },
            });

            await nextTick();

            expect(wrapper.find('[data-testid="empty-slot"]').exists()).toBe(false);
        });
    });

    describe('다양한 방식의 Cell Slot과 Slot 우선순위', () => {
        it('`header-${colKey}` Slot이 기본 렌더링보다 우선한다', async () => {
            const wrapper = mountTable({
                slots: {
                    'header-name': ({ item }: { item: VsTableColumnDef }) => `HEADER-${item.key}`,
                    'body-name': ({ item }: { item: VsTableBodyCell['item'] }) => `BODY-NAME-${item.name}`,
                    'body-age': ({ item }: { item: VsTableBodyCell['item'] }) => `BODY-AGE-${item.age}`,
                },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['HEADER-name', 'age']);
            expect(bodyTextsOf(wrapper)).toEqual(['BODY-NAME-Alice', 'BODY-AGE-24', 'BODY-NAME-Bob', 'BODY-AGE-30']);
        });

        it('`header-${id}` Slot이 `header-${colKey}` Slot보다 우선한다', async () => {
            const wrapper = mountTable({
                slots: {
                    'header-name-id-6': ({ value }: { value: unknown }) => `ID-${value}`,
                    'header-name': ({ item }: { item: VsTableColumnDef }) => `COL-${item.key}`,
                },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['ID-name', 'age']);
        });

        it('`body-col${colIdx}-row${rowIdx}` Slot이 `body-${colKey}` Slot보다 우선한다', async () => {
            const wrapper = mountTable({
                slots: {
                    'body-age': ({ item }: { item: VsTableBodyCell['item'] }) => `AGE-${item.age}`,
                    'body-col1-row0': () => 'ROWCOL-OVERRIDE',
                },
            });

            await nextTick();

            expect(bodyTextsOf(wrapper)).toEqual(['Alice', 'AGE-24', 'Bob', 'AGE-30']);
        });

        it('"header", "body" Slot은 전체 셀에 대한 slot을 제공하며 최후 fallback으로 적용된다', async () => {
            const wrapper = mountTable({
                slots: {
                    header: ({ colIdx, item }: { colIdx: number; item: VsTableColumnDef }) =>
                        `HEADER-${colIdx}-${item.key}`,
                    body: ({ item }: { item: VsTableBodyCell['item'] }) => `BODY-${item.id}`,
                },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['HEADER-0-name', 'HEADER-1-age']);
            expect(bodyTextsOf(wrapper)).toEqual(['BODY-1', 'BODY-1', 'BODY-2', 'BODY-2']);
        });

        it('camelCase colKey가 literal 형태의 Slot 이름과 매칭된다', async () => {
            // given
            const camelCaseColumns = ['firstName', 'lastName'];
            const camelCaseItems = [
                { id: '1', firstName: 'Alice', lastName: 'Kim' },
                { id: '2', firstName: 'Bob', lastName: 'Park' },
            ];

            // when
            const wrapper = mountTable({
                props: { columns: camelCaseColumns, items: camelCaseItems },
                slots: {
                    'header-firstName': ({ item }: { item: VsTableColumnDef }) => `HEAD-${item.key}`,
                    'body-firstName': ({ item }: { item: VsTableBodyCell['item'] }) => `FIRST-${item.firstName}`,
                },
            });

            await nextTick();

            // then
            expect(headerTextsOf(wrapper)).toEqual(['HEAD-firstName', 'lastName']);
            expect(bodyTextsOf(wrapper)).toEqual(['FIRST-Alice', 'Kim', 'FIRST-Bob', 'Park']);
        });

        it('literal colKey와 kebab-case Slot이 모두 있으면 literal Slot이 우선한다', async () => {
            // given
            const camelCaseColumns = ['firstName'];
            const camelCaseItems = [{ id: '1', firstName: 'Alice' }];

            // when
            const wrapper = mountTable({
                props: { columns: camelCaseColumns, items: camelCaseItems },
                slots: {
                    'body-firstName': () => 'LITERAL',
                    'body-first-name': () => 'KEBAB',
                },
            });

            await nextTick();

            // then
            expect(bodyTextsOf(wrapper)).toEqual(['LITERAL']);
        });
    });

    describe('expandable', () => {
        it('expandable이 true면 확장 버튼과 슬롯을 렌더링한다.', async () => {
            const wrapper = mountTable({
                props: { expandable: true },
                slots: {
                    expand: ({ item, rowIdx }: { item: VsTableItem; rowIdx: number }) =>
                        h('div', {}, `${rowIdx}-${item.name}`),
                },
            });

            await nextTick();

            const expandButtons = wrapper.findAll('tbody tr button');
            expect(expandButtons).toHaveLength(tableItems.length);

            await expandButtons[0].trigger('click');
            await nextTick();

            const expandedContent = wrapper.find('[data-testid="vs-expandable"]');
            expect(expandedContent.text()).toBe('0-Alice');
        });

        it('expandable이 true면 확장 버튼을 클릭하면 expand-row를 발생시킨다', async () => {
            const wrapper = mountTable({
                props: { expandable: true },
                slots: {
                    expand: () => h('div'),
                },
            });

            await nextTick();
            const expandButton = wrapper.get('tbody tr button');

            await expandButton.trigger('click');

            const emitted = wrapper.emitted('expand-row');
            expect(emitted).toHaveLength(1);

            const [cells] = emitted![0] as [VsTableBodyCell[], Event];
            expect(cells).toHaveLength(defaultColumns.length);
            expect(cells[0]).toMatchObject({ colKey: 'name', value: 'Alice', rowIdx: 0, colIdx: 0 });
            expect(cells[0].item).toStrictEqual(tableItems[0]);
        });

        it('expand 슬롯이 없으면 expandable이 true여도 확장 버튼이 렌더링되지 않는다', async () => {
            const wrapper = mountTable({
                props: { expandable: true },
            });

            await nextTick();

            expect(wrapper.findAll('tbody tr button')).toHaveLength(0);
            expect(wrapper.find('.vs-table-expand-handle').exists()).toBe(false);
        });

        it('expandable이 false이면 expand 슬롯이 있어도 확장 UI가 렌더링되지 않는다', async () => {
            const wrapper = mountTable({
                props: { expandable: false },
                slots: {
                    expand: () => h('div'),
                },
            });

            await nextTick();

            expect(wrapper.findAll('tbody tr button')).toHaveLength(0);
            expect(wrapper.find('.vs-table-expand-handle').exists()).toBe(false);
        });

        it('expandable prop을 지정하지 않아도 expand 슬롯만 있으면 확장 UI가 렌더링된다 (기본값 true)', async () => {
            const wrapper = mountTable({
                slots: {
                    expand: ({ item }: { item: VsTableItem }) => h('div', {}, String(item.name)),
                },
            });

            await nextTick();

            expect(wrapper.findAll('tbody tr button')).toHaveLength(tableItems.length);
        });
    });

    describe('pagination', () => {
        it('pagination을 활성화하면 페이지네이션과 페이지 크기 셀렉터를 렌더링한다', async () => {
            const wrapper = mountTable({
                props: { pagination: true },
            });

            await nextTick();

            expect(wrapper.find('[data-testid="vs-pagination"]').exists()).toBe(true);
            expect(wrapper.find('[data-testid="vs-select"]').exists()).toBe(true);
        });

        it('vs-pagination change 이벤트를 paginate로 전달한다', async () => {
            const wrapper = mountTable({
                props: { pagination: true },
            });

            await nextTick();
            await wrapper.get('[data-testid="vs-pagination"]').trigger('click');

            const emitted = wrapper.emitted('paginate');
            expect(emitted).toHaveLength(1);
            const [page, pageSize] = emitted![0] as [number, number];
            expect(page).toBe(1);
            expect(pageSize).toBe(DEFAULT_PAGE_SIZE);
        });

        describe('server mode', () => {
            it('서버 모드를 활성화하면 totalItemCount 기반으로 pagination을 렌더링한다', async () => {
                const serverItems = Array.from({ length: 10 }, (_, i) => ({
                    id: `${i}`,
                    name: `User ${i}`,
                    age: 20 + i,
                }));

                const wrapper = mountTable({
                    props: {
                        items: serverItems,
                        pagination: {
                            totalItemCount: 500,
                        },
                        serverMode: true,
                        pageSize: 10,
                    },
                });

                await nextTick();

                expect(wrapper.find('[data-testid="vs-pagination"]').exists()).toBe(true);
                expect(wrapper.findAll('tbody tr')).toHaveLength(10);
            });

            it('서버 모드에서 페이지 변경 시 paginate 이벤트를 발생시킨다', async () => {
                const serverItems = Array.from({ length: 10 }, (_, i) => ({
                    id: `${i}`,
                    name: `User ${i}`,
                    age: 20 + i,
                }));

                const wrapper = mountTable({
                    props: {
                        items: serverItems,
                        pagination: {
                            totalItemCount: 100,
                        },
                        serverMode: true,
                        page: 0,
                        pageSize: 10,
                    },
                });

                await nextTick();
                await wrapper.get('[data-testid="vs-pagination"]').trigger('click');

                const emitted = wrapper.emitted('paginate');
                expect(emitted).toHaveLength(1);
                const [page, pageSize] = emitted![0] as [number, number];
                expect(page).toBe(1);
                expect(pageSize).toBe(10);
            });

            it('서버 모드에서 totalItemCount가 없으면 에러가 발생한다', async () => {
                const serverItems = Array.from({ length: 10 }, (_, i) => ({
                    id: `${i}`,
                    name: `User ${i}`,
                    age: 20 + i,
                }));

                const wrapper = mountTable({
                    props: {
                        items: serverItems,
                        pagination: true,
                        serverMode: true,
                        page: 0,
                        pageSize: 10,
                    },
                });

                await nextTick();

                expect(wrapper.vm.$el.querySelector('.vs-table-pagination')).toBeTruthy();
            });

            it('서버 모드에서는 client-side pagination을 수행하지 않고 모든 items를 렌더링한다', async () => {
                const serverItems = Array.from({ length: 15 }, (_, i) => ({
                    id: `${i}`,
                    name: `User ${i}`,
                    age: 20 + i,
                }));

                const wrapper = mountTable({
                    props: {
                        items: serverItems,
                        pagination: {
                            totalItemCount: 150,
                        },
                        serverMode: true,
                        page: 1,
                        pageSize: 10,
                    },
                });

                await nextTick();

                expect(wrapper.findAll('tbody tr')).toHaveLength(15);
            });
        });
    });

    describe('emits', () => {
        it('셀 클릭 시 click-cell 이벤트를 발생시킨다', async () => {
            const wrapper = mountTable();

            await nextTick();
            const firstCell = wrapper.get('tbody td');

            await firstCell.trigger('click');

            const emitted = wrapper.emitted('click-cell');
            expect(emitted).toHaveLength(1);

            const [cell, event] = emitted![0] as [VsTableBodyCell, Event];
            expect(event).toBeInstanceOf(Event);
            expect((event as Event).type).toBe('click');
            expect(cell).toMatchObject({
                colKey: 'name',
                value: 'Alice',
                rowIdx: 0,
                colIdx: 0,
            });
            expect(cell.item).toStrictEqual(tableItems[0]);
        });

        it('선택 셀 클릭 시 select-row 이벤트를 발생시킨다', async () => {
            const wrapper = mountTable({
                props: { selectable: true },
            });

            await nextTick();
            const selectCell = wrapper.get('tbody tr td');

            await selectCell.trigger('click');

            const emitted = wrapper.emitted('select-row');
            expect(emitted).toHaveLength(1);

            const [cells, event] = emitted![0] as [VsTableBodyCell[], Event];
            expect(event).toBeInstanceOf(Event);
            expect((event as Event).type).toBe('click');
            expect(cells).toHaveLength(2);
            expect(cells[0]).toMatchObject({ colKey: 'name', value: 'Alice', rowIdx: 0, colIdx: 0 });
            expect(cells[1]).toMatchObject({ colKey: 'age', value: 24, rowIdx: 0, colIdx: 1 });
        });

        it('선택 셀 클릭 시 click-cell도 함께 발생한다', async () => {
            const wrapper = mountTable({
                props: { selectable: true },
            });

            await nextTick();
            const selectCell = wrapper.get('tbody tr td');

            await selectCell.trigger('click');

            const emittedSelect = wrapper.emitted('select-row');
            const emittedClickCell = wrapper.emitted('click-cell');

            expect(emittedSelect).toHaveLength(1);
            expect(emittedClickCell).toHaveLength(1);

            const [selectCells] = emittedSelect![0] as [VsTableBodyCell[], Event];
            const [clickCell] = emittedClickCell![0] as [VsTableBodyCell, Event];

            expect(selectCells[0]).toMatchObject(clickCell);
        });

        it('selectable이 false를 반환하면 select-row가 발생하지 않는다', async () => {
            const wrapper = mountTable({
                props: {
                    selectable: () => false,
                },
            });

            await nextTick();
            const selectCell = wrapper.get('tbody tr td');

            await selectCell.trigger('click');

            expect(wrapper.emitted('select-row')).toBeUndefined();
        });

        it('expand 버튼 클릭 시 expand-row 이벤트를 발생시킨다', async () => {
            const wrapper = mountTable({
                props: { expandable: true },
                slots: {
                    expand: () => h('div'),
                },
            });

            await nextTick();
            const expandButton = wrapper.get('tbody tr button');

            await expandButton.trigger('click');

            const emittedExpandRow = wrapper.emitted('expand-row');
            expect(emittedExpandRow).toHaveLength(1);

            const [emittedCells, emittedEvent] = emittedExpandRow![0] as [VsTableBodyCell[], Event];
            expect(emittedEvent).toBeInstanceOf(Event);
            expect(emittedCells[0]).toMatchObject({ colKey: 'name', value: 'Alice', rowIdx: 0 });
        });

        it('검색 입력 시 search 이벤트를 발생시킨다', async () => {
            const wrapper = mount(VsTable, {
                props: {
                    columns: defaultColumns,
                    items: tableItems,
                    search: true,
                },
                global: {
                    stubs: {
                        ...defaultGlobal.stubs,
                        'vs-search-input': {
                            template: '<input data-testid="search-input" @input="emitSearch" />',
                            methods: {
                                match: () => true,
                                emitSearch(event: Event) {
                                    this.$emit('search', (event.target as HTMLInputElement).value);
                                },
                            },
                        },
                    },
                },
            });

            await nextTick();

            await wrapper.get('[data-testid="search-input"]').setValue('Alice');

            const emittedSearchRows = wrapper.emitted('search');
            expect(emittedSearchRows).toHaveLength(1);

            const [emittedItems, emittedSearchText] = emittedSearchRows![0] as [VsTableItem[], string];
            expect(emittedSearchText).toBe('Alice');
            expect(emittedItems).toHaveLength(tableItems.length);
            expect(emittedItems[0]).toMatchObject({ id: '1', name: 'Alice', age: 24 });
            expect(emittedItems[1]).toMatchObject({ id: '2', name: 'Bob', age: 30 });
        });
    });

    describe('loading', () => {
        it('loading이 true면 검색 입력이 비활성화된다', async () => {
            const wrapper = mount(VsTable, {
                props: {
                    columns: defaultColumns,
                    items: tableItems,
                    search: true,
                    loading: true,
                },
                global: {
                    stubs: {
                        ...defaultGlobal.stubs,
                        'vs-search-input': {
                            props: ['disabled'],
                            template: '<input data-testid="search-input" :disabled="disabled" />',
                            methods: {
                                match: () => true,
                            },
                        },
                    },
                },
            });

            await nextTick();

            const searchInput = wrapper.find('[data-testid="search-input"]');
            expect(searchInput.exists()).toBe(true);
            expect(searchInput.attributes('disabled')).toBeDefined();
        });

        it('loading이 true면 페이지네이션 버튼이 비활성화된다', async () => {
            const wrapper = mount(VsTable, {
                props: {
                    columns: defaultColumns,
                    items: Array.from({ length: 40 }, (_, i) => ({ id: '' + i, name: `User ${i}`, age: i })),
                    pagination: true,
                    loading: true,
                },
                global: {
                    stubs: {
                        ...defaultGlobal.stubs,
                        'vs-pagination': {
                            props: ['modelValue', 'length', 'showingLength', 'edgeButtons', 'disabled'],
                            template: '<button data-testid="vs-pagination" :disabled="!!disabled">Pagination</button>',
                        },
                    },
                },
            });

            await nextTick();

            const paginationBtn = wrapper.find('[data-testid="vs-pagination"]');
            expect(paginationBtn.exists()).toBe(true);
            expect(paginationBtn.attributes('disabled')).toBeDefined();
        });
    });

    describe('v-model', () => {
        it('selectedItems 속성을 사용하여 선택된 아이템을 관리한다', async () => {
            const wrapper = mountTable({
                props: { selectable: () => true, selectedItems: tableItems },
            });

            await nextTick();

            expect(wrapper.props('selectedItems')).toEqual(tableItems);
        });

        it('update:selectedItems 이벤트를 통해 선택된 아이템을 관리한다', async () => {
            const wrapper = mountTable({
                props: { selectable: () => true },
            });

            wrapper.vm.updateSelectedItems(tableItems);
            await nextTick();

            expect(wrapper.emitted('update:selectedItems')).toHaveLength(1);
            expect(wrapper.emitted('update:selectedItems')![0]).toEqual([tableItems]);
        });

        it('selectedItems 속성이 변경되면 update:selectedItems 이벤트를 발생시킨다', async () => {
            const wrapper = mountTable({
                props: { selectable: () => true },
            });

            wrapper.setProps({ selectedItems: tableItems });
            await nextTick();

            expect(wrapper.emitted('update:selectedItems')).toHaveLength(1);
            expect(wrapper.emitted('update:selectedItems')![0]).toEqual([tableItems]);
        });

        it('page prop을 사용하여 초기 페이지를 설정한다', async () => {
            const largeItems = Array.from({ length: 100 }, (_, i) => ({
                id: `${i}`,
                name: `User ${i}`,
                age: 20 + i,
            }));

            const wrapper = mountTable({
                props: {
                    items: largeItems,
                    pagination: { pageSize: 10 },
                    page: 2,
                },
            });

            await nextTick();

            expect(wrapper.props('page')).toBe(2);
        });

        it('vs-pagination 변경 시 update:page 이벤트를 발생시킨다', async () => {
            const largeItems = Array.from({ length: 100 }, (_, i) => ({
                id: `${i}`,
                name: `User ${i}`,
                age: 20 + i,
            }));

            const wrapper = mountTable({
                props: {
                    items: largeItems,
                    pagination: true,
                    page: 0,
                },
            });

            await nextTick();

            await wrapper.get('[data-testid="vs-pagination"]').trigger('click');
            await nextTick();

            const emitted = wrapper.emitted('update:page');
            expect(emitted).toBeDefined();
            expect(emitted!.length).toBeGreaterThan(0);
        });

        it('초기 page와 pageSize가 반영되어 해당 페이지 아이템을 렌더링한다', async () => {
            const items = Array.from({ length: 30 }, (_, i) => ({
                id: `${i}`,
                name: `User ${i + 1}`,
                age: 20 + i,
            }));

            const wrapper = mountTable({
                props: { pagination: true, pageSize: 10, page: 2, items },
            });

            await nextTick();

            const cells = bodyTextsOf(wrapper);
            expect(cells[0]).toBe('User 21'); // page=2, pageSize=10 → 21번째 아이템부터
            expect(wrapper.emitted('update:page')).toBeUndefined();
        });
    });

    describe('ColumnDef width/minWidth/maxWidth', () => {
        it('width가 정의된 컬럼은 grid-template-columns에 고정 크기로 반영된다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: [
                        { key: 'name', label: 'Name', width: '200px' },
                        { key: 'age', label: 'Age' },
                    ],
                },
            });

            await nextTick();

            const headerRow = wrapper.find('thead tr');
            const style = headerRow.attributes('style') ?? '';
            expect(style).toContain('200px');
            expect(style).toContain('1fr');
        });

        it('minWidth만 정의된 컬럼은 minmax(min, 1fr)로 반영된다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: [
                        { key: 'name', label: 'Name', minWidth: '150px' },
                        { key: 'age', label: 'Age' },
                    ],
                },
            });

            await nextTick();

            const headerRow = wrapper.find('thead tr');
            const style = headerRow.attributes('style') ?? '';
            expect(style).toContain('minmax(150px, 1fr)');
        });

        it('maxWidth만 정의된 컬럼은 minmax(auto, max)로 반영된다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: [
                        { key: 'name', label: 'Name', maxWidth: '300px' },
                        { key: 'age', label: 'Age' },
                    ],
                },
            });

            await nextTick();

            const headerRow = wrapper.find('thead tr');
            const style = headerRow.attributes('style') ?? '';
            expect(style).toContain('minmax(auto, 300px)');
        });

        it('minWidth와 maxWidth가 모두 정의된 컬럼은 minmax(min, max)로 반영된다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: [
                        { key: 'name', label: 'Name', minWidth: '100px', maxWidth: '400px' },
                        { key: 'age', label: 'Age' },
                    ],
                },
            });

            await nextTick();

            const headerRow = wrapper.find('thead tr');
            const style = headerRow.attributes('style') ?? '';
            expect(style).toContain('minmax(100px, 400px)');
        });

        it('숫자 타입의 width는 px 단위로 변환되어 반영된다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: [
                        { key: 'name', label: 'Name', width: 250 },
                        { key: 'age', label: 'Age' },
                    ],
                },
            });

            await nextTick();

            const headerRow = wrapper.find('thead tr');
            const style = headerRow.attributes('style') ?? '';
            expect(style).toContain('250px');
        });

        it('width/minWidth/maxWidth가 없는 컬럼은 기본값 1fr로 반영된다', async () => {
            const wrapper = mountTable({
                props: {
                    columns: [
                        { key: 'name', label: 'Name' },
                        { key: 'age', label: 'Age' },
                    ],
                },
            });

            await nextTick();

            const headerRow = wrapper.find('thead tr');
            const style = headerRow.attributes('style') ?? '';
            expect(style).toContain('grid-template-columns: 1fr 1fr');
        });
    });

    describe('draggable', () => {
        it('draggable prop이 true이면 draggable wrapper가 렌더링된다', async () => {
            const wrapper = mountTable({
                props: {
                    draggable: true,
                },
            });

            await nextTick();

            expect(wrapper.find('[data-testid="draggable-wrapper"]').exists()).toBe(true);
        });

        it('draggable이 false이면 draggable wrapper는 렌더링되지만 drag handle이 표시되지 않는다', async () => {
            const wrapper = mountTable({
                props: {
                    draggable: false,
                },
            });

            await nextTick();

            expect(wrapper.find('[data-testid="draggable-wrapper"]').exists()).toBe(true);
        });

        it('loading이 true이면 draggable이 비활성화된다', async () => {
            const wrapper = mountTable({
                props: {
                    draggable: true,
                    loading: true,
                },
            });

            await nextTick();

            const draggableWrapper = wrapper.find('[data-testid="draggable-wrapper"]');
            expect(draggableWrapper.exists()).toBe(true);
            expect(draggableWrapper.attributes('data-disabled')).toBe('true');
        });

        it('drag 이벤트가 발생하면 부모에게 drag 이벤트를 전달한다', async () => {
            const wrapper = mountTable({
                props: {
                    draggable: true,
                },
            });

            await nextTick();

            const draggableWrapper = wrapper.find('[data-testid="draggable-wrapper"]');
            expect(draggableWrapper.exists()).toBe(true);
            expect(draggableWrapper.attributes('data-disabled')).toBe('false');

            expect(wrapper.props('draggable')).toBe(true);
        });
    });
});
