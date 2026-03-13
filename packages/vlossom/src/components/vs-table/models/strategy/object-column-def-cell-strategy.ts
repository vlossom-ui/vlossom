import { objectUtil, stringUtil } from '@/utils';
import type { VsTableBodyCell, VsTableColumnDef, VsTableHeaderCell, VsTableItem } from '../../types';
import { HEADER_ROW_INDEX, type TableCellStrategy } from './index';

export default class ObjectColumnDefCellStrategy implements TableCellStrategy {
    public constructor(
        private items: VsTableItem[],
        private columnDefs: VsTableColumnDef[],
    ) {}

    public createHeaderCell(): VsTableHeaderCell[] {
        const tag = 'th';
        return this.columnDefs.map((header: VsTableColumnDef, idx: number) => ({
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

    public createBodyCell(): VsTableBodyCell[][] {
        const tag = 'td';
        return this.items.map((item: VsTableItem, rowIdx: number) => {
            return this.columnDefs.map((header: VsTableColumnDef, colIdx: number) => ({
                tag,
                id: `${stringUtil.kebabCase(header.key)}-${stringUtil.createID()}`,
                value: header.transform
                    ? header.transform(objectUtil.get(item, header.key), item)
                    : objectUtil.get(item, header.key),
                item,
                colKey: header.key,
                colIdx,
                rowIdx,
            }));
        });
    }
}
