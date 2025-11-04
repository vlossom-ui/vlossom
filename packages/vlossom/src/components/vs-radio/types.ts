import type VsRadio from './VsRadio.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsRadio: typeof VsRadio;
    }
}

export type { VsRadio };

export interface VsRadioStyleSet {
    borderRadius?: string;
    height?: string;
    radioColor?: string;
    radioSize?: string;
}
