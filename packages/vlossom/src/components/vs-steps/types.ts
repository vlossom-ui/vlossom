import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsSteps from './VsSteps.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSteps: typeof VsSteps;
    }
}

export type { VsSteps };

export interface VsStepsRef extends ComponentPublicInstance<typeof VsSteps> {}

interface StepVariables {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;
    size?: string;
}

export interface VsStepsStyleSet {
    variables?: {
        height?: string;
        width?: string;
        step?: StepVariables;
        activeStep?: StepVariables;
    };
    component?: CSSProperties;
}
