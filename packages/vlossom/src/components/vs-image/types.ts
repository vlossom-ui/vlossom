import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';
import type { VsSkeletonStyleSet } from '@/components/vs-skeleton/types';
import type VsImage from './VsImage.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsImage: typeof VsImage;
    }
}

export type { VsImage };

export interface VsImageRef extends ComponentPublicInstance<typeof VsImage> {}

export interface VsImageStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';

    skeleton?: VsSkeletonStyleSet;
}
