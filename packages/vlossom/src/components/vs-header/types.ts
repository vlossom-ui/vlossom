import type { ComponentPublicInstance } from 'vue';
import type { VsBarStyleSet } from '@/components/vs-bar/types';
import type VsHeader from './VsHeader.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsHeader: typeof VsHeader;
    }
}

export type { VsHeader };

export interface VsHeaderRef extends ComponentPublicInstance<typeof VsHeader> {}

export interface VsHeaderStyleSet extends VsBarStyleSet {}
