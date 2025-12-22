import { objectUtil } from '@/utils';
import type { BodyCell, Cell, ColumnDef, HeaderCell, Item } from '../types';
import { isColumnDefArray } from '../types';
import {
    NoColumnDefCellStrategy,
    ObjectColumnDefCellStrategy,
    StringKeyColumnDefCellStrategy,
    type TableCellStrategy,
} from './strategy';

export class TableCellBuilder {
    private cellStrategy: TableCellStrategy = new NoColumnDefCellStrategy([]);

    public constructor(
        private items: Item[],
        private columnDefs: ColumnDef[] | string[] | null,
    ) {
        this.cellStrategy = this.getCellStrategy();
    }

    private getCellStrategy(): TableCellStrategy {
        if (this.columnDefs === null) {
            return new NoColumnDefCellStrategy(this.items);
        }
        if (isColumnDefArray(this.columnDefs)) {
            return new ObjectColumnDefCellStrategy(this.items, this.columnDefs);
        }
        return new StringKeyColumnDefCellStrategy(this.items, this.columnDefs);
    }

    public updateItems(items: Item[]): TableCellBuilder {
        if (objectUtil.isEqual(this.items, items)) {
            return this;
        }
        this.items = items;
        this.cellStrategy = this.getCellStrategy();
        return this;
    }

    public updateColumnDefs(columnDefs: ColumnDef[] | string[] | null): TableCellBuilder {
        if (objectUtil.isEqual(this.columnDefs, columnDefs)) {
            return this;
        }
        this.columnDefs = columnDefs;
        this.cellStrategy = this.getCellStrategy();
        return this;
    }

    public build(): Cell[][] {
        const headerCells: HeaderCell[] = this.cellStrategy.createHeaderCell();
        const bodyCells: BodyCell[][] = this.cellStrategy.createBodyCell();
        return [headerCells, ...bodyCells];
    }
}
