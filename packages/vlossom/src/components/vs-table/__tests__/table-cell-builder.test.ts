import { describe, it, expect, expectTypeOf } from 'vitest';
import { TableCellBuilder } from './../models/table-cell-builder';
import type { VsTableColumnDef } from './../types';

describe('TableCellBuilder', () => {
    it('컬럼 정의가 없을 때 아이템 키를 기반으로 헤더/바디 셀을 생성한다', () => {
        const items = [{ id: '1', name: 'Alice', age: 24 }];
        const builder = new TableCellBuilder('test-table-id', items, []);

        const { header, rows } = builder.build();

        expect(header).toHaveLength(3);
        expect(header[1]).toMatchObject({
            tag: 'th',
            value: 'name',
            colKey: 'name',
            colIdx: 1,
            rowIdx: 0,
        });
        expect(rows[0].item).toBe(items[0]);
        expect(rows[0].cells[1]).toMatchObject({
            tag: 'td',
            value: 'Alice',
            item: items[0],
            colKey: 'name',
            colIdx: 1,
            rowIdx: 0,
        });
    });

    it('문자열 컬럼 정의를 사용해 셀을 생성하고 중첩 경로도 읽어온다', () => {
        const items = [
            { id: '1', name: 'Alice', meta: { age: 27 } },
            { id: '2', name: 'Bob', meta: { age: 31 } },
        ];
        const builder = new TableCellBuilder('test-table-id', items, ['name', 'meta.age']);

        const { header, rows } = builder.build();

        expect(header.map((h) => h.value)).toEqual(['name', 'meta.age']);
        expect(rows).toHaveLength(2);
        expect(rows[0].cells.map((cell) => cell.value)).toEqual(['Alice', 27]);
        expect(rows[1].cells.map((cell) => cell.value)).toEqual(['Bob', 31]);
    });

    it('객체 컬럼 정의를 사용하고, 업데이트 시 새로운 팩토리로 재생성한다', () => {
        const columnDefs: VsTableColumnDef[] = [
            { key: 'name', label: '이름' },
            { key: 'age', label: '나이' },
        ];
        const items = [{ id: '1', name: 'Alice', age: 24 }];
        const builder = new TableCellBuilder('test-table-id', items, columnDefs);

        const { header } = builder.build();
        expect(header.map((h) => h.value)).toEqual(['이름', '나이']);

        const nextColumnDefs: VsTableColumnDef[] = [{ key: 'title', label: '제목' }];
        const nextItems = [{ id: '99', title: 'Hello' }];

        builder.updateColumnDefs(nextColumnDefs).updateItems(nextItems);
        const { header: nextHeader, rows: nextRows } = builder.build();

        expect(nextHeader.map((h) => h.colKey)).toEqual(['title']);
        expect(nextRows[0].cells[0]).toMatchObject({ value: 'Hello', colKey: 'title', rowIdx: 0, colIdx: 0 });
    });

    it('아이템을 앞에 추가해 인덱스가 밀려도 기존 행의 key와 셀 id는 유지된다', () => {
        const columnDefs: VsTableColumnDef[] = [{ key: 'name', label: '이름' }];
        const alice = { id: '1', name: 'Alice' };
        const bob = { id: '2', name: 'Bob' };
        const builder = new TableCellBuilder('test-table-id', [alice, bob], columnDefs);

        const { rows } = builder.build();
        const aliceKey = rows[0].key;
        const aliceCellId = rows[0].cells[0].id;
        const bobKey = rows[1].key;

        const carol = { id: '3', name: 'Carol' };
        builder.updateItems([carol, alice, bob]);
        const { rows: nextRows } = builder.build();

        expect(nextRows[1].key).toBe(aliceKey);
        expect(nextRows[1].cells[0]).toMatchObject({ id: aliceCellId, rowIdx: 1 });
        expect(nextRows[2].key).toBe(bobKey);
        expect(nextRows[0].key).not.toBe(aliceKey);
    });

    it('transform value 타입은 any이고 item 타입은 유지한다', () => {
        type User = {
            id: string;
            profile: {
                name: string;
                age: number;
            };
        };

        const columns: VsTableColumnDef<User>[] = [
            {
                key: 'profile.age',
                label: '나이',
                transform: (value, item) => {
                    expectTypeOf(value).toBeAny();
                    expectTypeOf(item).toEqualTypeOf<User>();
                    return value.toLocaleString();
                },
            },
        ];

        expect(columns).toHaveLength(1);
    });
});
