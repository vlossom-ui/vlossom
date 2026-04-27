import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ALERT_OK } from '@/declaration';
import { createAlertPlugin } from './../alert-plugin';
import type { ModalPlugin } from '@/plugins/modal-plugin';

describe('alert-plugin', () => {
    let registeredCallbacks: Record<string, (...args: any[]) => void>;
    let closeWithId: ReturnType<typeof vi.fn<(container: string, id: string) => void>>;
    let modalPlugin: ModalPlugin;

    beforeEach(() => {
        registeredCallbacks = {};
        closeWithId = vi.fn<(container: string, id: string) => void>();
        modalPlugin = {
            open: vi.fn((_content: any, options) => {
                registeredCallbacks = options?.callbacks ?? {};
                return 'modal-id';
            }),
            closeWithId,
            close: vi.fn(),
            emit: vi.fn(),
            emitWithId: vi.fn(),
            clear: vi.fn(),
        };
    });

    it('확인 콜백이 호출되면 Promise가 resolve되고 모달이 닫힌다', async () => {
        const alertPlugin = createAlertPlugin(modalPlugin);
        const promise = alertPlugin.open('알림입니다.');

        registeredCallbacks[ALERT_OK]?.();

        await expect(promise).resolves.toBeUndefined();
        expect(closeWithId).toHaveBeenCalledWith('body', 'modal-id');
    });

    it('Enter 키 콜백이 호출되면 resolve하고 모달을 닫는다', async () => {
        const alertPlugin = createAlertPlugin(modalPlugin);
        const promise = alertPlugin.open('알림입니다.', { container: '#root' });

        registeredCallbacks['key-Enter']?.();

        await expect(promise).resolves.toBeUndefined();
        expect(closeWithId).toHaveBeenCalledWith('#root', 'modal-id');
    });

    it('Escape 키 콜백이 호출되면 resolve하고 모달을 닫는다', async () => {
        const alertPlugin = createAlertPlugin(modalPlugin);
        const promise = alertPlugin.open('알림입니다.');

        registeredCallbacks['key-Escape']?.();

        await expect(promise).resolves.toBeUndefined();
        expect(closeWithId).toHaveBeenCalledWith('body', 'modal-id');
    });
});
