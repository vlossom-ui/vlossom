import type VsDivider from './VsDivider.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDivider: typeof VsDivider;
    }
}

interface VsDividerVerticalStyleSet {
    height?: string;
    margin?: string;
}

export interface VsDividerStyleSet {
    border?: string;
    margin?: string;
    vertical?: VsDividerVerticalStyleSet;
}
