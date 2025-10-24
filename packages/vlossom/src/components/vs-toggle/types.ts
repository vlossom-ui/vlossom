import type VsToggle from './VsToggle.vue';
import type { VsButtonStyleSet } from '@/components/vs-button/types';

declare module 'vue' {
    interface GlobalComponents {
        VsToggle: typeof VsToggle;
    }
}

export type { VsToggle };

export interface VsToggleStyleSet extends VsButtonStyleSet {}
