import type { Component } from 'vue';

export interface ModalOptions {
    container?: string;
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
