import type { ComponentPublicInstance } from 'vue';
import type { BoxStyleSet, SizeStyleSet } from '@/declaration';
import type VsSteps from './VsSteps.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSteps: typeof VsSteps;
    }
}

export type { VsSteps };

export interface VsStepsRef extends ComponentPublicInstance<typeof VsSteps> {}

interface StepStyleSet extends BoxStyleSet {
    size?: string;
}

export interface VsStepsStyleSet extends SizeStyleSet {
    step?: StepStyleSet;
    activeStep?: StepStyleSet;
}
