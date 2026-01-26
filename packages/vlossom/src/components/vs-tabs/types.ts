import type { ComponentPublicInstance } from 'vue';
import type { VsButtonStyleSet } from '@/components/vs-button/types';
import type VsTabs from './VsTabs.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTabs: typeof VsTabs;
    }
}

export type { VsTabs };

export interface VsTabsRef extends ComponentPublicInstance<typeof VsTabs> {
    goPrev: () => void;
    goNext: () => void;
}

export interface VsTabsStyleSet {
    variables?: {
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        gap?: string;
        height?: string;
        opacity?: number;
        padding?: string;
        width?: string;
    };
    scrollButton?: Omit<VsButtonStyleSet, 'loading'>;
}
