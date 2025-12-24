import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet } from '@/declaration';
import type { VsExpandableStyleSet } from '@/components/vs-expandable/types';
import type VsAccordion from './VsAccordion.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsAccordion: typeof VsAccordion;
    }
}

export type { VsAccordion };

export interface VsAccordionRef extends ComponentPublicInstance<typeof VsAccordion> {
    toggle: () => void;
}

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
