import type { SizeProp, TextAlignment } from '@/declaration';
import type VsTable from './VsTable.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTable: typeof VsTable;
    }
}

export interface VsTableStyleSet {}

type Join<Prev extends string, K extends string, Sep extends string> = Prev extends '' ? K : `${Prev}${Sep}${K}`;
type JoinPath<T, Sep extends string, Prev extends string = ''> = string extends keyof T
    ? string
    : {
          [K in Extract<keyof T, string>]: T[K] extends Record<string, any>
              ? Join<Prev, K, Sep> | JoinPath<T[K], Sep, Join<Prev, K, Sep>>
              : Join<Prev, K, Sep>;
      }[Extract<keyof T, string>];

/**
 * NOTE: If T is `{ user: { name: { first: 'John' } } }`, then `ColumnKey<T>` is `'user' | 'user.name' | 'user.name.first'`
 */
type DashPath<T> = JoinPath<T, '-'>;
type DotPath<T> = JoinPath<T, '.'>;

export type Item = Record<string, unknown>;
export type ColumnKey<I = Item> = DotPath<I>;
export type RowId = `${number}`;
export type Tag = 'td' | 'th';

export interface ColumnDef<I = Item> {
    key: ColumnKey<I>;
    label: string;
    sortable?: boolean;
    sortKey?: string;
    align?: TextAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    transform?: (value: unknown, item: I) => unknown;
}

export interface RowDef<I = Item> {
    id?: RowId | ((item: I, idx?: number, items?: I[]) => RowId);
    height?: SizeProp;
}

export interface Cell<I = Item> {
    tag: Tag;
    name: `${Tag}-${DashPath<ColumnKey<I>>}-${RowId}`;
    value: unknown; // display
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
