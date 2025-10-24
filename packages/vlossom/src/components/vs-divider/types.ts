import type VsDivider from './VsDivider.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDivider: typeof VsDivider;
    }
}

export type { VsDivider };
export interface VsDividerStyleSet {
    border?: string;
    opacity?: number;

    horizontal?: {
        width?: string;
        margin?: string;
    };

    vertical?: {
        height?: string;
        margin?: string;
    };
}
