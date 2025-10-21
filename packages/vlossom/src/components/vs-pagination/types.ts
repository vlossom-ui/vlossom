import type VsPagination from './VsPagination.vue';
import type { VsButtonStyleSet } from '@/components/vs-button/types';

declare module 'vue' {
    interface GlobalComponents {
        VsPagination: typeof VsPagination;
    }
}

export type { VsPagination };

export interface VsPaginationStyleSet {
    gap?: string;
    pageButton?: Omit<VsButtonStyleSet, 'loading'>;
    edgeButton?: Omit<VsButtonStyleSet, 'loading'>;
}
