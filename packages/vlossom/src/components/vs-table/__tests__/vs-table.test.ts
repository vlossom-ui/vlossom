import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import { stringUtil } from '@/utils';
import VsTable from './../VsTable.vue';
import type { BodyCell, HeaderCell } from './../types';

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

    describe('다양한 방식의 Cell Slot과 Slot 우선순위', () => {
        it('`header-${colKey}` Slot이 기본 렌더링보다 우선한다', async () => {
            const wrapper = mountTable({
                slots: {
                    'header-name': ({ header }: { header: HeaderCell }) => `HEADER-${header.colKey}`,
                    'body-name': ({ item }: { item: BodyCell['item'] }) => `BODY-NAME-${item.name}`,
                    'body-age': ({ item }: { item: BodyCell['item'] }) => `BODY-AGE-${item.age}`,
                },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['HEADER-name', 'age']);
            expect(bodyTextsOf(wrapper)).toEqual(['BODY-NAME-Alice', 'BODY-AGE-24', 'BODY-NAME-Bob', 'BODY-AGE-30']);
        });

        it('`header-${id}` Slot이 `header-${colKey}` Slot보다 우선한다', async () => {
            const wrapper = mountTable({
                slots: {
                    'header-name-id-0': ({ header }: { header: HeaderCell }) => `ID-${header.id}`,
                    'header-name': ({ header }: { header: HeaderCell }) => `COL-${header.colKey}`,
                },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['ID-name-id-0', 'age']);
        });

        it('`body-col${colIdx}-row${rowIdx}` Slot이 `body-${colKey}` Slot보다 우선한다', async () => {
            const wrapper = mountTable({
                slots: {
                    'body-age': ({ item }: { item: BodyCell['item'] }) => `AGE-${item.age}`,
                    'body-col1-row0': () => 'ROWCOL-OVERRIDE',
                },
            });

            await nextTick();

            expect(bodyTextsOf(wrapper)).toEqual(['Alice', 'AGE-24', 'Bob', 'AGE-30']);
        });

        it('"header", "body" Slot은 전체 셀에 대한 slot을 제공하며 최후 fallback으로 적용된다', async () => {
            const wrapper = mountTable({
                slots: {
                    header: ({ header }: { header: HeaderCell }) => `HEADER-${header.colIdx}-${header.colKey}`,
                    body: ({ item }: { item: BodyCell['item'] }) => `BODY-${item.id}`,
                },
            });

            await nextTick();

            expect(headerTextsOf(wrapper)).toEqual(['HEADER-0-name', 'HEADER-1-age']);
            expect(bodyTextsOf(wrapper)).toEqual(['BODY-1', 'BODY-1', 'BODY-2', 'BODY-2']);
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

            const [cell, event] = emitted![0] as [BodyCell, Event];
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

            const [cells, event] = emitted![0] as [BodyCell[], Event];
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

            const [selectCells] = emittedSelect![0] as [BodyCell[], Event];
            const [clickCell] = emittedClickCell![0] as [BodyCell, Event];

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
    });
});
