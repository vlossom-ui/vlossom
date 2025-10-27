import type VsExpandable from './VsExpandable.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsExpandable: typeof VsExpandable;
    }
}

export type { VsExpandable };

export interface VsExpandableStyleSet {
    backgroundColor?: string;
    padding?: string;
}
