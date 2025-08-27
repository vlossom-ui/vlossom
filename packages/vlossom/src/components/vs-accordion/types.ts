import type VsAccordion from './VsAccordion.vue';
import type { BoxStyleSet, SizeStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsAccordion: typeof VsAccordion;
    }
}

export type { VsAccordion };

export interface VsAccordionStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'display'>, TextStyleSet {
    expand: Omit<BoxStyleSet, 'display' | 'border' | 'borderRadius' | 'opacity'> & TextStyleSet;
}
