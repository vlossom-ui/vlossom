import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet } from '@/declaration';
import type VsTextWrap from './VsTextWrap.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTextWrap: typeof VsTextWrap;
    }
}

export type { VsTextWrap };

export interface VsTextWrapRef extends ComponentPublicInstance<typeof VsTextWrap> {}

export interface IconStyleSet extends SizeStyleSet {
    color?: string;
}

export interface VsTextWrapStyleSet {
    width?: string | number;
    copyIcon?: IconStyleSet;
    linkIcon?: IconStyleSet;
}
