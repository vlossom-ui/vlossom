import type VsOptions from './VsOptions.vue';
import type { BoxStyleSet, SizeStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsOptions: typeof VsOptions;
    }
}

export type { VsOptions };

export interface VsOptionsStyleSet extends SizeStyleSet, BoxStyleSet {
    option?: { gap?: string } & Omit<BoxStyleSet, 'backgroundColor'>;
}

export interface VsOptionsGroup {
    name: string;
    options: any[];
}
