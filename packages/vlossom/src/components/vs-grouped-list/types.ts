import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { OptionItem } from '@/declaration';
import type VsGroupedList from './VsGroupedList.vue';
import type VsGroupedListGroupRow from './VsGroupedListGroupRow.vue';
import type VsGroupedListItemRow from './VsGroupedListItemRow.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsGroupedList: typeof VsGroupedList;
    }
}

export type { VsGroupedList, VsGroupedListGroupRow, VsGroupedListItemRow };

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
    displayName: string;
    groupIndex: number;
    items: OptionItem[];
}

export interface ItemRow {
    type: 'item';
    item: OptionItem;
    itemIndex: number;
    // 기존 공개 slot/event API 이름. itemIndex는 호환을 위한 별칭이다.
    groupedIndex: number;
    group: VsGroupedListGroup;
    groupIndex: number;
    // 가상 스크롤에서는 렌더된 아이템만 DOM에 있으므로 aria로 전체 위치를 알려준다 (1-based)
    itemPosition: number;
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
