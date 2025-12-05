import type VsOptions from './VsOptions.vue';
import type { BoxStyleSet } from '@/declaration';
import type { VsSelectOption } from '@/components/vs-select/types';
import type { VsInfiniteScrollRef } from '@/components/vs-infinite-scroll/types';

declare module 'vue' {
    interface GlobalComponents {
        VsOptions: typeof VsOptions;
    }
}

export type { VsOptions };

export interface VsOptionsStyleSet extends BoxStyleSet {
    gap?: string;
    height?: string;
    option?: Omit<BoxStyleSet, 'backgroundColor'>;
}

export interface VsOptionsGroup {
    name: string;
    options: VsSelectOption[];
}

export interface VsOptionsRef {
    optionsRef: HTMLElement;
    infiniteScrollRef: VsInfiniteScrollRef;
    getFocusableElements: () => HTMLElement[];
}

