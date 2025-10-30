import { markRaw, type Component } from 'vue';
import { stringUtil } from '@/utils';
import type { ModalInfo, ModalOptions } from './types';

export function createModalInfo(content: string | Component, options: Partial<ModalOptions>): ModalInfo {
    return {
        container: 'body',
        id: `vs-modal-${stringUtil.createID()}`,
        ...options,
        content: typeof content === 'string' ? content : markRaw(content),
    };
}
