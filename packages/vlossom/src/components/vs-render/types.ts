import type VsRender from './VsRender.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsRender: typeof VsRender;
    }
}
