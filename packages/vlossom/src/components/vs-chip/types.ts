import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsChip from './VsChip.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsChip: typeof VsChip;
    }
}

export type { VsChip };

export interface VsChipRef extends ComponentPublicInstance<typeof VsChip> {}

export interface VsChipStyleSet extends CSSProperties {
    $height?: string;
    $icon?: CSSProperties;
    $closeButton?: CSSProperties;
}
