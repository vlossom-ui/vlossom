import type { CSSProperties } from 'vue';
import type { SizeProp, TextAlignment } from '@/declaration';
import type VsTable from './VsTable.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTable: typeof VsTable;
    }
}

export const TABLE_STYLE_SET_TOKEN = Symbol('TABLE_STYLE_SET_TOKEN');

export interface VsTableStyleSet {
    variables?: {
        stickyHeaderTop?: string;
        selectedBackgroundColor?: string;
        selectedFontColor?: string;
    };
    component?: CSSProperties;
    header?: CSSProperties;
    row?: CSSProperties;
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
          [K in Extract<keyof T, string>]: T[K] extends Record<string, any>
              ? Join<Prev, K, Sep> | JoinField<T[K], Sep, Join<Prev, K, Sep>>
              : Join<Prev, K, Sep>;
      }[Extract<keyof T, string>];

type JoinDotField<T> = JoinField<T, '.'>;

/**
 * NOTE: If I is `{ user: { name: { first: 'John' } } }`, then `ColumnKey<I>` is `'user' | 'user.name' | 'user.name.first'`
 */
export type ColumnKey<I = Item> = JoinDotField<I>;
export type Item = Record<string, unknown>;
export type Tag = 'td' | 'th';

export enum SortType {
    NONE,
    ASCEND,
    DESCEND,
}

export interface ColumnDef<I = Item> {
    key: ColumnKey<I>;
    label: string;
    align?: TextAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: ColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: unknown, item: I) => unknown; // TODO: missing implementation
}

export interface Cell<I = Item> {
    tag: Tag;
    id: string;
    value: unknown; // display
    colKey: ColumnKey<I>;
    rowIdx: number;
    colIdx: number;
}

export interface HeaderCell extends Cell {
    tag: 'th';
    sortable: boolean;
}

export interface BodyCell<I = Item> extends Cell<I> {
    tag: 'td';
    item: I;
}

export function isColumnDef(value: unknown): value is ColumnDef {
    return typeof value === 'object' && value !== null && 'key' in value && 'label' in value;
}

export function isColumnDefArray(value: unknown): value is ColumnDef[] {
    return Array.isArray(value) && value.length > 0 && value.every(isColumnDef);
}

export function isBodyRow(row: Cell[]): row is BodyCell[] {
    return row[0]?.tag === 'td';
}

export function getRowItem(row: BodyCell[]): Item {
    const anyCell = row[0];
    if (!anyCell) {
        return {};
    }
    return anyCell.item;
}

export function getRowId(row: BodyCell[]): string | undefined {
    return row[0]?.id ?? undefined;
}
