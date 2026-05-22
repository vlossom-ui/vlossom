import type { Component, CSSProperties } from 'vue';
import type { ModalOptions } from './../modal-plugin';
import type { ColorScheme, PropsOf, VsComponent } from '@/declaration';
import type { VsButtonStyleSet, VsInputStyleSet, VsInputValueType, VsModalNodeStyleSet } from '@/components';

export interface VsPromptStyleSet extends VsModalNodeStyleSet {
    $input?: Omit<VsInputStyleSet, '$append' | '$prepend'>;
    $buttons?: CSSProperties;
    $okButton?: Omit<VsButtonStyleSet, '$loading'>;
    $cancelButton?: Omit<VsButtonStyleSet, '$loading'>;
}

export interface PromptModalOptions extends Omit<ModalOptions, 'beforeClose'> {
    styleSet?: VsPromptStyleSet;
    colorScheme?: ColorScheme;
    input?: PropsOf<VsComponent.VsInput> & { initialValue?: VsInputValueType };
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

export interface PromptPlugin {
    open(content: string, options?: Omit<PromptModalOptions, 'componentProps'>): Promise<VsInputValueType>;
    open(content: Component, options?: PromptModalOptions): Promise<VsInputValueType>;
}
