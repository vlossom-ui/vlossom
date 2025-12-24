import type { ComponentPublicInstance } from 'vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';
import type VsAvatar from './VsAvatar.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsAvatar: typeof VsAvatar;
    }
}

export type { VsAvatar };

export interface VsAvatarRef extends ComponentPublicInstance<typeof VsAvatar> {}

export interface VsAvatarStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
    fontColor?: string;
    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';
}
