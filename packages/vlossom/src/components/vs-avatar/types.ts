import type VsAvatar from './VsAvatar.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsAvatar: typeof VsAvatar;
    }
}

export interface VsAvatarStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    height?: string;
    objectFit?: 'cover' | 'fill' | 'contain' | 'none' | 'scale-down';
    width?: string;
}
