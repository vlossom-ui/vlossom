import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { ALERT_OK } from '@/declaration';
import { createAlertPlugin } from './../alert-plugin';
import type { ModalPlugin } from '@/plugins/modal-plugin';

describe('alert-plugin', () => {
    let registeredCallbacks: Record<string, (...args: any[]) => void>;
    let closeWithId: ReturnType<typeof vi.fn<(container: string, id: string) => Promise<boolean>>>;
    let modalPlugin: ModalPlugin;

    beforeEach(() => {
        registeredCallbacks = {};
        closeWithId = vi.fn<(container: string, id: string) => Promise<boolean>>(async () => true);
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

    it('componentProps는 modalPlugin.open에 전달되지 않아야 한다', () => {
        const alertPlugin = createAlertPlugin(modalPlugin);
        const SomeComp = defineComponent({ template: '<div />' });

        alertPlugin.open(SomeComp, { componentProps: { foo: 'bar' }, okText: '확인' });

        const callArgs = (modalPlugin.open as any).mock.calls[0];
        const passedOptions = callArgs[1];
        expect(passedOptions.componentProps).toBeUndefined();
        expect(passedOptions.okText).toBe('확인');
    });
});
