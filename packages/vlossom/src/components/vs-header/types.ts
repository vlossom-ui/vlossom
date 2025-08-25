import type VsHeader from './VsHeader.vue';
import type { VsBarStyleSet } from '@/components/vs-bar/types';

declare module 'vue' {
    interface GlobalComponents {
        VsHeader: typeof VsHeader;
    }
}

export type { VsHeader };

export interface VsHeaderStyleSet extends VsBarStyleSet {}
