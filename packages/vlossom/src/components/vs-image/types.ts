import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type { VsSkeletonStyleSet } from '@/components/vs-skeleton/types';
import type VsImage from './VsImage.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsImage: typeof VsImage;
    }
}

export type { VsImage };

export interface VsImageRef extends ComponentPublicInstance<typeof VsImage> {}

export interface VsImageStyleSet {
    variables?: {
        width?: string;
        height?: string;
    };
    skeleton?: VsSkeletonStyleSet;
    component?: CSSProperties;
}
