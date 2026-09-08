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
    private cachedBuild: { header: VsTableHeaderCell[]; rows: VsTableRow[] } | null = null;
    private dirty = true;

    // 같은 배열을 그대로 수정하는 경우(컬럼 추가/삭제/속성 변경)도 감지해야 하므로 원본이 아닌 복사본과 비교한다.
    private columnDefsSnapshot: (VsTableColumnDef | string)[];

    // 행 key를 배열 인덱스가 아니라 아이템 객체의 동일성에 묶어, 아이템 추가/정렬 시에도 안정적으로 유지한다.
    private readonly rowKeys = new WeakMap<object, string>();

    // 행 객체 동일성이 유지되어야 VsTableBody의 v-memo가 바뀌지 않은 행의 갱신을 건너뛴다.
    private readonly rowCache = new WeakMap<object, VsTableRow>();

    public constructor(
        private readonly tableId: string,
        private items: VsTableItem[],
        private columnDefs: VsTableColumnDef[] | string[],
    ) {
        this.columnDefsSnapshot = TableCellBuilder.snapshotColumnDefs(columnDefs);
        this.cellStrategy = this.getCellStrategy();
    }

    private static snapshotColumnDefs(columnDefs: VsTableColumnDef[] | string[]): (VsTableColumnDef | string)[] {
        return columnDefs.map((columnDef) => (typeof columnDef === 'string' ? columnDef : { ...columnDef }));
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
        // 같은 배열이면 아이템 값을 직접 수정한 경우를 비교로 가려낼 수 없으므로 캐시를 버린다.
        if (this.items === items) {
            this.dirty = true;
            return this;
        }
        if (objectUtil.isEqual(this.items, items)) {
            this.adoptItems(items);
            return this;
        }
        this.setItems(items);
        this.dirty = true;
        return this;
    }

    public updateColumnDefs(columnDefs: VsTableColumnDef[] | string[]): TableCellBuilder {
        if (objectUtil.isEqual(this.columnDefsSnapshot, columnDefs)) {
            return this;
        }
        this.columnDefs = columnDefs;
        this.columnDefsSnapshot = TableCellBuilder.snapshotColumnDefs(columnDefs);
        this.cellStrategy = this.getCellStrategy();
        this.dirty = true;
        return this;
    }

    private setItems(items: VsTableItem[]): void {
        this.items = items;
        this.cellStrategy = this.getCellStrategy();
    }

    // 내용이 같은 새 배열이면 셀은 재사용하되, 셀이 들고 있는 아이템 참조는 새 배열의 것으로 바꾼다.
    // slot, 이벤트, 선택/확장 판정이 모두 아이템 객체의 동일성에 기대므로 버려진 객체를 계속 넘기면 안 된다.
    private adoptItems(items: VsTableItem[]): void {
        if (!this.dirty && this.cachedBuild) {
            this.cachedBuild.rows.forEach((row, rowIdx) => {
                const item = items[rowIdx];
                this.rowKeys.set(item, row.key);
                this.rowCache.set(item, row);
                row.item = item;
                row.cells.forEach((cell) => {
                    cell.item = item;
                });
            });
        }
        this.setItems(items);
    }

    // 아이템 하나만 바뀌어도 모든 행 객체가 새로 만들어지면 전체 행이 다시 렌더된다.
    // 렌더 결과가 같은 행은 직전 객체를 그대로 돌려주어 바뀐 행만 갱신되게 한다.
    private reuseUnchangedRows(rows: VsTableRow[]): VsTableRow[] {
        return rows.map((row) => {
            const cached = this.rowCache.get(row.item);
            if (cached && TableCellBuilder.isSameRow(cached, row)) {
                return cached;
            }
            this.rowCache.set(row.item, row);
            return row;
        });
    }

    private static isSameRow(cached: VsTableRow, next: VsTableRow): boolean {
        if (cached.key !== next.key || cached.cells.length !== next.cells.length) {
            return false;
        }
        return cached.cells.every((cell, index) => {
            const nextCell = next.cells[index];
            return cell.rowIdx === nextCell.rowIdx && cell.colKey === nextCell.colKey && cell.value === nextCell.value;
        });
    }

    public build(): { header: VsTableHeaderCell[]; rows: VsTableRow[] } {
        if (!this.dirty && this.cachedBuild) {
            return this.cachedBuild;
        }
        const header = this.cellStrategy.createHeaderCell();
        this.cachedBuild = {
            // 모든 바디 행이 data-label 때문에 헤더를 읽으므로, 내용이 같으면 배열 동일성을 유지해야 한다.
            header: objectUtil.isEqual(this.cachedBuild?.header, header) ? this.cachedBuild!.header : header,
            rows: this.reuseUnchangedRows(this.cellStrategy.createBodyRows()),
        };
        this.dirty = false;
        return this.cachedBuild;
    }
}
