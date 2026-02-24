import type { ComponentPublicInstance, CSSProperties } from 'vue';
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
        gap?: string;
        line?: string;
    };
    tab?: CSSProperties;
    activeTab?: CSSProperties;
    scrollButton?: Omit<VsButtonStyleSet, 'loading'>;
}
