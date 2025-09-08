import type VsDrawer from './VsDrawer.vue';
import type { BoxStyleSet, CssPosition } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsDrawer: typeof VsDrawer;
    }
}

export type { VsDrawer };

export interface VsDrawerStyleSet extends Omit<BoxStyleSet, 'display'> {
    position?: CssPosition;
    size?: string;
    dimmed?: {
        backgroundColor?: string;
        opacity?: number;
    };
}
