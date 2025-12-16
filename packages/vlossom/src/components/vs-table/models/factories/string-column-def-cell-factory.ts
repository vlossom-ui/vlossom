import { objectUtil } from '@/utils';
import type { BodyCell, HeaderCell, Item } from '../../types';
import { HEADER_ROW_INDEX, type TableCellFactory } from './index';

export default class StringKeyColumnDefCellFactory implements TableCellFactory {
    public constructor(
        private items: Item[],
        private columnDefs: string[],
    ) {}

    public createHeaderCell(): HeaderCell[] {
        const tag = 'th';
        return this.columnDefs.map((headerKey: string, idx: number) => ({
            tag,
            name: `${tag}-${headerKey.replace('.', '-')}-${HEADER_ROW_INDEX}`,
            value: headerKey,
            colIdx: idx,
            rowIdx: HEADER_ROW_INDEX,
            sortable: true,
        }));
    }

    public createBodyCell(): BodyCell[][] {
        const tag = 'td';
        return this.items.map((item: Item, rowIdx: number) => {
            return this.columnDefs.map((headerKey: string, colIdx: number) => ({
                tag,
                name: `${tag}-${headerKey.replace('.', '-')}-${rowIdx}`,
                value: objectUtil.get(item, headerKey),
                item,
                colIdx,
                rowIdx,
            }));
        });
    }
}
