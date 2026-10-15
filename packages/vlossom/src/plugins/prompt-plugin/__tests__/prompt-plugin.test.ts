import { describe, it, expect, vi, beforeEach } from 'vitest';
import { defineComponent } from 'vue';
import { OVERLAY_CLOSE, PROMPT_CANCEL } from '@/declaration';
import { createPromptPlugin } from './../prompt-plugin';
import type { ModalPlugin } from '@/plugins/modal-plugin';

describe('prompt-plugin', () => {
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

    it('취소 콜백이 호출되면 null로 resolve되고 모달이 닫힌다', async () => {
        const promptPlugin = createPromptPlugin(modalPlugin);
        const promise = promptPlugin.open('이름을 입력하세요.');

        registeredCallbacks[PROMPT_CANCEL]?.();

        await expect(promise).resolves.toBeNull();
        expect(closeWithId).toHaveBeenCalledWith('modal-id');
    });

    it('기본적으로 Escape 키 콜백이 등록되며, 호출되면 null로 resolve하고 모달을 닫는다', async () => {
        const promptPlugin = createPromptPlugin(modalPlugin);
        const promise = promptPlugin.open('이름을 입력하세요.');

        expect(registeredCallbacks['key-Escape']).toBeTypeOf('function');

        registeredCallbacks['key-Escape']?.();

        await expect(promise).resolves.toBeNull();
        expect(closeWithId).toHaveBeenCalledWith('modal-id');
    });

    it('escClose가 false면 Escape 키 콜백이 등록되지 않는다', () => {
        const promptPlugin = createPromptPlugin(modalPlugin);
        promptPlugin.open('이름을 입력하세요.', { escClose: false });

        expect(registeredCallbacks['key-Escape']).toBeUndefined();
    });

    it('overlay close 콜백이 호출되면 null로 resolve되고 직접 닫기 호출은 하지 않는다', async () => {
        const promptPlugin = createPromptPlugin(modalPlugin);
        const promise = promptPlugin.open('이름을 입력하세요.');

        registeredCallbacks[OVERLAY_CLOSE]?.();

        await expect(promise).resolves.toBeNull();
        expect(closeWithId).not.toHaveBeenCalled();
    });

    it('모달 노드의 자체 Escape 닫기를 비활성화하기 위해 escClose: false로 모달을 연다', () => {
        const promptPlugin = createPromptPlugin(modalPlugin);
        promptPlugin.open('이름을 입력하세요.');

        const passedOptions = (modalPlugin.open as any).mock.calls[0][1];
        expect(passedOptions.escClose).toBe(false);
    });

    it('기본적으로 backClose: true로 모달을 연다', () => {
        const promptPlugin = createPromptPlugin(modalPlugin);
        promptPlugin.open('이름을 입력하세요.');

        const passedOptions = (modalPlugin.open as any).mock.calls[0][1];
        expect(passedOptions.backClose).toBe(true);
    });

    it('backClose가 false이면 그대로 모달을 연다', () => {
        const promptPlugin = createPromptPlugin(modalPlugin);
        promptPlugin.open('이름을 입력하세요.', { backClose: false });

        const passedOptions = (modalPlugin.open as any).mock.calls[0][1];
        expect(passedOptions.backClose).toBe(false);
    });

    it('componentProps와 플러그인 전용 옵션은 modalPlugin.open에 전달되지 않고, ModalOptions는 전달된다', () => {
        const promptPlugin = createPromptPlugin(modalPlugin);
        const SomeComp = defineComponent({ template: '<div />' });

        promptPlugin.open(SomeComp, {
            componentProps: { foo: 'bar' },
            okText: '확인',
            cancelText: '취소',
            swapButtons: true,
            input: { placeholder: 'name' },
            colorScheme: 'red',
        });

        const passedOptions = (modalPlugin.open as any).mock.calls[0][1];
        expect(passedOptions.componentProps).toBeUndefined();
        expect(passedOptions.okText).toBeUndefined();
        expect(passedOptions.cancelText).toBeUndefined();
        expect(passedOptions.swapButtons).toBeUndefined();
        expect(passedOptions.input).toBeUndefined();
        expect(passedOptions.colorScheme).toBe('red');
    });
});
