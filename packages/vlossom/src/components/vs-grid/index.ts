import type VsGrid from './VsGrid.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsGrid: typeof VsGrid;
    }
}

export * from './types';
export type { VsGrid };
