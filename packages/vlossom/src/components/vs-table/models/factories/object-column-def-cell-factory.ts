import { objectUtil } from '@/utils';
import { HEADER_ROW_INDEX, type TableCellFactory } from '.';
import type { BodyCell, ColumnDef, HeaderCell, Item } from '../../types';

export default class ObjectColumnDefCellFactory implements TableCellFactory {
    public constructor(
        private items: Item[],
        private columnDefs: ColumnDef[],
    ) {}

    public createHeaderCell(): HeaderCell[] {
        const tag = 'th';
        return this.columnDefs.map((header: ColumnDef, idx: number) => ({
            ...header,
            tag,
            name: `${tag}-${header.key.replace('.', '-')}-${HEADER_ROW_INDEX}`,
            value: header.label,
            colIdx: idx,
            rowIdx: HEADER_ROW_INDEX,
        }));
    }

    public createBodyCell(): BodyCell[][] {
        const tag = 'td';
        return this.items.map((item: Item, rowIdx: number) => {
            return this.columnDefs.map((header: ColumnDef, colIdx: number) => ({
                tag,
                name: `${tag}-${header.key.replace('.', '-')}-${rowIdx}`,
                value: objectUtil.get(item, header.key),
                item,
                colIdx,
                rowIdx,
            }));
        });
    }
}
