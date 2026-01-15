import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { CssPosition } from '@/declaration';
import type VsBar from './VsBar.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsBar: typeof VsBar;
    }
}

export type { VsBar };

export interface VsBarRef extends ComponentPublicInstance<typeof VsBar> {}

export interface VsBarStyleSet {
    variables?: {
        position?: CssPosition;
    };
    component?: CSSProperties;
}
