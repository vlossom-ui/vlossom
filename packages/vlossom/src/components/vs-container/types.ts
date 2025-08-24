import type VsContainer from './VsContainer.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsContainer: typeof VsContainer;
    }
}

export type { VsContainer };
