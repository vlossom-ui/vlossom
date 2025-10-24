import type VsAccordion from './VsAccordion.vue';
import type { BoxStyleSet } from '@/declaration';
import type { VsExpandableStyleSet } from '@/components/vs-expandable/types';

declare module 'vue' {
    interface GlobalComponents {
        VsAccordion: typeof VsAccordion;
    }
}

export type { VsAccordion };

export interface VsAccordionStyleSet extends Omit<BoxStyleSet, 'backgroundColor' | 'padding'> {
    width?: string;
    arrowColor?: string;

    title?: {
        backgroundColor?: string;
        fontColor?: string;
        height?: string;
        padding?: string;
    };

    expand?: VsExpandableStyleSet & {
        fontColor?: string;
    };
}
