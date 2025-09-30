import type VsMessage from './VsMessage.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsMessage: typeof VsMessage;
    }
}

export type { VsMessage };
