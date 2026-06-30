import { stringUtil } from '@/utils';
import type { VsTableBodyCell, VsTableHeaderCell, VsTableItem, VsTableRow } from './../../types';
import { HEADER_ROW_INDEX, type TableCellStrategy } from './index';

export default class NoColumnDefCellStrategy implements TableCellStrategy {
    public constructor(
        private tableId: string,
        private items: VsTableItem[],
        private getRowKey: (item: VsTableItem) => string,
    ) {}

    public createHeaderCell(): VsTableHeaderCell[] {
        const tag = 'th';
        const itemKeys = this.items.length > 0 ? Object.keys(this.items[0]) : [];
        return itemKeys.map((key: string, idx: number) => ({
            tag,
            id: `${this.tableId}-${stringUtil.kebabCase(key)}`,
            value: key,
            colKey: key,
            colIdx: idx,
            rowIdx: HEADER_ROW_INDEX,
            sortable: false,
        }));
    }

    public createBodyRows(): VsTableRow[] {
        const tag = 'td';
        return this.items.map((item: VsTableItem, rowIdx: number) => {
            const rowKey = this.getRowKey(item);
            const cells: VsTableBodyCell[] = Object.keys(item).map((key: string, colIdx: number) => ({
                tag,
                id: `${this.tableId}-${stringUtil.kebabCase(key)}-${rowKey}`,
                value: item[key],
                item,
                colKey: key,
                colIdx,
                rowIdx,
            }));
            return { key: rowKey, item, cells };
        });
    }
}
