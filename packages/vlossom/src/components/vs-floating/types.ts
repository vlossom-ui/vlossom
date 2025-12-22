import type VsFloating from './VsFloating.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsFloating: typeof VsFloating;
    }
}

export type { VsFloating };

