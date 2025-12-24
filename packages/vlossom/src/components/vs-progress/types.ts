import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';
import type VsProgress from './VsProgress.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsProgress: typeof VsProgress;
    }
}

export type { VsProgress };

export interface VsProgressRef extends ComponentPublicInstance<typeof VsProgress> {}

export interface VsProgressStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'opacity' | 'padding'> {
    fontColor?: string;
    textShadow?: string;
    valueColor?: string;
}
