import type VsChip from './VsChip.vue';
import type { SizeStyleSet, BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsChip: typeof VsChip;
    }
}

export type { VsChip };

export interface VsChipStyleSet extends SizeStyleSet, BoxStyleSet, TextStyleSet {
    cursor?: string;
}
