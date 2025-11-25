import type { BoxStyleSet, TextStyleSet } from '@/declaration';
import type VsTabs from './VsTabs.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTabs: typeof VsTabs;
    }
}

export type { VsTabs };

export interface VsTabsStyleSet extends BoxStyleSet, TextStyleSet {
    height?: string;
    borderColor?: string;
    gap?: string;
    tabWidth?: string;
}
