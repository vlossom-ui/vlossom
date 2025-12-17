import { objectUtil, stringUtil } from '@/utils';
import type { BodyCell, ColumnDef, HeaderCell, Item } from '../../types';
import { HEADER_ROW_INDEX, type TableCellFactory } from './index';

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
            id: `${stringUtil.kebabCase(header.key)}-item-${HEADER_ROW_INDEX}`,
            value: header.label,
            colKey: header.key,
            rowKey: `item-${HEADER_ROW_INDEX}`,
            colIdx: idx,
            rowIdx: HEADER_ROW_INDEX,
        }));
    }

    public createBodyCell(): BodyCell[][] {
        const tag = 'td';
        return this.items.map((item: Item, rowIdx: number) => {
            const rowKey = `item-${rowIdx}`; // TODO: unique id for row

            return this.columnDefs.map((header: ColumnDef, colIdx: number) => ({
                tag,
                id: `${stringUtil.kebabCase(header.key)}-${rowKey}`,
                value: objectUtil.get(item, header.key),
                item,
                colKey: header.key,
                rowKey,
                colIdx,
                rowIdx,
            }));
        });
    }
}
