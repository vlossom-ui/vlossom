import { objectUtil, stringUtil } from '@/utils';
import type { VsTableBodyCell, VsTableHeaderCell, VsTableItem } from '../../types';
import { HEADER_ROW_INDEX, type TableCellStrategy } from './index';

export default class StringKeyColumnDefCellStrategy implements TableCellStrategy {
    public constructor(
        private items: VsTableItem[],
        private columnDefs: string[],
    ) {}

    public createHeaderCell(): VsTableHeaderCell[] {
        const tag = 'th';
        return this.columnDefs.map((headerKey: string, idx: number) => ({
            tag,
            id: `${stringUtil.kebabCase(headerKey)}-${stringUtil.createID()}`,
            value: headerKey,
            colKey: headerKey,
            colIdx: idx,
            rowIdx: HEADER_ROW_INDEX,
            sortable: false,
        }));
    }

    public createBodyCell(): VsTableBodyCell[][] {
        const tag = 'td';
        return this.items.map((item: VsTableItem, rowIdx: number) => {
            return this.columnDefs.map((headerKey: string, colIdx: number) => ({
                tag,
                id: `${stringUtil.kebabCase(headerKey)}-${stringUtil.createID()}`,
                value: objectUtil.get(item, headerKey),
                item,
                colKey: headerKey,
                colIdx,
                rowIdx,
            }));
        });
    }
}
