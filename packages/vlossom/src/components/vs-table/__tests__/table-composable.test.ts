import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { nextTick, reactive } from 'vue';
import { stringUtil } from '@/utils';
import { useTable } from '../composables/table-composable';
import type { BodyCell, ColumnDef, HeaderCell, Item } from '../types';

function setupUseTable(props: { columns: ColumnDef[] | string[] | null; items: Item[] }) {
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
});
