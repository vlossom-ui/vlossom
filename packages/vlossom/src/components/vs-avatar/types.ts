import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsAvatar from './VsAvatar.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsAvatar: typeof VsAvatar;
    }
}

export type { VsAvatar };

export interface VsAvatarRef extends ComponentPublicInstance<typeof VsAvatar> {}

export interface VsAvatarStyleSet {
    variables?: {
        objectFit?: CSSProperties['objectFit'] & {};
    };
    component?: CSSProperties;
}
