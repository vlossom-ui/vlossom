import type { BoxStyleSet } from '@/declaration';
import type VsToast from './VsToast.vue';
import type VsToastView from './VsToastView.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsToast: typeof VsToast;
        VsToastView: typeof VsToastView;
    }
}

export type { VsToast, VsToastView };

export interface VsToastStyleSet extends BoxStyleSet {
    height?: string;
    fontColor?: string;
}
