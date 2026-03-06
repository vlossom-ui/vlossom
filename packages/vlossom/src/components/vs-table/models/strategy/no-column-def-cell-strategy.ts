import { stringUtil } from '@/utils';
import type { BodyCell, HeaderCell, Item } from '../../types';
import { HEADER_ROW_INDEX, type TableCellStrategy } from './index';

export default class NoColumnDefCellStrategy implements TableCellStrategy {
    public constructor(private items: Item[]) {}

    public createHeaderCell(): HeaderCell[] {
        const tag = 'th';
        const itemKeys = this.items.length > 0 ? Object.keys(this.items[0]) : [];
        return itemKeys.map((key: string, idx: number) => ({
            tag,
            id: `${key}-${stringUtil.createID()}`,
            value: key,
            colKey: key,
            colIdx: idx,
            rowIdx: HEADER_ROW_INDEX,
            sortable: false,
        }));
    }

    public createBodyCell(): BodyCell[][] {
        const tag = 'td';
        return this.items.map((item: Item, rowIdx: number) => {
            return Object.keys(item).map((key: string, colIdx: number) => ({
                tag,
                id: `${key}-${stringUtil.createID()}`,
                value: item[key],
                item,
                colKey: key,
                colIdx,
                rowIdx,
            }));
        });
    }
}
