import type VsGrid from './VsGrid.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsGrid: typeof VsGrid;
    }
}

export interface VsGridStyleSet {
    width?: string;
    height?: string;
    gridSize?: number;
    rowGap?: string;
    columnGap?: string;
}
