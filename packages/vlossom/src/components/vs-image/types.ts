import type VsImage from './VsImage.vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';
import type { VsSkeletonStyleSet } from '../vs-skeleton/types';

declare module 'vue' {
    interface GlobalComponents {
        VsImage: typeof VsImage;
    }
}

export type { VsImage };

export interface VsImageStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
    objectFit?: string;
    skeleton?: VsSkeletonStyleSet;
}
