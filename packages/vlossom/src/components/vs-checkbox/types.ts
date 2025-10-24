import type VsCheckbox from './VsCheckbox.vue';
import type { SizeStyleSet, BoxStyleSet, TextStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsCheckbox: typeof VsCheckbox;
    }
}

export type { VsCheckbox };

export interface VsCheckboxStyleSet extends Omit<SizeStyleSet, 'width'> {
    borderRadius?: string;
    borderWidth?: string;
    checkboxColor?: string;
    checkboxSize?: string;
}
