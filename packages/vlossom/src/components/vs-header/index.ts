import type VsHeader from './VsHeader.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsHeader: typeof VsHeader;
    }
}

export * from './types';
export type { VsHeader };
