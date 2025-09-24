import type VsBlock from './VsBlock.vue';
import type { BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsBlock: typeof VsBlock;
    }
}

export type { VsBlock };

type BlockStyleSet = Omit<BoxStyleSet, 'display' | 'opacity'> & TextStyleSet;

export interface VsBlockStyleSet extends BlockStyleSet {
    title?: TextStyleSet & {
        backgroundColor?: string;
        padding?: string;
        bottomBorder?: string;
    };
    boxShadow?: string;
}
