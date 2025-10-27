import type VsPage from './VsPage.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsPage: typeof VsPage;
    }
}

export type { VsPage };

export interface VsPageStyleSet {
    padding?: string;

    title?: { padding?: string };

    description?: { padding?: string };
}
