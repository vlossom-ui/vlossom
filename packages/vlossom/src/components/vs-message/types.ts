import type { ComponentPublicInstance, CSSProperties } from 'vue';
import type VsMessage from './VsMessage.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsMessage: typeof VsMessage;
    }
}

export type { VsMessage };

export interface VsMessageRef extends ComponentPublicInstance<typeof VsMessage> {}

export interface VsMessageStyleSet {
    variables?: {
        size?: string;
    };
    component?: CSSProperties;
}
