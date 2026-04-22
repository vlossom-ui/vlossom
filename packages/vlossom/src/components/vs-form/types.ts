import type { ComponentPublicInstance, ComputedRef } from 'vue';
import type VsForm from './VsForm.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsForm: typeof VsForm;
    }
}

export type { VsForm };

export interface VsFormRef extends ComponentPublicInstance<typeof VsForm> {
    valid: ComputedRef<boolean>;
    changed: ComputedRef<boolean>;
    clear: () => void;
    validate: () => Promise<boolean>;
}
