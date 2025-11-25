import type { Component } from 'vue';
import type { ModalOptions } from '../modal-plugin';
import type { Alignment, ColorScheme, PropsOf, VsComponent } from '@/declaration';
import type { VsButtonStyleSet, VsInputStyleSet, VsInputValueType, VsModalNodeStyleSet } from '@/components';

export interface VsPromptStyleSet extends VsModalNodeStyleSet {
    input?: Omit<VsInputStyleSet, 'append' | 'prepend'>;
    buttonsGap?: string | number;
    buttonsAlign?: Alignment;
    okButton?: Omit<VsButtonStyleSet, 'loading'>;
    cancelButton?: Omit<VsButtonStyleSet, 'loading'>;
}

export interface PromptModalOptions extends ModalOptions {
    styleSet?: VsPromptStyleSet;
    colorScheme?: ColorScheme;
    input?: PropsOf<VsComponent.VsInput> & { initialValue?: VsInputValueType };
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

export interface PromptPlugin {
    open(content: string | Component, options?: PromptModalOptions): Promise<VsInputValueType>;
}
