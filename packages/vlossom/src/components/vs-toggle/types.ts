import type { ComponentPublicInstance } from 'vue';
import type { VsButtonStyleSet } from '@/components/vs-button/types';
import type VsToggle from './VsToggle.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsToggle: typeof VsToggle;
    }
}

export type { VsToggle };

export interface VsToggleRef extends ComponentPublicInstance<typeof VsToggle> {
    toggle: () => void;
}

export interface VsToggleStyleSet extends VsButtonStyleSet {}
