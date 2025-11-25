import type { Component } from 'vue';
import type { Alignment, ColorScheme } from '@/declaration';
import type { ModalOptions } from '../modal-plugin';
import type { VsButtonStyleSet, VsModalNodeStyleSet } from '@/components';

export interface VsAlertStyleSet extends VsModalNodeStyleSet {
    buttonsAlign?: Alignment;
    button?: Omit<VsButtonStyleSet, 'loading'>;
}

export interface AlertModalOptions extends ModalOptions {
    styleSet?: VsAlertStyleSet;
    colorScheme?: ColorScheme;
    okText?: string;
}

export interface AlertPlugin {
    open(content: string | Component, options?: AlertModalOptions): Promise<void>;
}
