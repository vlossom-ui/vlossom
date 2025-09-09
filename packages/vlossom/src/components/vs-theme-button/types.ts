import type VsThemeButton from './VsThemeButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsThemeButton: typeof VsThemeButton;
    }
}

export type { VsThemeButton };

export interface VsThemeButtonStyleSet {}
