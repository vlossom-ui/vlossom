import type VsDimmed from './VsDimmed.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsDimmed: typeof VsDimmed;
    }
}

export type { VsDimmed };

export interface VsDimmedStyleSet {
    backgroundColor?: string;
    opacity?: number;
}


