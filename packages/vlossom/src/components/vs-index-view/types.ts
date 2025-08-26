import type VsIndexView from './VsIndexView.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsIndexView: typeof VsIndexView;
    }
}

export type { VsIndexView };
