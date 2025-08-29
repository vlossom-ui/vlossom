import type VsAccordion from './VsAccordion.vue';
import type { BoxStyleSet, SizeStyleSet, TextStyleSet } from '@/declaration';
import type { VsExpandableStyleSet } from '@/components/vs-expandable/types';

declare module 'vue' {
    interface GlobalComponents {
        VsAccordion: typeof VsAccordion;
    }
}

export type { VsAccordion };

export interface VsAccordionStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'display'>, TextStyleSet {
    expand?: VsExpandableStyleSet;
}
