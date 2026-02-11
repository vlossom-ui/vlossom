import type { ComponentPublicInstance } from 'vue';
import type VsMessage from './VsMessage.vue';
import type { Size } from '@/declaration';

declare module 'vue' {
    interface GlobalComponents {
        VsMessage: typeof VsMessage;
    }
}

export type { VsMessage };

export interface VsMessageRef extends ComponentPublicInstance<typeof VsMessage> {}

export interface VsMessageStyleSet {
    size?: Size;
}
