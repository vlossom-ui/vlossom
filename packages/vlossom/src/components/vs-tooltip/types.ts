import type VsTooltip from './VsTooltip.vue';
import type { SizeStyleSet, BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsTooltip: typeof VsTooltip;
    }
}

export type { VsTooltip };

export interface VsTooltipStyleSet extends SizeStyleSet, BoxStyleSet, TextStyleSet {
    contents?: BoxStyleSet & TextStyleSet;
}
