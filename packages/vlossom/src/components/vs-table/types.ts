import type { CSSProperties } from 'vue';
import type { SizeProp, TextAlignment } from '@/declaration';
import type VsTable from './VsTable.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTable: typeof VsTable;
    }
}

export const TABLE_STYLE_SET_TOKEN = Symbol('TABLE_STYLE_SET_TOKEN');
export const TABLE_COLOR_SCHEME_TOKEN = Symbol('TABLE_COLOR_SCHEME_TOKEN');

export interface VsTableStyleSet {
    component?: CSSProperties;
    header?: CSSProperties;
    row?: CSSProperties;
    selectedRow?: CSSProperties;
    cell?: CSSProperties;
}

export type VsTablePageSizeOption = { label: string; value: number };
export type VsTablePageSizeOptions = VsTablePageSizeOption[];
export interface VsTablePaginationOptions {
    pageSizeOptions?: VsTablePageSizeOptions;
    showPageSizeSelect?: boolean;
    showingLength?: number;
    edgeButtons?: boolean;
    showTotal?: boolean;
    totalItemCount?: number; // required when serverMode is true
}

type Join<Prev extends string, K extends string, Sep extends string> = Prev extends '' ? K : `${Prev}${Sep}${K}`;
type JoinField<T, Sep extends string, Prev extends string = ''> = keyof T extends never
    ? string
    : {
          // 0 extends 1 & T[K] is a type guard to check if T[K] is a record
          [K in Extract<keyof T, string>]: 0 extends 1 & T[K]
              ? Join<Prev, K, Sep>
              : T[K] extends Record<string, any>
                ? Join<Prev, K, Sep> | JoinField<T[K], Sep, Join<Prev, K, Sep>>
                : Join<Prev, K, Sep>;
      }[Extract<keyof T, string>];

type JoinDotField<T> = JoinField<T, '.'>;

/**
 * NOTE: If I is `{ user: { name: { first: 'John' } } }`, then `ColumnKey<I>` is `'user' | 'user.name' | 'user.name.first'`
 */
export type VsTableColumnKey<I = VsTableItem> = JoinDotField<I>;
export type VsTableItem = Record<string, any>;
export type VsTableTag = 'td' | 'th';

export enum VsTableSortType {
    NONE,
    ASCEND,
    DESCEND,
}

export interface VsTableColumnDef<I = VsTableItem> {
    key: VsTableColumnKey<I>;
    label: string;
    align?: TextAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: VsTableColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: unknown, item: I) => unknown;
}

export interface VsTableCell<I = VsTableItem> {
    tag: VsTableTag;
    id: string;
    value: unknown; // display
    colKey: VsTableColumnKey<I>;
    rowIdx: number;
    colIdx: number;
}

export interface VsTableHeaderCell extends VsTableCell {
    tag: 'th';
    sortable: boolean;
}

export interface VsTableBodyCell<I = VsTableItem> extends VsTableCell<I> {
    tag: 'td';
    item: I;
}

export function isVsTableColumnDef(value: unknown): value is VsTableColumnDef {
    return typeof value === 'object' && value !== null && 'key' in value && 'label' in value;
}

export function isVsTableColumnDefArray(value: unknown): value is VsTableColumnDef[] {
    return Array.isArray(value) && value.length > 0 && value.every(isVsTableColumnDef);
}

export function isVsTableBodyRow(row: VsTableCell[]): row is VsTableBodyCell[] {
    return row[0]?.tag === 'td';
}

export function getRowItem(row: VsTableBodyCell[]): VsTableItem {
    const anyCell = row[0];
    if (!anyCell) {
        return {};
    }
    return anyCell.item;
}

export function getRowId(row: VsTableBodyCell[]): string | undefined {
    return row[0]?.id ?? undefined;
}
