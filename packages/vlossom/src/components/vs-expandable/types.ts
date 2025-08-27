import type { BoxStyleSet, TextStyleSet } from '@/declaration';
import type VsExpandable from './VsExpandable.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsExpandable: typeof VsExpandable;
    }
}

export type { VsExpandable };

export interface VsExpandableStyleSet
    extends Omit<BoxStyleSet, 'display' | 'border' | 'borderRadius' | 'opacity'>,
        TextStyleSet {}
