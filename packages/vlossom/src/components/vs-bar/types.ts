import type VsBar from './VsBar.vue';
import type { SizeStyleSet, BoxStyleSet, CssPosition } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsBar: typeof VsBar;
    }
}

export type { VsBar };

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
