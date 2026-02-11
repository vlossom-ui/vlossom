import type { ComponentPublicInstance, CSSProperties } from 'vue';
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

export interface VsDrawerStyleSet {
    variables?: {
        size?: string;
    };
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
}
