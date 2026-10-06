import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { OptionItem } from '@/declaration';
import type VsGroupedList from './VsGroupedList.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsGroupedList: typeof VsGroupedList;
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

export type VsGroupedListRow =
    | { type: 'group'; key: string; group: VsGroupedListGroup; groupIndex: number }
    | {
          type: 'item';
          key: string;
          item: OptionItem;
          groupedIndex: number;
          group: VsGroupedListGroup;
          groupIndex: number;
      };
