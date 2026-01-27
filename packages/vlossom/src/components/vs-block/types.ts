import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsBlock from './VsBlock.vue';
import type { VsInnerScrollStyleSet } from '@/components/vs-inner-scroll/types';

declare module 'vue' {
    interface GlobalComponents {
        VsBlock: typeof VsBlock;
    }
}

export type { VsBlock };

export interface VsBlockRef extends ComponentPublicInstance<typeof VsBlock> {}

export interface VsBlockStyleSet {
    variables?: {
        border?: string;
        width?: string;
        title?: {
            backgroundColor?: string;
            color?: string;
            padding?: string;
        };
    };
    component?: CSSProperties;
    layout?: VsInnerScrollStyleSet;
}
