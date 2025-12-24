import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';
import type VsTooltip from './VsTooltip.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTooltip: typeof VsTooltip;
    }
}

export type { VsTooltip };

export interface VsTooltipRef extends ComponentPublicInstance<typeof VsTooltip> {}

export interface VsTooltipStyleSet extends SizeStyleSet, BoxStyleSet {
    arrowColor?: string;
    arrowSize?: string;
}
