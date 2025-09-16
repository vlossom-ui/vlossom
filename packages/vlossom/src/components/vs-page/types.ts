import type VsPage from './VsPage.vue';
import type { TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsPage: typeof VsPage;
    }
}

export type { VsPage };

type PageTextStyleSet = TextStyleSet & { padding?: string };

export interface VsPageStyleSet extends PageTextStyleSet {
    title?: PageTextStyleSet;
    description?: PageTextStyleSet;
}
