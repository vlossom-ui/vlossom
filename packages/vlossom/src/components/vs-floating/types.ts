import type { ComponentPublicInstance } from 'vue';
import type VsFloating from './VsFloating.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsFloating: typeof VsFloating;
    }
}

export type { VsFloating };

export interface VsFloatingRef extends ComponentPublicInstance<typeof VsFloating> {}
