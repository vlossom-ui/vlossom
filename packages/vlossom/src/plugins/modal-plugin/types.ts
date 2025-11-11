import type { Component } from 'vue';
import type { ModalComponentOptions } from '@/declaration';
import type { VsModalNodeStyleSet } from '@/components/vs-modal/types';

export interface ModalOptions extends ModalComponentOptions<VsModalNodeStyleSet> {}

export interface ModalInfo extends ModalComponentOptions<unknown> {
    container: string;
    id: string;
    content: string | Component;
}

export interface ModalPlugin {
    open(content: string | Component, options?: ModalComponentOptions<unknown>): string;
    emit(eventName: string, ...args: any[]): void | Promise<void>;
    emitWithId(id: string, eventName: string, ...args: any[]): void | Promise<void>;
    close(container?: string): void;
    closeWithId(container: string, id: string): void;
    clear(container?: string): void;
}
