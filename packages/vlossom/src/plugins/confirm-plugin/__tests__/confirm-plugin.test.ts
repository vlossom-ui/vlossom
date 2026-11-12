import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { createApp, defineComponent, h, nextTick, type App } from 'vue';
import { createVlossom, useVlossom } from '@/framework';
import * as components from '@/components';
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

describe('confirm-plugin (실제 오버레이)', () => {
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

    // 브라우저는 포커스된 button에서 Enter keydown이 버블링된 뒤 기본 동작으로 click을 발생시킨다
    function pressEnter(target: HTMLElement) {
        const keydown = new KeyboardEvent('keydown', { key: 'Enter', code: 'Enter', bubbles: true, cancelable: true });
        target.dispatchEvent(keydown);
        if (target instanceof HTMLButtonElement && !keydown.defaultPrevented) {
            target.click();
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

    it('열리면 OK 버튼에 포커스가 가고, Enter를 누르면 true로 resolve한다', async () => {
        const promise = useVlossom().confirm.open('정말 삭제할까요?');
        await flush();

        const ok = findButton('OK');
        expect(document.activeElement).toBe(ok);

        pressEnter(ok);

        await expect(promise).resolves.toBe(true);
    });

    it('Cancel 버튼에 포커스를 두고 Enter를 누르면 false로 resolve한다', async () => {
        const promise = useVlossom().confirm.open('정말 삭제할까요?');
        await flush();

        const cancel = findButton('Cancel');
        cancel.focus();
        pressEnter(cancel);

        await expect(promise).resolves.toBe(false);
    });
});
