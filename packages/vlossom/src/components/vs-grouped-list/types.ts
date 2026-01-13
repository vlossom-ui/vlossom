import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { OptionItem } from '@/declaration';
import type VsGroupedList from './VsGroupedList.vue';
import type { VsInnerScrollStyleSet } from '@/components/vs-inner-scroll/types';

declare module 'vue' {
    interface GlobalComponents {
        VsGroupedList: typeof VsGroupedList;
    }
}

export type { VsGroupedList };

export interface VsGroupedListRef extends ComponentPublicInstance<typeof VsGroupedList> {
    scrollToItem: (id: string) => void;
    hasScroll: () => boolean;
}

export interface VsGroupedListStyleSet {
    variables?: {
        gap?: string;
        height?: string;
    };
    layout?: VsInnerScrollStyleSet;
    group?: CSSProperties;
    item?: CSSProperties;
}

export interface VsGroupedListGroup {
    name: string;
    items: OptionItem[];
}
