import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet } from '@/declaration';
import type VsGrid from './VsGrid.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsGrid: typeof VsGrid;
    }
}

export type { VsGrid };

export interface VsGridRef extends ComponentPublicInstance<typeof VsGrid> {}

export interface VsGridStyleSet extends SizeStyleSet {
    gridSize?: number;
    rowGap?: string;
    columnGap?: string;
}
