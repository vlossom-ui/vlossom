import type VsDrawer from './VsDrawer.vue';
import type { BoxStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsDrawer: typeof VsDrawer;
    }
}

export type { VsDrawer };

export interface VsDrawerStyleSet extends Omit<BoxStyleSet, 'display'> {
    position?: 'absolute' | 'fixed';
    size?: string;
    boxShadow?: string;
    dimmed?: {
        backgroundColor?: string;
        opacity?: number;
    };
}
