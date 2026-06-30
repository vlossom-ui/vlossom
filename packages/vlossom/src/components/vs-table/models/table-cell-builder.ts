import { objectUtil, stringUtil } from '@/utils';
import type { VsTableColumnDef, VsTableHeaderCell, VsTableItem, VsTableRow } from './../types';
import { isVsTableColumnDefArray } from './table-model';
import {
    NoColumnDefCellStrategy,
    ObjectColumnDefCellStrategy,
    StringKeyColumnDefCellStrategy,
    type TableCellStrategy,
} from './strategy';

export class TableCellBuilder {
    private cellStrategy: TableCellStrategy;

    // 행 key를 배열 인덱스가 아니라 아이템 객체의 동일성에 묶어, 아이템 추가/정렬 시에도 안정적으로 유지한다.
    private readonly rowKeys = new WeakMap<object, string>();

    public constructor(
        private readonly tableId: string,
        private items: VsTableItem[],
        private columnDefs: VsTableColumnDef[] | string[],
    ) {
        this.cellStrategy = this.getCellStrategy();
    }

    private getRowKey = (item: VsTableItem): string => {
        let key = this.rowKeys.get(item);
        if (key === undefined) {
            key = stringUtil.createID();
            this.rowKeys.set(item, key);
        }
        return key;
    };

    private getCellStrategy(): TableCellStrategy {
        if (!this.columnDefs?.length) {
            return new NoColumnDefCellStrategy(this.tableId, this.items, this.getRowKey);
        }
        if (isVsTableColumnDefArray(this.columnDefs)) {
            return new ObjectColumnDefCellStrategy(this.tableId, this.items, this.columnDefs, this.getRowKey);
        }
        return new StringKeyColumnDefCellStrategy(this.tableId, this.items, this.columnDefs, this.getRowKey);
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

    public build(): { header: VsTableHeaderCell[]; rows: VsTableRow[] } {
        return {
            header: this.cellStrategy.createHeaderCell(),
            rows: this.cellStrategy.createBodyRows(),
        };
    }
}
