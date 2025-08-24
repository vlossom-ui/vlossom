import type VsResponsive from './VsResponsive.vue';

declare module 'vue' {
    interface GlobalComponents {
        VsResponsive: typeof VsResponsive;
    }
}
