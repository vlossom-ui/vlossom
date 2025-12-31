import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, OptionItem, SizeStyleSet } from '@/declaration';
import type VsGroupedList from './VsGroupedList.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsGroupedList: typeof VsGroupedList;
    }
}

export type { VsGroupedList };

export interface VsGroupedListRef extends ComponentPublicInstance<typeof VsGroupedList> {
    scrollToItem: (item: any) => void;
}

export interface VsGroupedListStyleSet extends SizeStyleSet, BoxStyleSet {
    gap?: string;
    group?: BoxStyleSet;
    item?: BoxStyleSet;
}

export interface VsGroupedListGroup {
    name: string;
    items: OptionItem[];
}
