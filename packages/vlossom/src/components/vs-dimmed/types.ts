import type { ComponentPublicInstance } from 'vue';
import type VsDimmed from './VsDimmed.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDimmed: typeof VsDimmed;
    }
}

export type { VsDimmed };

export interface VsDimmedRef extends ComponentPublicInstance<typeof VsDimmed> {
    show: () => void;
    hide: () => void;
}
export interface VsDimmedStyleSet {
    backgroundColor?: string;
    opacity?: number;
}
