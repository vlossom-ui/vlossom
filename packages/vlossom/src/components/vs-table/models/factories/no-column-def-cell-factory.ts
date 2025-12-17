import { stringUtil } from '@/utils';
import type { BodyCell, HeaderCell, Item } from '../../types';
import { HEADER_ROW_INDEX, type TableCellFactory } from './index';

export default class NoColumnDefCellFactory implements TableCellFactory {
    public constructor(private items: Item[]) {}

    public createHeaderCell(): HeaderCell[] {
        const tag = 'th';
        const itemKeys = this.items.length > 0 ? Object.keys(this.items[0]) : []; // TODO: check need validation for items record structure
        return itemKeys.map((key: string, idx: number) => ({
            tag,
            id: `${stringUtil.kebabCase(key)}-item-${HEADER_ROW_INDEX}`,
            value: key,
            colKey: key,
            rowKey: `item-${HEADER_ROW_INDEX}`,
            colIdx: idx,
            rowIdx: HEADER_ROW_INDEX,
            sortable: true,
        }));
    }

    public createBodyCell(): BodyCell[][] {
        const tag = 'td';
        return this.items.map((item: Item, rowIdx: number) => {
            const rowKey = `item-${rowIdx}`; // TODO: unique id for row

            return Object.keys(item).map((key: string, colIdx: number) => ({
                tag,
                id: `${stringUtil.kebabCase(key)}-${rowKey}`,
                value: item[key],
                item,
                colKey: key,
                rowKey,
                colIdx,
                rowIdx,
            }));
        });
    }
}
