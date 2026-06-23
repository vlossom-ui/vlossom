import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { CONFIRM_CANCEL, CONFIRM_OK } from '@/declaration';
import { createConfirmPlugin } from './../confirm-plugin';
import type { ModalPlugin } from '@/plugins/modal-plugin';

describe('confirm-plugin', () => {
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

    it('확인 콜백이 호출되면 true로 resolve되고 모달이 닫힌다', async () => {
        const confirmPlugin = createConfirmPlugin(modalPlugin);
        const promise = confirmPlugin.open('계속 진행하시겠습니까?');

        registeredCallbacks[CONFIRM_OK]?.();

        await expect(promise).resolves.toBe(true);
        expect(closeWithId).toHaveBeenCalledWith('modal-id');
    });

    it('취소 콜백이 호출되면 false로 resolve되고 모달이 닫힌다', async () => {
        const confirmPlugin = createConfirmPlugin(modalPlugin);
        const promise = confirmPlugin.open('계속 진행하시겠습니까?');

        registeredCallbacks[CONFIRM_CANCEL]?.();

        await expect(promise).resolves.toBe(false);
        expect(closeWithId).toHaveBeenCalledWith('modal-id');
    });

    it('Enter 키 콜백이 호출되면 true로 resolve하고 모달을 닫는다', async () => {
        const confirmPlugin = createConfirmPlugin(modalPlugin);
        const promise = confirmPlugin.open('계속 진행하시겠습니까?', { container: '#root' });

        registeredCallbacks['key-Enter']?.();

        await expect(promise).resolves.toBe(true);
        expect(closeWithId).toHaveBeenCalledWith('modal-id');
    });

    it('기본적으로 Escape 키 콜백이 등록되며, 호출되면 false로 resolve하고 모달을 닫는다', async () => {
        const confirmPlugin = createConfirmPlugin(modalPlugin);
        const promise = confirmPlugin.open('계속 진행하시겠습니까?');

        expect(registeredCallbacks['key-Escape']).toBeTypeOf('function');

        registeredCallbacks['key-Escape']?.();

        await expect(promise).resolves.toBe(false);
        expect(closeWithId).toHaveBeenCalledWith('modal-id');
    });

    it('escClose가 false면 Escape 키 콜백이 등록되지 않는다', () => {
        const confirmPlugin = createConfirmPlugin(modalPlugin);
        confirmPlugin.open('계속 진행하시겠습니까?', { escClose: false });

        expect(registeredCallbacks['key-Escape']).toBeUndefined();
    });

    it('모달 노드의 자체 Escape 닫기를 비활성화하기 위해 escClose: false로 모달을 연다', () => {
        const confirmPlugin = createConfirmPlugin(modalPlugin);
        confirmPlugin.open('계속 진행하시겠습니까?');

        const passedOptions = (modalPlugin.open as any).mock.calls[0][1];
        expect(passedOptions.escClose).toBe(false);
    });

    it('componentProps와 플러그인 전용 옵션은 modalPlugin.open에 전달되지 않고, ModalOptions는 전달된다', () => {
        const confirmPlugin = createConfirmPlugin(modalPlugin);
        const SomeComp = defineComponent({ template: '<div />' });

        confirmPlugin.open(SomeComp, {
            componentProps: { foo: 'bar' },
            okText: '확인',
            cancelText: '취소',
            swapButtons: true,
            colorScheme: 'red',
        });

        const passedOptions = (modalPlugin.open as any).mock.calls[0][1];
        expect(passedOptions.componentProps).toBeUndefined();
        expect(passedOptions.okText).toBeUndefined();
        expect(passedOptions.cancelText).toBeUndefined();
        expect(passedOptions.swapButtons).toBeUndefined();
        expect(passedOptions.colorScheme).toBe('red');
    });
});
