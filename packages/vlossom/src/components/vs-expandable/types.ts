import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsExpandable from './VsExpandable.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsExpandable: typeof VsExpandable;
    }
}

export type { VsExpandable };

export interface VsExpandableRef extends ComponentPublicInstance<typeof VsExpandable> {}

export interface VsExpandableStyleSet {
    component?: CSSProperties;
}
