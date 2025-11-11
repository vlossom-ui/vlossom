import type { Component } from 'vue';
import type { ModalOptions } from '@/declaration';
import type { VsConfirmStyleSet } from '@/components/vs-confirm/types';

export interface ConfirmModalOptions extends ModalOptions<VsConfirmStyleSet> {
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

export interface ConfirmPlugin {
    open(content: string | Component, options?: ConfirmModalOptions): Promise<boolean>;
}
