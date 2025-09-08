import type VsBar from './VsBar.vue';
import type { SizeStyleSet, BoxStyleSet, TextStyleSet, CssPosition } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsBar: typeof VsBar;
    }
}

export type { VsBar };

export interface VsBarStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'display' | 'opacity'>, TextStyleSet {
    position?: CssPosition;
    boxShadow?: string;
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
    zIndex?: string;
}
