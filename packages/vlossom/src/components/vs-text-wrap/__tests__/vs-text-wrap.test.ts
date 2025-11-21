import { describe, it, expect, vi, beforeEach, afterAll } from 'vitest';
import { mount, flushPromises } from '@vue/test-utils';
import VsTextWrap from './../VsTextWrap.vue';

describe('VsTextWrap', () => {
    beforeEach(() => {
        vi.useFakeTimers();
    });

    describe('props', () => {
        it('copy prop이 true이면 copy 버튼이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTextWrap, {
                props: {
                    copy: true,
                },
            });

            // then
            const copyButton = wrapper.find('.vs-copy-button');
            expect(copyButton.exists()).toBe(true);
        });

        it('link prop이 주어지면 link 버튼이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTextWrap, {
                props: {
                    link: 'https://example.com',
                },
            });

            // then
            const linkButton = wrapper.find('.vs-link-button');
            expect(linkButton.exists()).toBe(true);
        });

        it('width prop으로 너비를 설정할 수 있어야 한다', () => {
            // given, when
            const wrapper = mount(VsTextWrap, {
                props: {
                    width: '200px',
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toHaveProperty('--vs-text-wrap-width', '200px');
        });

        it('styleSet 객체가 주어지면 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTextWrap, {
                props: {
                    styleSet: {
                        copyIcon: {
                            color: '#ff0000',
                            width: '2rem',
                            height: '2rem',
                        },
                        linkIcon: {
                            color: '#0000ff',
                            width: '1.5rem',
                            height: '1.5rem',
                        },
                    },
                    copy: true,
                    link: 'https://example.com',
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-text-wrap-width': '',
                '--vs-text-wrap-copyIcon-color': '#ff0000',
                '--vs-text-wrap-copyIcon-width': '2rem',
                '--vs-text-wrap-copyIcon-height': '2rem',
                '--vs-text-wrap-linkIcon-color': '#0000ff',
                '--vs-text-wrap-linkIcon-width': '1.5rem',
                '--vs-text-wrap-linkIcon-height': '1.5rem',
            });
        });
    });

    describe('copy', () => {
        let clipboardContents = '';

        beforeEach(() => {
            clipboardContents = '';
            Object.defineProperty(navigator, 'clipboard', {
                value: {
                    writeText: vi.fn((text) => {
                        clipboardContents = text;
                        return Promise.resolve();
                    }),
                    readText: vi.fn(() => clipboardContents),
                },
                writable: true,
                configurable: true,
            });
        });

        it('copy 버튼을 클릭하면 innerText가 클립보드에 복사되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: `
                        <div>
                            <p>lorem ipsum dolor sit amet <i><b>consectetuer</b></i> adipiscing elit. </p>
                        </div>
                    `,
                },
                props: {
                    copy: true,
                },
                attachTo: document.body,
            });

            // contentsRef의 innerText를 강제로 설정 (JSDOM에서 innerText가 작동하지 않음)
            const contentsElement = wrapper.find('.vs-text-wrap-contents').element as HTMLElement;
            Object.defineProperty(contentsElement, 'innerText', {
                value: 'lorem ipsum dolor sit amet consectetuer adipiscing elit. ',
                writable: true,
                configurable: true,
            });

            // when
            await wrapper.find('.vs-copy-button').trigger('click');
            await flushPromises();

            // then
            const clipboardText = navigator.clipboard.readText();
            expect(clipboardText).toBe('lorem ipsum dolor sit amet consectetuer adipiscing elit. ');
        });

        it('copy 버튼을 클릭하면 copied 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'Test text',
                },
                props: {
                    copy: true,
                },
                attachTo: document.body,
            });

            // contentsRef의 innerText를 강제로 설정
            const contentsElement = wrapper.find('.vs-text-wrap-contents').element as HTMLElement;
            Object.defineProperty(contentsElement, 'innerText', {
                value: 'Test text',
                writable: true,
                configurable: true,
            });

            // when
            await wrapper.find('.vs-copy-button').trigger('click');
            await flushPromises();

            // then
            expect(wrapper.emitted('copied')).toBeTruthy();
            expect(wrapper.emitted('copied')?.[0]?.[0]).toBe('Test text');
        });

        it('복사 성공 후 2초간 check 아이콘이 표시되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'Test text',
                },
                props: {
                    copy: true,
                },
                attachTo: document.body,
            });

            // contentsRef의 innerText를 강제로 설정
            const contentsElement = wrapper.find('.vs-text-wrap-contents').element as HTMLElement;
            Object.defineProperty(contentsElement, 'innerText', {
                value: 'Test text',
                writable: true,
                configurable: true,
            });

            // when
            await wrapper.find('.vs-copy-button').trigger('click');
            await flushPromises();

            // then
            expect(wrapper.vm.copied).toBe(true);

            // 2초 후
            vi.advanceTimersByTime(2000);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.copied).toBe(false);
        });

        it('클립보드 복사가 실패하면 copied 이벤트가 발생하지 않아야 한다', async () => {
            // given
            const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
            const originalClipboard = navigator.clipboard;
            Object.defineProperty(navigator, 'clipboard', {
                value: {
                    writeText: vi.fn(() => Promise.reject(new Error('Permission denied'))),
                },
                writable: true,
                configurable: true,
            });

            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'Test text',
                },
                props: {
                    copy: true,
                },
                attachTo: document.body,
            });

            // contentsRef의 innerText를 강제로 설정
            const contentsElement = wrapper.find('.vs-text-wrap-contents').element as HTMLElement;
            Object.defineProperty(contentsElement, 'innerText', {
                value: 'Test text',
                writable: true,
                configurable: true,
            });

            // when
            await wrapper.find('.vs-copy-button').trigger('click');
            await flushPromises();

            // then
            expect(wrapper.emitted('copied')).toBeFalsy();
            expect(wrapper.vm.copied).toBe(false);
            expect(consoleErrorSpy).toHaveBeenCalledWith('Failed to copy to clipboard:', expect.any(Error));

            // cleanup
            consoleErrorSpy.mockRestore();
            Object.defineProperty(navigator, 'clipboard', {
                value: originalClipboard,
                writable: true,
                configurable: true,
            });
        });
    });

    describe('link', () => {
        const mockedOpen = vi.fn();
        const originalOpen = window.open;
        window.open = mockedOpen;

        it('link 버튼을 클릭하면 새 창이 열려야 한다', async () => {
            // given
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'link',
                },
                props: {
                    link: 'https://google.com',
                },
                attachTo: document.body,
            });

            // when
            await wrapper.find('.vs-link-button').trigger('click');

            // then
            expect(mockedOpen).toHaveBeenCalledWith('https://google.com', '_blank');
        });

        beforeEach(() => {
            mockedOpen.mockClear();
        });

        afterAll(() => {
            window.open = originalOpen;
        });
    });

    describe('slots', () => {
        it('actions slot이 있으면 버튼 영역이 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'Test',
                    actions: '<button class="custom-action">Action</button>',
                },
            });

            // then
            expect(wrapper.find('.vs-text-wrap-buttons').exists()).toBe(true);
            expect(wrapper.find('.custom-action').exists()).toBe(true);
        });
    });
});
