import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsThemeButton from './VsThemeButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsThemeButton: typeof VsThemeButton;
    }
}

export type { VsThemeButton };

export interface VsThemeButtonRef extends ComponentPublicInstance<typeof VsThemeButton> {}

export interface VsThemeButtonStyleSet {
    variables?: {
        width?: string;
        height?: string;
        iconColor?: string;
    };
    component?: CSSProperties;
}
