import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsPage from './VsPage.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsPage: typeof VsPage;
    }
}

export type { VsPage };

export interface VsPageRef extends ComponentPublicInstance<typeof VsPage> {}

export interface VsPageStyleSet {
    component?: CSSProperties;
    title?: CSSProperties;
    description?: CSSProperties;
}
