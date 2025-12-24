import type { ComponentPublicInstance, ComputedRef } from 'vue';
import type { FormChildRef } from '@/declaration';
import type VsForm from './VsForm.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsForm: typeof VsForm;
    }
}

export type { VsForm };

export interface VsFormRef extends ComponentPublicInstance<typeof VsForm>, FormChildRef {
    valid: ComputedRef<boolean>;
    changed: ComputedRef<boolean>;
}
