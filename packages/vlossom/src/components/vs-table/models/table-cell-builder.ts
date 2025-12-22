import { objectUtil } from '@/utils';
import type { BodyCell, Cell, ColumnDef, HeaderCell, Item } from '../types';
import { isColumnDefArray } from '../types';
import {
    NoColumnDefCellFactory,
    ObjectColumnDefCellFactory,
    StringKeyColumnDefCellFactory,
    type TableCellFactory,
} from './factories';

export class TableCellBuilder {
    private cellFactory: TableCellFactory = new NoColumnDefCellFactory([]);

    public constructor(
        private items: Item[],
        private columnDefs: ColumnDef[] | string[] | null,
    ) {
        this.cellFactory = this.getCellFactory();
    }

    private getCellFactory(): TableCellFactory {
        if (this.columnDefs === null) {
            return new NoColumnDefCellFactory(this.items);
        }
        if (isColumnDefArray(this.columnDefs)) {
            return new ObjectColumnDefCellFactory(this.items, this.columnDefs);
        }
        return new StringKeyColumnDefCellFactory(this.items, this.columnDefs);
    }

    public updateItems(items: Item[]): TableCellBuilder {
        if (objectUtil.isEqual(this.items, items)) {
            return this;
        }
        this.items = items;
        this.cellFactory = this.getCellFactory();
        return this;
    }

    public updateColumnDefs(columnDefs: ColumnDef[] | string[] | null): TableCellBuilder {
        if (objectUtil.isEqual(this.columnDefs, columnDefs)) {
            return this;
        }
        this.columnDefs = columnDefs;
        this.cellFactory = this.getCellFactory();
        return this;
    }

    public build(): Cell[][] {
        const headerCells: HeaderCell[] = this.cellFactory.createHeaderCell();
        const bodyCells: BodyCell[][] = this.cellFactory.createBodyCell();
        return [headerCells, ...bodyCells];
    }
}
