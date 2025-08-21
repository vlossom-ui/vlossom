import type VsHeader from './VsHeader.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsHeader: typeof VsHeader;
    }
}

export type { VsHeader };
export type { VsHeaderStyleSet } from './types';

