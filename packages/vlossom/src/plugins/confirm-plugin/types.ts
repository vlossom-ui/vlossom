import type { Component } from 'vue';
import type { ColorScheme } from '@/declaration';
import type { ModalOptions } from '@/plugins/modal-plugin';
import type { VsConfirmStyleSet } from '@/components/vs-confirm/types';

export interface ConfirmModalOptions extends ModalOptions {
    styleSet?: string | VsConfirmStyleSet;
    colorScheme?: ColorScheme;
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

export interface ConfirmPlugin {
    open(content: string | Component, options?: ConfirmModalOptions): Promise<boolean>;
}
