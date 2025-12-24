import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';
import type VsChip from './VsChip.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsChip: typeof VsChip;
    }
}

export type { VsChip };

export interface VsChipRef extends ComponentPublicInstance<typeof VsChip> {}

export interface VsChipStyleSet extends SizeStyleSet, BoxStyleSet {
    fontColor?: string;
}
