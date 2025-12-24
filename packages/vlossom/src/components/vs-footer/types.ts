import type { ComponentPublicInstance } from 'vue';
import type { VsBarStyleSet } from '@/components/vs-bar/types';
import type VsFooter from './VsFooter.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsFooter: typeof VsFooter;
    }
}

export type { VsFooter };

export interface VsFooterRef extends ComponentPublicInstance<typeof VsFooter> {}

export interface VsFooterStyleSet extends VsBarStyleSet {}
