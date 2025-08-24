import type VsForm from './VsForm.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsForm: typeof VsForm;
    }
}
