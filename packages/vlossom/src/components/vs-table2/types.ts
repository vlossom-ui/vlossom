import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { SearchOptions, SizeProp, TextAlignment, VerticalAlignment } from '@/declaration';
import type VsTable2 from './VsTable2.vue';
import type { VsSearchInputStyleSet } from '@/components/vs-search-input/types';
import type { VsPaginationStyleSet } from '@/components/vs-pagination/types';
import type { VsSelectStyleSet } from '@/components/vs-select/types';

declare module 'vue' {
    interface GlobalComponents {
        VsTable2: typeof VsTable2;
    }
}

export interface VsTable2Ref extends ComponentPublicInstance<typeof VsTable2> {
    expand: (index: number) => void;
    collapse: (index: number) => void;
}

export interface VsTable2StyleSet extends CSSProperties {
    $toolbar?: CSSProperties;
    $search?: VsSearchInputStyleSet;
    $caption?: CSSProperties;
    $header?: CSSProperties;
    $stickyHeaderTop?: string;
    $row?: CSSProperties & {
        $selected?: CSSProperties;
    };
    $cell?: CSSProperties;
    $pagination?: VsPaginationStyleSet;
    $pageSizeSelect?: VsSelectStyleSet;
}

export type VsTable2PageSizeOption = { label: string; value: number };
export type VsTable2PageSizeOptions = VsTable2PageSizeOption[];

export interface VsTable2PaginationOptions {
    pageSizeOptions?: VsTable2PageSizeOptions;
    showPageSizeSelect?: boolean;
    showingLength?: number;
    edgeButtons?: boolean;
    showTotal?: boolean;
    totalItemCount?: number; // required when serverMode is true
}

type IsAny<T> = 0 extends 1 & T ? true : false;
type Join<Prev extends string, K extends string, Sep extends string> = Prev extends '' ? K : `${Prev}${Sep}${K}`;
type JoinField<T, Sep extends string, Prev extends string = ''> = keyof T extends never
    ? string
    : {
          [K in Extract<keyof T, string>]: IsAny<T[K]> extends true
              ? Join<Prev, K, Sep>
              : T[K] extends Record<string, any>
                ? Join<Prev, K, Sep> | JoinField<T[K], Sep, Join<Prev, K, Sep>>
                : Join<Prev, K, Sep>;
      }[Extract<keyof T, string>];

type JoinDotField<T> = JoinField<T, '.'>;

/**
 * NOTE: If I is `{ user: { name: { first: 'John' } } }`, then `ColumnKey<I>` is `'user' | 'user.name' | 'user.name.first'`
 */
export type VsTable2ColumnKey<I = VsTable2Item> = JoinDotField<I>;
export type VsTable2Item = any;

export type VsTable2ItemKey<I = VsTable2Item> = VsTable2ColumnKey<I> | ((item: I) => string | number);

export enum VsTable2SortType {
    NONE,
    ASCEND,
    DESCEND,
}

export interface VsTable2Sort<I = VsTable2Item> {
    key: VsTable2ColumnKey<I> | '';
    type: VsTable2SortType;
}

export interface VsTable2SearchOptions<I = VsTable2Item> extends SearchOptions {
    extraKeys?: VsTable2ColumnKey<I>[];
}

export interface VsTable2ColumnDef<I = VsTable2Item> {
    key: VsTable2ColumnKey<I>;
    label: string;
    headerAlign?: TextAlignment;
    align?: TextAlignment;
    verticalAlign?: VerticalAlignment;
    minWidth?: SizeProp;
    maxWidth?: SizeProp;
    width?: SizeProp;
    sortable?: boolean;
    sortBy?: VsTable2ColumnKey<I>;
    skipSearch?: boolean;
    transform?: (value: any, item: I) => unknown;
}

export interface VsTable2Cell<I = VsTable2Item> {
    item: I;
    value: unknown; // display
    colKey: VsTable2ColumnKey<I>;
    rowIdx: number;
    colIdx: number;
}
