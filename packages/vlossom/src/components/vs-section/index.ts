import type VsSection from './VsSection.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSection: typeof VsSection;
    }
}

export * from './types';
