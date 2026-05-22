import type { Component, CSSProperties } from 'vue';
import type { ColorScheme } from '@/declaration';
import type { ModalOptions } from './../modal-plugin';
import type { VsButtonStyleSet, VsModalNodeStyleSet } from '@/components';

export interface VsAlertStyleSet extends VsModalNodeStyleSet {
    $buttons?: CSSProperties;
    $okButton?: Omit<VsButtonStyleSet, '$loading'>;
}

export interface AlertModalOptions extends Omit<ModalOptions, 'beforeClose'> {
    styleSet?: VsAlertStyleSet;
    colorScheme?: ColorScheme;
    okText?: string;
}

export interface AlertPlugin {
    open(content: string, options?: Omit<AlertModalOptions, 'componentProps'>): Promise<void>;
    open(content: Component, options?: AlertModalOptions): Promise<void>;
}
