import type { Component } from 'vue';
import type { ModalComponentOptions } from '@/declaration';

export interface ModalInfo extends ModalComponentOptions {
    container: string;
    id: string;
    content: string | Component;
}

export interface ModalPlugin {
    open(content: string | Component, options?: ModalComponentOptions): string;
    emit(eventName: string, ...args: any[]): void | Promise<void>;
    emitWithId(id: string, eventName: string, ...args: any[]): void | Promise<void>;
    close(container?: string): void;
    closeWithId(container: string, id: string): void;
    clear(container?: string): void;
}
