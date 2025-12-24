import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet } from '@/declaration';
import type VsTabs from './VsTabs.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTabs: typeof VsTabs;
    }
}

export type { VsTabs };

export interface VsTabsRef extends ComponentPublicInstance<typeof VsTabs> {
    goPrev: () => void;
    goNext: () => void;
}

export interface VsTabsStyleSet extends BoxStyleSet {
    height?: string | number;
    gap?: string;
}
