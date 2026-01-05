import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick, reactive, ref, type Ref } from 'vue';
import { stringUtil } from '@/utils';
import { useTable } from '../composables/table-composable';
import { SortType, type BodyCell, type ColumnDef, type HeaderCell, type Item } from '../types';
import type { VsSearchInputRef } from '@/components';

function setupUseTable(
    props: {
        columns: ColumnDef[] | string[] | null;
        items: Item[];
        selectable?: ((item: Item, index?: number, items?: Item[]) => boolean) | boolean;
        expandable?: ((item: Item, index?: number, items?: Item[]) => boolean) | boolean;
    },
    options?: { searchInputRef?: Ref<VsSearchInputRef | null> },
) {
    const reactiveProps = reactive(props);
    const searchInputRef = options?.searchInputRef ?? ref<VsSearchInputRef | null>(null);
    const table = useTable(reactiveProps as any, { searchInputRef } as any);
    table.initialize();
    return { table, reactiveProps, searchInputRef };
}

describe('useTable', () => {
    beforeEach(() => {
        let seq = 0;
        vi.spyOn(stringUtil, 'createID').mockImplementation(() => `id-${seq++}`);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('문자열 컬럼을 ColumnDef 배열로 변환한다', async () => {
        const { table } = setupUseTable({
            columns: ['name', 'age'],
            items: [{ id: '1', name: 'Alice', age: 24 }],
        });

        await nextTick();

        const columns = table.columns.value as ColumnDef[] | null;
        expect(columns).toEqual([
            { key: 'name', label: 'name' },
            { key: 'age', label: 'age' },
        ]);
    });

    it('초기 마운트 시 헤더/바디 셀을 생성한다', async () => {
        const columns: ColumnDef[] = [
            { key: 'name', label: '이름' },
            { key: 'age', label: '나이' },
        ];
        const items = [
            { id: '1', name: 'Alice', age: 24 },
            { id: '2', name: 'Bob', age: 30 },
        ];
        const { table } = setupUseTable({ columns, items });

        await nextTick();

        const headerCells = table.headerCells.value as HeaderCell[];
        const bodyCells = table.bodyCells.value as BodyCell[][];

        expect(headerCells.map((h) => h.value)).toEqual(['이름', '나이']);
        expect(bodyCells).toHaveLength(2);
        expect(bodyCells[0].map((cell) => cell.value)).toEqual(['Alice', 24]);
    });

    it('컬럼과 아이템 변경을 감지해 셀을 재생성한다', async () => {
        const { table, reactiveProps } = setupUseTable({
            columns: ['name'],
            items: [{ id: '1', name: 'Alice' }],
        });

        await nextTick();

        reactiveProps.columns = ['title'];
        reactiveProps.items = [{ id: '99', title: '새 항목' }];
        await nextTick();

        const columns = table.columns.value as ColumnDef[] | null;
        const bodyCells = table.bodyCells.value as BodyCell[][];

        expect(columns?.map((c) => c.key)).toEqual(['title']);
        expect(bodyCells[0][0]).toMatchObject({ value: '새 항목', colKey: 'title' });
    });

    it('선택 가능한 행이 있을 때 전체 선택/해제를 토글한다', async () => {
        const { table } = setupUseTable({
            columns: ['name'],
            items: [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' },
            ],
            selectable: () => true,
        });

        await nextTick();

        expect(table.anySelectable.value).toBe(true);
        expect(table.selectedAll.value).toBe(false);

        table.toggleSelectAll();
        await nextTick();

        expect(table.selectedIds.value).toEqual(['1', '2']);
        expect(table.selectedAll.value).toBe(true);

        table.toggleSelectAll();
        await nextTick();

        expect(table.selectedIds.value).toEqual([]);
        expect(table.selectedAll.value).toBe(false);
    });

    it('selectable이 false인 행은 전체 선택에서 제외하고 부분 선택 상태를 계산한다', async () => {
        const { table } = setupUseTable({
            columns: null,
            items: [
                { id: '1', name: 'Alice' },
                { id: '2', name: 'Bob' },
                { id: '3', name: 'Carol' },
            ],
            selectable: (item) => item.id !== '2',
        });

        await nextTick();

        table.toggleSelectAll();
        await nextTick();

        expect(table.selectedIds.value).toEqual(['1', '3']);
        expect(table.selectedAll.value).toBe(true);

        table.selectedIds.value = ['1'];
        await nextTick();

        expect(table.selectedPartial.value).toBe(true);
        expect(table.selectedAll.value).toBe(false);
    });

    it('skipSearch가 지정된 컬럼은 검색 대상에서 제외된다', async () => {
        const { table, searchInputRef } = setupUseTable({
            columns: [
                { key: 'id', label: 'ID', skipSearch: true },
                { key: 'name', label: '이름' },
            ],
            items: [
                { id: 'XYZ-1', name: 'Carol' },
                { id: 'ABC-2', name: 'XYZ 사용자' },
            ],
        });
        await nextTick();

        searchInputRef.value = {
            match: (value: string) => String(value).includes('XYZ'),
        } as any;
        await nextTick();

        const filteredNames = table.bodyCells.value.map((row) => row[1].value);
        expect(filteredNames).toEqual(['XYZ 사용자']);
    });

    describe('expandable', () => {
        it('expandable이 true인 행은 토글 시 isExpanded가 변경된다', async () => {
            const { table } = setupUseTable({
                columns: ['name'],
                items: [{ id: '1', name: 'Alice' }],
                expandable: () => true,
            });

            await nextTick();
            const row = table.bodyCells.value[0];

            expect(table.anyExpandable.value).toBe(true);
            expect(table.isExpanded(row)).toBe(false);

            expect(table.toggleExpand(row)).toBe(true);
            expect(table.isExpanded(row)).toBe(true);

            expect(table.toggleExpand(row)).toBe(false);
            expect(table.isExpanded(row)).toBe(false);
        });

        it('expandable 조건을 만족하지 않으면 토글되지 않는다', async () => {
            const { table } = setupUseTable({
                columns: ['name'],
                items: [{ id: '1', name: 'Alice' }],
                expandable: () => false,
            });

            await nextTick();
            const row = table.bodyCells.value[0];

            expect(table.anyExpandable.value).toBe(false);
            expect(table.toggleExpand(row)).toBe(false);
            expect(table.isExpanded(row)).toBe(false);
        });
    });
    describe('정렬', () => {
        const sortableColumns: ColumnDef[] = [
            { key: 'id', label: 'ID', sortable: true },
            { key: 'name', label: '이름', sortable: true },
        ];

        const getNames = (table: ReturnType<typeof useTable>) => table.bodyCells.value.map((row) => row[1].value);

        it('초기 상태는 NONE이며 원본 순서를 유지한다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '2', name: 'Bob' },
                    { id: '1', name: 'Alice' },
                ],
            });
            await nextTick();

            expect(table.sortType.value).toBe(SortType.NONE);
            expect(getNames(table)).toEqual(['Bob', 'Alice']);
        });

        it('오름차순 정렬 시 작은 값이 먼저 온다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '2', name: 'Bob' },
                    { id: '1', name: 'Alice' },
                ],
            });
            await nextTick();

            table.updateSortType('id');
            await nextTick();

            expect(table.sortType.value).toBe(SortType.ASCEND);
            expect(getNames(table)).toEqual(['Alice', 'Bob']);
        });

        it('내림차순 정렬 시 큰 값이 먼저 온다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '1', name: 'Alice' },
                    { id: '2', name: 'Bob' },
                ],
            });
            await nextTick();

            table.updateSortType('id'); // ASCEND
            table.updateSortType('id'); // DESCEND
            await nextTick();

            expect(table.sortType.value).toBe(SortType.DESCEND);
            expect(getNames(table)).toEqual(['Bob', 'Alice']);
        });

        it('NONE으로 돌아오면 원본 순서로 복원된다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '2', name: 'Bob' },
                    { id: '1', name: 'Alice' },
                ],
            });
            await nextTick();

            table.updateSortType('id'); // ASCEND
            table.updateSortType('id'); // DESCEND
            table.updateSortType('id'); // NONE
            await nextTick();

            expect(table.sortType.value).toBe(SortType.NONE);
            expect(getNames(table)).toEqual(['Bob', 'Alice']);
        });

        it('다른 컬럼 클릭 시 해당 컬럼 기준으로 정렬된다', async () => {
            const { table } = setupUseTable({
                columns: sortableColumns,
                items: [
                    { id: '1', name: 'Bob' },
                    { id: '2', name: 'Alice' },
                ],
            });
            await nextTick();

            table.updateSortType('name');
            await nextTick();

            expect(table.sortColumn.value?.key).toBe('name');
            expect(getNames(table)).toEqual(['Alice', 'Bob']);
        });
    });
});
