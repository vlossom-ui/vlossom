import type { Component } from 'vue';
import type { ModalOptions } from '../modal-plugin';
import type { Alignment, ColorScheme, Message, Rule } from '@/declaration';
import type { VsButtonStyleSet, VsInputStyleSet, VsInputType, VsModalNodeStyleSet } from '@/components';

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

    inputType?: VsInputType;
    inputPlaceholder?: string;
    inputRules?: Rule<string | number | null>[];
    inputInitialValue?: string | number | null;
    inputLabel?: string;
    inputMessages?: Message<string | number | null>[];

    buttonOkText?: string;
    buttonCancelText?: string;
    swapButtons?: boolean;
}

export interface PromptPlugin {
    open(content: string | Component, options?: PromptModalOptions): Promise<string | number | null>;
}
