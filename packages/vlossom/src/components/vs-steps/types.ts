import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsSteps from './VsSteps.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsSteps: typeof VsSteps;
    }
}

export type { VsSteps };

export interface VsStepsRef extends ComponentPublicInstance<typeof VsSteps> {}

export interface VsStepsStyleSet extends CSSProperties {
    $stepSize?: string;

    $steps?: CSSProperties;
    $step?: CSSProperties & {
        $completed?: CSSProperties;
        $active?: CSSProperties;
    };
    $label?: CSSProperties & {
        $completed?: CSSProperties;
        $active?: CSSProperties;
    };
    $progress?: CSSProperties & {
        $active?: CSSProperties;
    };
}
