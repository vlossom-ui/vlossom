import type { Component } from 'vue';
import type { ModalComponentOptions } from '@/declaration';
import type { VsConfirmStyleSet } from '@/components/vs-confirm/types';

export interface ConfirmOptions extends ModalComponentOptions<VsConfirmStyleSet> {
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

export interface ConfirmPlugin {
    open(content: string | Component, confirmOptions?: ConfirmOptions): Promise<boolean>;
}
