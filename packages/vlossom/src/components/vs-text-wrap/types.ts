import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsTextWrap from './VsTextWrap.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsTextWrap: typeof VsTextWrap;
    }
}

export type { VsTextWrap };

export interface VsTextWrapRef extends ComponentPublicInstance<typeof VsTextWrap> {}

interface IconVariables {
    width?: string;
    height?: string;
    color?: string;
}

export interface VsTextWrapStyleSet {
    variables?: {
        width?: string | number;
        copyIcon?: IconVariables;
        linkIcon?: IconVariables;
    };
    component?: CSSProperties;
}
