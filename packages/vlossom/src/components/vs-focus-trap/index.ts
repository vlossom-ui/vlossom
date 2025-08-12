import type VsFocusTrap from './VsFocusTrap.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsFocusTrap: typeof VsFocusTrap;
    }
}

export type { VsFocusTrap };
