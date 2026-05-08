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
    $gap?: string;
    $divider?: CSSProperties['border'] & {};
    $tab?: CSSProperties;
    $activeTab?: CSSProperties;
    $control?: Omit<VsButtonStyleSet, '$loading'>;
}
