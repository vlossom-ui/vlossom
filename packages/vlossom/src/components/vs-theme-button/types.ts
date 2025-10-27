import type VsThemeButton from './VsThemeButton.vue';
import type { BoxStyleSet, SizeStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsThemeButton: typeof VsThemeButton;
    }
}

export type { VsThemeButton };

export interface VsThemeButtonStyleSet extends SizeStyleSet, Omit<BoxStyleSet, 'padding'> {
    iconColor?: string;
}
