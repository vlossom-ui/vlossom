import type VsBlock from './VsBlock.vue';
import type { BoxStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsBlock: typeof VsBlock;
    }
}

export type { VsBlock };

export interface VsBlockStyleSet extends BoxStyleSet {
    boxShadow?: string;
    fontColor?: string;

    title?: {
        backgroundColor?: string;
        fontColor?: string;
        padding?: string;
    };
}
