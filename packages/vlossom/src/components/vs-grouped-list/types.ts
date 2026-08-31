import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { OptionItem } from '@/declaration';
import type VsGroupedList from './VsGroupedList.vue';
import type VsGroupedListGroupRow from './VsGroupedListGroupRow.vue';
import type VsGroupedListItemRow from './VsGroupedListItemRow.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsGroupedList: typeof VsGroupedList;
        VsGroupedListGroupRow: typeof VsGroupedListGroupRow;
        VsGroupedListItemRow: typeof VsGroupedListItemRow;
    }
}

export type { VsGroupedList };

export interface VsGroupedListRef extends ComponentPublicInstance<typeof VsGroupedList> {
    scrollToItem: (id: string, offset?: number) => void;
    hasScroll: () => boolean;
}

export interface VsGroupedListStyleSet extends CSSProperties {
    $header?: CSSProperties;
    $content?: CSSProperties;
    $footer?: CSSProperties;
    $group?: CSSProperties;
    $item?: CSSProperties;
}

export interface VsGroupedListGroup {
    name: string;
    items: OptionItem[];
}

export interface GroupRow {
    type: 'group';
    name: string;
    groupIndex: number;
    items: OptionItem[];
}

export interface ItemRow {
    type: 'item';
    item: OptionItem;
    itemIndex: number;
    group: VsGroupedListGroup;
    groupIndex: number;
}

export type Row = GroupRow | ItemRow;

export interface VirtualGroupRow extends GroupRow {
    key: string;
    index: number;
    start: number;
}

export interface VirtualItemRow extends ItemRow {
    key: string;
    index: number;
    start: number;
}

export type VirtualRow = VirtualGroupRow | VirtualItemRow;
