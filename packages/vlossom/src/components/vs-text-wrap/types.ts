import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsTextWrap from './VsTextWrap.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTextWrap: typeof VsTextWrap;
    }
}

export type { VsTextWrap };

export interface VsTextWrapRef extends ComponentPublicInstance<typeof VsTextWrap> {}

export interface VsTextWrapStyleSet {
    variables?: {
        width?: string | number;
    };
    copyIcon?: CSSProperties;
    linkIcon?: CSSProperties;
}
