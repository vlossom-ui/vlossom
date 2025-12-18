import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { stringUtil } from '@/utils';
import { TableCellBuilder } from '../models/table-cell-builder';
import type { ColumnDef } from '../types';

describe('TableCellBuilder', () => {
    beforeEach(() => {
        let seq = 0;
        vi.spyOn(stringUtil, 'createID').mockImplementation(() => `id-${seq++}`);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('컬럼 정의가 없을 때 아이템 키를 기반으로 헤더/바디 셀을 생성한다', () => {
        const items = [{ id: '1', name: 'Alice', age: 24 }];
        const builder = new TableCellBuilder(items, null);

        const [header, ...body] = builder.build();

        expect(header).toHaveLength(3);
        expect(header[1]).toMatchObject({
            tag: 'th',
            value: 'name',
            colKey: 'name',
            colIdx: 1,
            rowIdx: 0,
            sortable: true,
        });
        expect(body[0][1]).toMatchObject({
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
        const builder = new TableCellBuilder(items, ['name', 'meta.age']);

        const [header, ...body] = builder.build();

        expect(header.map((h) => h.value)).toEqual(['name', 'meta.age']);
        expect(body).toHaveLength(2);
        expect(body[0].map((cell) => cell.value)).toEqual(['Alice', 27]);
        expect(body[1].map((cell) => cell.value)).toEqual(['Bob', 31]);
    });

    it('객체 컬럼 정의를 사용하고, 업데이트 시 새로운 팩토리로 재생성한다', () => {
        const columnDefs: ColumnDef[] = [
            { key: 'name', label: '이름' },
            { key: 'age', label: '나이' },
        ];
        const items = [{ id: '1', name: 'Alice', age: 24 }];
        const builder = new TableCellBuilder(items, columnDefs);

        const [header] = builder.build();
        expect(header.map((h) => h.value)).toEqual(['이름', '나이']);

        const nextColumnDefs: ColumnDef[] = [{ key: 'title', label: '제목' }];
        const nextItems = [{ id: '99', title: 'Hello' }];

        builder.updateColumnDefs(nextColumnDefs).updateItems(nextItems);
        const [nextHeader, ...nextBody] = builder.build();

        expect(nextHeader.map((h) => h.colKey)).toEqual(['title']);
        expect(nextBody[0][0]).toMatchObject({ value: 'Hello', colKey: 'title', rowIdx: 0, colIdx: 0 });
    });
});
