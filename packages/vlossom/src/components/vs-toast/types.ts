import type { BoxStyleSet } from '@/declaration';
import type VsToast from './VsToast.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsToast: typeof VsToast;
    }
}

export type { VsToast };

export interface VsToastStyleSet extends BoxStyleSet {
    height?: string;
    fontColor?: string;
}
