import { objectUtil, stringUtil } from '@/utils';
import type { BodyCell, ColumnDef, HeaderCell, Item } from '../../types';
import { HEADER_ROW_INDEX, type TableCellStrategy } from './index';

export default class ObjectColumnDefCellStrategy implements TableCellStrategy {
    public constructor(
        private items: Item[],
        private columnDefs: ColumnDef[],
    ) {}

    public createHeaderCell(): HeaderCell[] {
        const tag = 'th';
        return this.columnDefs.map((header: ColumnDef, idx: number) => ({
            ...header,
            tag,
            id: `${stringUtil.kebabCase(header.key)}-${stringUtil.createID()}`,
            value: header.label,
            colKey: header.key,
            colIdx: idx,
            rowIdx: HEADER_ROW_INDEX,
            sortable: header.sortable ?? false,
        }));
    }

    public createBodyCell(): BodyCell[][] {
        const tag = 'td';
        return this.items.map((item: Item, rowIdx: number) => {
            return this.columnDefs.map((header: ColumnDef, colIdx: number) => ({
                tag,
                id: `${stringUtil.kebabCase(header.key)}-${item.id}`,
                value: objectUtil.get(item, header.key),
                item,
                colKey: header.key,
                colIdx,
                rowIdx,
            }));
        });
    }
}
