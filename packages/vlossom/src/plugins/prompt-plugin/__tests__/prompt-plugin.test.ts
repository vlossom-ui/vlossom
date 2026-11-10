import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApp, defineComponent, h, nextTick, type App } from 'vue';
import { createVlossom, useVlossom } from '@/framework';
import * as components from '@/components';
import { PROMPT_CANCEL } from '@/declaration';
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

    it('모달 노드의 자체 Escape 닫기를 비활성화하기 위해 escClose: false로 모달을 연다', () => {
        const promptPlugin = createPromptPlugin(modalPlugin);
        promptPlugin.open('이름을 입력하세요.');

        const passedOptions = (modalPlugin.open as any).mock.calls[0][1];
        expect(passedOptions.escClose).toBe(false);
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

describe('prompt-plugin (실제 오버레이)', () => {
    let app: App;

    async function flush() {
        for (let i = 0; i < 5; i++) {
            await nextTick();
            await new Promise((r) => setTimeout(r, 0));
        }
    }

    function findButton(text: string) {
        return Array.from(document.querySelectorAll<HTMLButtonElement>('.vs-modal-node button')).find((b) =>
            b.textContent?.includes(text),
        )!;
    }

    // 브라우저는 keydown 처리(마이크로태스크 포함)가 끝난 뒤, 막히지 않았다면 그 시점에 포커스된 button을 click한다
    async function pressEnter(target: HTMLElement) {
        const keydown = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true });
        target.dispatchEvent(keydown);
        await flush();
        if (document.activeElement instanceof HTMLButtonElement && !keydown.defaultPrevented) {
            document.activeElement.click();
        }
    }

    beforeEach(async () => {
        const root = document.createElement('div');
        document.body.appendChild(root);
        app = createApp(defineComponent({ render: () => h('div') }));
        app.use(createVlossom({ components: components as any }));
        app.mount(root);
        await flush();
    });

    afterEach(() => {
        useVlossom().modal.clear();
        app.unmount();
    });

    it('열리면 입력창에 포커스가 가고, 입력창에서 Enter를 누르면 입력값으로 resolve한다', async () => {
        const promise = useVlossom().prompt.open('이름?', { input: { initialValue: 'abc' } });
        await flush();

        const input = document.querySelector<HTMLInputElement>('.vs-modal-node input')!;
        expect(document.activeElement).toBe(input);

        await pressEnter(input);

        await expect(promise).resolves.toBe('abc');
    });

    it('Cancel 버튼에 포커스를 두고 Enter를 누르면 null로 resolve한다', async () => {
        const promise = useVlossom().prompt.open('이름?', { input: { initialValue: 'abc' } });
        await flush();

        const cancel = findButton('Cancel');
        cancel.focus();
        await pressEnter(cancel);

        await expect(promise).resolves.toBeNull();
    });

    it('입력창 Enter로 닫힌 뒤 포커스가 돌아간 트리거 버튼이 다시 눌리지 않는다', async () => {
        const onTrigger = vi.fn();
        const trigger = document.createElement('button');
        trigger.addEventListener('click', onTrigger);
        document.body.appendChild(trigger);
        trigger.focus();

        const promise = useVlossom().prompt.open('이름?', { input: { initialValue: 'abc' } });
        await flush();
        await pressEnter(document.querySelector<HTMLInputElement>('.vs-modal-node input')!);

        await expect(promise).resolves.toBe('abc');
        expect(document.activeElement).toBe(trigger);
        expect(onTrigger).not.toHaveBeenCalled();
        trigger.remove();
    });
});
