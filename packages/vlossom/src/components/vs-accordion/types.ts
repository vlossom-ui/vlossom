import type { ComponentPublicInstance, CSSProperties } from 'vue';
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

export interface VsAccordionStyleSet {
    variables?: {
        arrowColor?: string;
        arrowSize?: string;
        arrowSpacing?: string;
        border?: string;
    };
    component?: CSSProperties;
    title?: CSSProperties;
    content?: VsExpandableStyleSet;
}
