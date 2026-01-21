import type { ComponentPublicInstance } from 'vue';
import type VsTooltip from './VsTooltip.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTooltip: typeof VsTooltip;
    }
}

export type { VsTooltip };

export interface VsTooltipRef extends ComponentPublicInstance<typeof VsTooltip> {}

export interface VsTooltipStyleSet {
    variables?: {
        width?: string;
        height?: string;
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        padding?: string;
        opacity?: number;
        arrowColor?: string;
        arrowSize?: string;
    };
}
