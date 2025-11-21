import type VsTextWrap from './VsTextWrap.vue';
import type { SizeStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsTextWrap: typeof VsTextWrap;
    }
}

export type { VsTextWrap };

export interface IconStyleSet extends SizeStyleSet {
    color?: string;
}

export interface VsTextWrapStyleSet {
    width?: string | number;
    copyIcon?: IconStyleSet;
    linkIcon?: IconStyleSet;
}
