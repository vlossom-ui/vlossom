import type VsGrid from './VsGrid.vue';
import type { SizeStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsGrid: typeof VsGrid;
    }
}

export type { VsGrid };

export interface VsGridStyleSet extends SizeStyleSet {
    gridSize?: number;
    rowGap?: string;
    columnGap?: string;
}
