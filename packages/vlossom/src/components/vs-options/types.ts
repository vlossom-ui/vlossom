import type VsOptions from './VsOptions.vue';
import type { BoxStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsOptions: typeof VsOptions;
    }
}

export type { VsOptions };

export interface VsOptionsStyleSet extends BoxStyleSet {
    gap?: string;
    height?: string;
    option?: Omit<BoxStyleSet, 'backgroundColor'>;
}

export interface VsOptionsGroup {
    name: string;
    options: any[];
}
