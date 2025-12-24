import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet } from '@/declaration';
import type { VsDimmedStyleSet } from '@/components/vs-dimmed/types';
import type VsDrawer from './VsDrawer.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDrawer: typeof VsDrawer;
    }
}

export type { VsDrawer };

export interface VsDrawerRef extends ComponentPublicInstance<typeof VsDrawer> {
    openDrawer: () => void;
    closeDrawer: () => void;
}

export interface VsDrawerStyleSet extends BoxStyleSet {
    position?: 'absolute' | 'fixed';
    size?: string;
    boxShadow?: string;
    zIndex?: number;

    dimmed?: VsDimmedStyleSet;
}
