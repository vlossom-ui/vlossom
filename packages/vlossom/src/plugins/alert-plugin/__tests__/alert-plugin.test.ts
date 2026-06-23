import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { ALERT_OK } from '@/declaration';
import { createAlertPlugin } from './../alert-plugin';
import type { ModalPlugin } from '@/plugins/modal-plugin';

describe('alert-plugin', () => {
    let registeredCallbacks: Record<string, (...args: any[]) => void>;
    let closeWithId: ReturnType<typeof vi.fn<(id: string) => Promise<boolean>>>;
    let modalPlugin: ModalPlugin;

    beforeEach(() => {
        registeredCallbacks = {};
        closeWithId = vi.fn<(id: string) => Promise<boolean>>(async () => true);
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
        expect(closeWithId).toHaveBeenCalledWith('modal-id');
    });

    it('Enter 키 콜백이 호출되면 resolve하고 모달을 닫는다', async () => {
        const alertPlugin = createAlertPlugin(modalPlugin);
        const promise = alertPlugin.open('알림입니다.', { container: '#root' });

        registeredCallbacks['key-Enter']?.();

        await expect(promise).resolves.toBeUndefined();
        expect(closeWithId).toHaveBeenCalledWith('modal-id');
    });

    it('기본적으로 Escape 키 콜백이 등록되며, 호출되면 resolve하고 모달을 닫는다', async () => {
        const alertPlugin = createAlertPlugin(modalPlugin);
        const promise = alertPlugin.open('알림입니다.');

        expect(registeredCallbacks['key-Escape']).toBeTypeOf('function');

        registeredCallbacks['key-Escape']?.();

        await expect(promise).resolves.toBeUndefined();
        expect(closeWithId).toHaveBeenCalledWith('modal-id');
    });

    it('escClose가 false면 Escape 키 콜백이 등록되지 않는다', () => {
        const alertPlugin = createAlertPlugin(modalPlugin);
        alertPlugin.open('알림입니다.', { escClose: false });

        expect(registeredCallbacks['key-Escape']).toBeUndefined();
    });

    it('모달 노드의 자체 Escape 닫기를 비활성화하기 위해 escClose: false로 모달을 연다', () => {
        const alertPlugin = createAlertPlugin(modalPlugin);
        alertPlugin.open('알림입니다.');

        const passedOptions = (modalPlugin.open as any).mock.calls[0][1];
        expect(passedOptions.escClose).toBe(false);
    });

    it('componentProps와 플러그인 전용 옵션은 modalPlugin.open에 전달되지 않고, ModalOptions는 전달된다', () => {
        const alertPlugin = createAlertPlugin(modalPlugin);
        const SomeComp = defineComponent({ template: '<div />' });

        alertPlugin.open(SomeComp, { componentProps: { foo: 'bar' }, okText: '확인', colorScheme: 'red' });

        const passedOptions = (modalPlugin.open as any).mock.calls[0][1];
        expect(passedOptions.componentProps).toBeUndefined();
        expect(passedOptions.okText).toBeUndefined();
        expect(passedOptions.colorScheme).toBe('red');
    });
});
