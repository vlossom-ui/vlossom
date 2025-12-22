import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick, reactive } from 'vue';
import { stringUtil } from '@/utils';
import { useTable } from '../composables/table-composable';
import type { BodyCell, ColumnDef, HeaderCell, Item } from '../types';

function setupUseTable(props: {
    columns: ColumnDef[] | string[] | null;
    items: Item[];
    selectable?: ((item: Item, index?: number, items?: Item[]) => boolean) | boolean;
}) {
    const reactiveProps = reactive(props);
    const table = useTable(reactiveProps as any);
    table.initialize();
    return { table, reactiveProps };
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

        table.toggleSelectedAll();
        await nextTick();

        expect(table.selectedIds.value).toEqual(['1', '2']);
        expect(table.selectedAll.value).toBe(true);

        table.toggleSelectedAll();
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

        table.toggleSelectedAll();
        await nextTick();

        expect(table.selectedIds.value).toEqual(['1', '3']);
        expect(table.selectedAll.value).toBe(true);

        table.selectedIds.value = ['1'];
        await nextTick();

        expect(table.partiallySelected.value).toBe(true);
        expect(table.selectedAll.value).toBe(false);
    });
});
