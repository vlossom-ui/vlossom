import type VsInputWrapper from './VsInputWrapper.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsInputWrapper: typeof VsInputWrapper;
    }
}

export type { VsInputWrapper };
