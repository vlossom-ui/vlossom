import type VsTooltip from './VsTooltip.vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsTooltip: typeof VsTooltip;
    }
}

export type { VsTooltip };

export interface VsTooltipStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'display'> {
    arrowColor?: string;
    arrowSize?: string;
}
