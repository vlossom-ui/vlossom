import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { VsButtonStyleSet } from '@/components/vs-button/types';
import type VsScrollTop from './VsScrollTop.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsScrollTop: typeof VsScrollTop;
    }
}

export type { VsScrollTop };

export interface VsScrollTopRef extends ComponentPublicInstance<typeof VsScrollTop> {
    scrollToTop: () => void;
}

export interface VsScrollTopStyleSet extends CSSProperties {
    $button?: VsButtonStyleSet;
}
