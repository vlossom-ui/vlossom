import type VsSteps from './VsSteps.vue';
import type { BoxStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsSteps: typeof VsSteps;
    }
}

export type { VsSteps };

export interface VsStepsStyleSet extends BoxStyleSet {
    activeBackgroundColor?: string;
    activeBorderColor?: string;
    stepSize?: string;

    height?: string;
    width?: string;
}
