import type VsTable from './VsTable.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTable: typeof VsTable;
    }
}

export interface VsTableColumn {
    key: string; //  NOTE: prop name chain처럼 dot notation 사용 가능하도록 함
    label?: string;
    align?: 'left' | 'center' | 'right'; // NOTE: `default: left`
    width?: string | number;
    sortable?: boolean;
    sortKey?: string; // NOTE: 값이 없으면 value[key] 기준, 값이 있을 때 value[key][sortKey] 기준
    searchable?: boolean;
    select?: (value: any, key: string) => any;
}

export interface VsTableStyleSet {}
