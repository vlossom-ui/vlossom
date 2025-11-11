import { markRaw, type Component } from 'vue';
import { stringUtil } from '@/utils';
import type { ModalComponentOptions } from '@/declaration';
import type { ModalInfo } from './types';

export function createModalInfo(content: string | Component, options: ModalComponentOptions): ModalInfo {
    return {
        ...options,
        container: options.container || 'body',
        id: options.id || `vs-modal-${stringUtil.createID()}`,
        content: typeof content === 'string' ? content : markRaw(content),
    };
}
