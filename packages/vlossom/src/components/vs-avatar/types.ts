import type VsAvatar from './VsAvatar.vue';
import type { BoxStyleSet, SizeStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsAvatar: typeof VsAvatar;
    }
}

export type { VsAvatar };

export interface VsAvatarStyleSet
    extends SizeStyleSet,
        Omit<BoxStyleSet, 'display' | 'padding'>,
        Omit<TextStyleSet, 'whiteSpace' | 'lineHeight'> {
    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';
}
