import type VsAccordion from './VsAccordion.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsAccordion: typeof VsAccordion;
    }
}

export * from './types';
export type { VsAccordion };
