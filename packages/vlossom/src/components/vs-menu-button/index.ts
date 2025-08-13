import type VsMenuButton from './VsMenuButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsMenuButton: typeof VsMenuButton;
    }
}

export * from './types';
export type { VsMenuButton };
