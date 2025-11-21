import type { Component } from 'vue';
import type { Alignment, ColorScheme } from '@/declaration';
import type { ModalOptions } from '@/plugins/modal-plugin';
import type { VsButtonStyleSet, VsModalNodeStyleSet } from '@/components';

export interface VsConfirmStyleSet extends VsModalNodeStyleSet {
    buttonsGap?: string;
    buttonsAlign?: Alignment;
    okButton?: Omit<VsButtonStyleSet, 'loading'>;
    cancelButton?: Omit<VsButtonStyleSet, 'loading'>;
}

export interface ConfirmModalOptions extends ModalOptions {
    styleSet?: VsConfirmStyleSet;
    colorScheme?: ColorScheme;
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

export interface ConfirmPlugin {
    open(content: string | Component, options?: ConfirmModalOptions): Promise<boolean>;
}
