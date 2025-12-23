import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, SizeStyleSet } from '@/declaration';
import type VsOptions from './VsOptions.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsOptions: typeof VsOptions;
    }
}

export type { VsOptions };

export interface VsOptionsStyleSet extends SizeStyleSet, BoxStyleSet {
    gap?: string;
    group?: BoxStyleSet;
    option?: BoxStyleSet;
}

export interface VsOptionsItem {
    id: string;
    item: any;
    label: string;
    value: any;
    index: number;
    disabled: boolean;
}

export interface VsOptionsGroup {
    name: string;
    options: VsOptionsItem[];
}

export interface VsOptionsRef extends ComponentPublicInstance<typeof VsOptions> {
    scrollToOption: (option: any) => void;
}
