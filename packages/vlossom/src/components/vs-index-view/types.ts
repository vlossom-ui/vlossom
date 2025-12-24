import type { ComponentPublicInstance } from 'vue';
import type VsIndexView from './VsIndexView.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsIndexView: typeof VsIndexView;
    }
}

export type { VsIndexView };

export interface VsIndexViewRef extends ComponentPublicInstance<typeof VsIndexView> {
    updateIndex: (index: number) => void;
}
