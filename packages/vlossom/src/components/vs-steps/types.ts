import type VsSteps from './VsSteps.vue';
import type { BoxStyleSet, SizeStyleSet } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsSteps: typeof VsSteps;
    }
}

export type { VsSteps };

interface StepStyleSet extends BoxStyleSet {
    size?: string;
}

export interface VsStepsStyleSet extends SizeStyleSet {
    step?: StepStyleSet;
    activeStep?: StepStyleSet;
}
