import type VsToggle from './VsToggle.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsToggle: typeof VsToggle;
    }
}

export type { VsToggle };
