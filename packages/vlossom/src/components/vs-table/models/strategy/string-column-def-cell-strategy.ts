import { objectUtil, stringUtil } from '@/utils';
import type { VsTableBodyCell, VsTableHeaderCell, VsTableItem, VsTableRow } from './../../types';
import { HEADER_ROW_INDEX, type TableCellStrategy } from './index';

export default class StringKeyColumnDefCellStrategy implements TableCellStrategy {
    public constructor(
        private tableId: string,
        private items: VsTableItem[],
        private columnDefs: string[],
        private getRowKey: (item: VsTableItem) => string,
    ) {}

    public createHeaderCell(): VsTableHeaderCell[] {
        const tag = 'th';
        return this.columnDefs.map((headerKey: string, idx: number) => ({
            tag,
            id: `${this.tableId}-${stringUtil.kebabCase(headerKey)}`,
            value: headerKey,
            colKey: headerKey,
            colIdx: idx,
            rowIdx: HEADER_ROW_INDEX,
            sortable: false,
        }));
    }

    public createBodyRows(): VsTableRow[] {
        const tag = 'td';
        return this.items.map((item: VsTableItem, rowIdx: number) => {
            const key = this.getRowKey(item);
            const cells: VsTableBodyCell[] = this.columnDefs.map((headerKey: string, colIdx: number) => ({
                tag,
                id: `${this.tableId}-${stringUtil.kebabCase(headerKey)}-${key}`,
                value: objectUtil.get(item, headerKey),
                item,
                colKey: headerKey,
                colIdx,
                rowIdx,
            }));
            return { key, item, cells };
        });
    }
}
