import type VsFooter from './VsFooter.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsFooter: typeof VsFooter;
    }
}

export * from './types';
export type { VsFooter };
