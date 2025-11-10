import type { Component } from 'vue';
import type { ColorScheme, SizeProp, OverlayCallbacks } from '@/declaration';
import type { VsModalNodeStyleSet } from '@/components/vs-modal/types';

export interface ModalOptions {
    container?: string;
    colorScheme?: ColorScheme;
    styleSet?: string | VsModalNodeStyleSet;
    callbacks?: OverlayCallbacks;
    dimClose?: boolean;
    dimmed?: boolean;
    escClose?: boolean;
    focusLock?: boolean;
    hideScroll?: boolean;
    id?: string;
    initialFocusRef?: Record<string, any>;
    scrollLock?: boolean;
    size?: SizeProp | { width?: SizeProp; height?: SizeProp };
}

export interface ModalInfo extends ModalOptions {
    container: string;
    id: string;
    content: string | Component;
}

export interface ModalPlugin {
    open(content: string | Component, options?: ModalOptions): string;
    emit(eventName: string, ...args: any[]): void | Promise<void>;
    emitWithId(id: string, eventName: string, ...args: any[]): void | Promise<void>;
    close(container?: string): void;
    closeWithId(container: string, id: string): void;
    clear(container?: string): void;
}
