import type VsImage from './VsImage.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsImage: typeof VsImage;
    }
}

export * from './types';
export type { VsImage };
