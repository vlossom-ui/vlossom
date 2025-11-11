import { markRaw, type Component } from 'vue';
import { stringUtil } from '@/utils';
import type { ModalInfo, ModalOptions } from './types';

export function createModalInfo(content: string | Component, options: ModalOptions): ModalInfo {
    return {
        ...options,
        container: options.container || 'body',
        id: options.id || `vs-modal-${stringUtil.createID()}`,
        content: typeof content === 'string' ? content : markRaw(content),
    };
}
