import type VsAvatar from './VsAvatar.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsAvatar: typeof VsAvatar;
    }
}

export * from './types';
export type { VsAvatar };
