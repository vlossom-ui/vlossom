import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsSteps from './VsSteps.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSteps: typeof VsSteps;
    }
}

export type { VsSteps };

export interface VsStepsRef extends ComponentPublicInstance<typeof VsSteps> {}

export interface VsStepsStyleSet {
    $stepSize?: string;

    $component?: CSSProperties;
    $steps?: CSSProperties;
    $step?: CSSProperties;
    $activeStep?: CSSProperties;
    $label?: CSSProperties;
    $activeLabel?: CSSProperties;
    $progress?: CSSProperties;
    $activeProgress?: CSSProperties;
}
