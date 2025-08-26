import type { BoxStyleSet, TextStyleSet } from '@/declaration';
import type VsBar from './VsBar.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsBar: typeof VsBar;
    }
}

export type { VsBar };

export interface VsBarStyleSet extends Omit<BoxStyleSet, 'display' | 'opacity'>, TextStyleSet {
    position?: 'fixed' | 'absolute' | 'relative' | 'sticky' | 'static';
    boxShadow?: string;
    top?: string | number;
    bottom?: string | number;
    left?: string | number;
    right?: string | number;
    zIndex?: string;
}
