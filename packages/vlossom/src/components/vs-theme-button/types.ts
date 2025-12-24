import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, SizeStyleSet } from '@/declaration';
import type VsThemeButton from './VsThemeButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsThemeButton: typeof VsThemeButton;
    }
}

export type { VsThemeButton };

export interface VsThemeButtonRef extends ComponentPublicInstance<typeof VsThemeButton> {}

export interface VsThemeButtonStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
    iconColor?: string;
}
