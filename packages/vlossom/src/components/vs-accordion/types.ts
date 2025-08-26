import type VsAccordion from './VsAccordion.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsAccordion: typeof VsAccordion;
    }
}

export type { VsAccordion };

export interface VsAccordionStyleSet {}
