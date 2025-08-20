import type VsBar from './VsBar.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsBar: typeof VsBar;
    }
}

export * from './types';
export type { VsBar };
