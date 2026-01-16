import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsBlock from './VsBlock.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsBlock: typeof VsBlock;
    }
}

export type { VsBlock };

export interface VsBlockRef extends ComponentPublicInstance<typeof VsBlock> {}

export interface VsBlockStyleSet {
    variables?: {
        padding?: string;
        border?: string;
    };
    component?: CSSProperties;
    title?: CSSProperties;
}
