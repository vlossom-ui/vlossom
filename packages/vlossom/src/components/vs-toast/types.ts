import type { Alignment, BoxStyleSet, ColorScheme, Placement, SizeStyleSet } from '@/declaration';
import type VsToast from './VsToast.vue';
import type { Component } from 'vue';

declare module 'vue' {
    interface GlobalComponents {
        VsToast: typeof VsToast;
    }
}

export type { VsToast };

export interface VsToastStyleSet extends SizeStyleSet, BoxStyleSet {
    fontColor?: string;
}

export interface ToastOptions {
    container?: string;
    colorScheme?: ColorScheme;
    styleSet?: string | VsToastStyleSet;
    align?: Alignment;
    autoClose?: boolean;
    placement?: Exclude<Placement, 'left' | 'right'>;
    primary?: boolean;
    timeout?: number;
    logger?: (message: string | Component) => string;
}

export interface ToastInfo extends ToastOptions {
    container: string;
    id: string;
    content: string | Component;
}
