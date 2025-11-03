import type { Component } from 'vue';
import type { ColorScheme, Alignment, Placement } from '@/declaration';
import type { VsToastStyleSet } from '@/components/vs-toast/types';

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

export interface ToastPlugin {
    show(message: string | Component, options?: ToastOptions): void;
    info(message: string | Component, options?: ToastOptions): void;
    success(message: string | Component, options?: ToastOptions): void;
    warning(message: string | Component, options?: ToastOptions): void;
    error(message: string | Component, options?: ToastOptions): void;
    remove(container: string, id: string): void;
    clear(container?: string): void;
}
