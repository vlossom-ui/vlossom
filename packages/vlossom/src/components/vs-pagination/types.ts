import type { ComponentPublicInstance } from 'vue';
import type { VsButtonStyleSet } from '@/components/vs-button/types';
import type VsPagination from './VsPagination.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsPagination: typeof VsPagination;
    }
}

export type { VsPagination };

export interface VsPaginationRef extends ComponentPublicInstance<typeof VsPagination> {
    goFirst: () => void;
    goLast: () => void;
    goPrev: () => void;
    goNext: () => void;
    setPage: (page: number) => void;
}

export interface VsPaginationStyleSet {
    variables?: {
        gap?: string;
    };
    pageButton?: Omit<VsButtonStyleSet, 'loading'>;
    controlButton?: Omit<VsButtonStyleSet, 'loading'>;
}
