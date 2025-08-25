import type { VsSkeletonStyleSet } from '../vs-skeleton/types';
import type VsImage from './VsImage.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsImage: typeof VsImage;
    }
}

export type { VsImage };

export interface VsImageStyleSet {
    width?: string;
    height?: string;
    border?: string;
    borderRadius?: string;
    objectFit?: string;
    skeleton?: VsSkeletonStyleSet;
}
