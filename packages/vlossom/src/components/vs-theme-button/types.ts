import type { BoxStyleSet, SizeStyleSet } from '@/main';
import type VsThemeButton from './VsThemeButton.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsThemeButton: typeof VsThemeButton;
    }
}

export type { VsThemeButton };

export interface VsThemeButtonStyleSet extends SizeStyleSet, BoxStyleSet {
    iconColor?: string;
}
