import { objectUtil } from '@/utils';
import type { VsTableBodyCell, VsTableCell, VsTableColumnDef, VsTableHeaderCell, VsTableItem } from '../types';
import { isVsTableColumnDefArray } from '../types';
import {
    NoColumnDefCellStrategy,
    ObjectColumnDefCellStrategy,
    StringKeyColumnDefCellStrategy,
    type TableCellStrategy,
} from './strategy';

export class TableCellBuilder {
    private cellStrategy: TableCellStrategy = new NoColumnDefCellStrategy([]);

    public constructor(
        private items: VsTableItem[],
        private columnDefs: VsTableColumnDef[] | string[],
    ) {
        this.cellStrategy = this.getCellStrategy();
    }

    private getCellStrategy(): TableCellStrategy {
        if (!this.columnDefs?.length) {
            return new NoColumnDefCellStrategy(this.items);
        }
        if (isVsTableColumnDefArray(this.columnDefs)) {
            return new ObjectColumnDefCellStrategy(this.items, this.columnDefs);
        }
        return new StringKeyColumnDefCellStrategy(this.items, this.columnDefs);
    }

    public updateItems(items: VsTableItem[]): TableCellBuilder {
        if (objectUtil.isEqual(this.items, items)) {
            return this;
        }
        this.items = items;
        this.cellStrategy = this.getCellStrategy();
        return this;
    }

    public updateColumnDefs(columnDefs: VsTableColumnDef[] | string[]): TableCellBuilder {
        if (objectUtil.isEqual(this.columnDefs, columnDefs)) {
            return this;
        }
        this.columnDefs = columnDefs;
        this.cellStrategy = this.getCellStrategy();
        return this;
    }

    public build(): VsTableCell[][] {
        const headerCells: VsTableHeaderCell[] = this.cellStrategy.createHeaderCell();
        const bodyCells: VsTableBodyCell[][] = this.cellStrategy.createBodyCell();
        return [headerCells, ...bodyCells];
    }
}
