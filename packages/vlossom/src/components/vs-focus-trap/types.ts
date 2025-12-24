import type { ComponentPublicInstance } from 'vue';
import type { FocusableRef } from '@/declaration';
import type VsFocusTrap from './VsFocusTrap.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsFocusTrap: typeof VsFocusTrap;
    }
}

export type { VsFocusTrap };

export interface VsFocusTrapRef extends ComponentPublicInstance<typeof VsFocusTrap>, FocusableRef {}
