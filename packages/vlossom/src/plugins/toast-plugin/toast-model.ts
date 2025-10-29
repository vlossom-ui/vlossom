import { markRaw, type Component } from 'vue';
import { stringUtil } from '@/utils';
import type { ToastInfo, ToastOptions } from './types';

export function createToastInfo(content: string | Component, options: Partial<ToastOptions>): ToastInfo {
    return {
        container: 'body',
        id: `vs-toast-${stringUtil.createID()}`,
        placement: 'top',
        align: 'center',
        ...options,
        content: typeof content === 'string' ? content : markRaw(content),
    };
}
