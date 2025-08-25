import type VsFooter from './VsFooter.vue';
import type { VsBarStyleSet } from '@/components/vs-bar/types';

declare module 'vue' {
    interface GlobalComponents {
        VsFooter: typeof VsFooter;
    }
}

export type { VsFooter };

export interface VsFooterStyleSet extends VsBarStyleSet {}
