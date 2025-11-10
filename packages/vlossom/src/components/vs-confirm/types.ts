import type VsConfirm from './VsConfirm.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsConfirm: typeof VsConfirm;
    }
}

export type { VsConfirm };
