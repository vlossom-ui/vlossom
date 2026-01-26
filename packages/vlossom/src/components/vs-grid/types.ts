import type { ComponentPublicInstance } from 'vue';
import type VsGrid from './VsGrid.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsGrid: typeof VsGrid;
    }
}

export type { VsGrid };

export interface VsGridRef extends ComponentPublicInstance<typeof VsGrid> {}

export interface VsGridStyleSet {
    variables?: {
        gridSize?: number;
        columnGap?: string;
        rowGap?: string;
    };
}
