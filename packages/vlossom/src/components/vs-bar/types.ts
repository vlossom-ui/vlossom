import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet, BoxStyleSet, CssPosition } from '@/declaration';
import type VsBar from './VsBar.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsBar: typeof VsBar;
    }
}

export type { VsBar };

export interface VsBarRef extends ComponentPublicInstance<typeof VsBar> {}

export interface VsBarStyleSet extends SizeStyleSet, BoxStyleSet {
    position?: CssPosition;
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
    zIndex?: string;
    fontColor?: string;
    boxShadow?: string;
}
