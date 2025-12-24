import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';
import type VsBlock from './VsBlock.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsBlock: typeof VsBlock;
    }
}

export type { VsBlock };

export interface VsBlockRef extends ComponentPublicInstance<typeof VsBlock> {}

export interface VsBlockStyleSet extends SizeStyleSet, BoxStyleSet {
    boxShadow?: string;
    fontColor?: string;

    title?: {
        backgroundColor?: string;
        fontColor?: string;
        padding?: string;
    };
}
