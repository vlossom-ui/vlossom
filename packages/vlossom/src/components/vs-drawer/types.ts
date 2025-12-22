import type VsDrawer from './VsDrawer.vue';
import type { BoxStyleSet } from '@/declaration';
import type { VsDimmedStyleSet } from '@/components/vs-dimmed/types';

declare module 'vue' {
    interface GlobalComponents {
        VsDrawer: typeof VsDrawer;
    }
}

export type { VsDrawer };

export interface VsDrawerStyleSet extends BoxStyleSet {
    position?: 'absolute' | 'fixed';
    size?: string;
    boxShadow?: string;
    zIndex?: number;

    dimmed?: VsDimmedStyleSet;
}
