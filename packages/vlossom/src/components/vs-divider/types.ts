import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsDivider from './VsDivider.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDivider: typeof VsDivider;
    }
}

export type { VsDivider };

export interface VsDividerRef extends ComponentPublicInstance<typeof VsDivider> {}

export interface VsDividerStyleSet {
    variables?: {
        border?: string;

        horizontal?: {
            width?: string;
            margin?: string;
        };

        vertical?: {
            height?: string;
            margin?: string;
        };
    };
    component?: CSSProperties;
}
