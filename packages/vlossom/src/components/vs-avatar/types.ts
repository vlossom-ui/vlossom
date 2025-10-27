import type VsAvatar from './VsAvatar.vue';
import type { SizeStyleSet, BoxStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsAvatar: typeof VsAvatar;
    }
}

export type { VsAvatar };

export interface VsAvatarStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
    fontColor?: string;
    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';
}
