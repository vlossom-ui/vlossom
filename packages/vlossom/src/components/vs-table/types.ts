import type { SizeProp, TextAlignment } from '@/declaration';
import type VsTable from './VsTable.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTable: typeof VsTable;
    }
}

export interface VsTableStyleSet {}

type Item = Record<string, unknown>;

export interface ColumnDef<I = Item> {
    key: string; // example: `user.firstName` for `Item` type: `{ user: { firstName: 'John' } }`
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
    id?: string | ((item: I, idx?: number, items?: I[]) => string);
    height?: SizeProp;
}

export interface Cell {
    tag: 'td' | 'th';
    value: unknown; // display
    id: string;
    rowIdx: number;
    colIdx: number;
}

export interface HeaderCell extends Cell {
    tag: 'th';
    sortable: boolean;
}

export interface BodyCell<I = Item> extends Cell {
    tag: 'td';
    item: I;
}

export function isColumnDef(value: unknown): value is ColumnDef {
    return typeof value === 'object' && value !== null && 'key' in value && 'label' in value;
}

export function isColumnDefArray(value: unknown): value is ColumnDef[] {
    return Array.isArray(value) && value.length > 0 && value.every(isColumnDef);
}
