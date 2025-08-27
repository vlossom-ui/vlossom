import type { BoxStyleSet, TextStyleSet } from '@/declaration';
import type VsExpandTransition from './VsExpandTransition.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsExpandTransition: typeof VsExpandTransition;
    }
}

export type { VsExpandTransition };

export interface VsExpandTransitionStyleSet
    extends Omit<BoxStyleSet, 'display' | 'border' | 'borderRadius' | 'opacity'>,
        TextStyleSet {}
