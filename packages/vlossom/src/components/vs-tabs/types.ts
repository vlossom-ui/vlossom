import type { BoxStyleSet } from '@/declaration';
import type VsTabs from './VsTabs.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTabs: typeof VsTabs;
    }
}

export type { VsTabs };

export interface VsTabsStyleSet extends BoxStyleSet {
    height?: string | number;
    gap?: string;
}
