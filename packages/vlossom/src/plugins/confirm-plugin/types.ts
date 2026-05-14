import type { Component, CSSProperties } from 'vue';
import type { ColorScheme } from '@/declaration';
import type { ModalOptions } from '@/plugins/modal-plugin';
import type { VsButtonStyleSet, VsModalNodeStyleSet } from '@/components';

export interface VsConfirmStyleSet extends VsModalNodeStyleSet {
    $buttons?: CSSProperties;
    $okButton?: Omit<VsButtonStyleSet, '$loading'>;
    $cancelButton?: Omit<VsButtonStyleSet, '$loading'>;
}

export interface ConfirmModalOptions extends Omit<ModalOptions, 'beforeClose'> {
    styleSet?: VsConfirmStyleSet;
    colorScheme?: ColorScheme;
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

export interface ConfirmPlugin {
    open(content: string | Component, options?: ConfirmModalOptions): Promise<boolean>;
}
