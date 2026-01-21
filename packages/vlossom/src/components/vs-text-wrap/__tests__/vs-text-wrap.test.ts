import { describe, it, expect, vi, beforeEach, afterEach, afterAll } from 'vitest';
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
            const wrapper = mount(VsTextWrap, {
                props: {
                    width: '200px',
                },
            });

            expect(wrapper.vm.styleSetVariables['--vs-text-wrap-width']).toBe('200px');
        });
    });

    describe('styleSet', () => {
        it('styleSet이 적용되어야 한다', () => {
            const wrapper = mount(VsTextWrap, {
                props: {
                    styleSet: {
                        variables: {
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
                        component: {
                            backgroundColor: '#f5f5f5',
                            padding: '0.5rem',
                        },
                    },
                    copy: true,
                    link: 'https://example.com',
                },
            });

            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-text-wrap-width': '',
                '--vs-text-wrap-copyIcon-color': '#ff0000',
                '--vs-text-wrap-copyIcon-width': '2rem',
                '--vs-text-wrap-copyIcon-height': '2rem',
                '--vs-text-wrap-linkIcon-color': '#0000ff',
                '--vs-text-wrap-linkIcon-width': '1.5rem',
                '--vs-text-wrap-linkIcon-height': '1.5rem',
            });
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                backgroundColor: '#f5f5f5',
                padding: '0.5rem',
            });
        });
    });

    describe('복합 styleSet 조합', () => {
        it('styleSet과 props가 동시에 주어지면 props가 우선되어야 한다', () => {
            const wrapper = mount(VsTextWrap, {
                props: {
                    width: '500px',
                    styleSet: {
                        variables: {
                            width: '300px',
                        },
                        component: {
                            backgroundColor: '#ff0000',
                        },
                    },
                },
            });

            expect(wrapper.vm.styleSetVariables['--vs-text-wrap-width']).toBe('500px');
            expect(wrapper.vm.componentStyleSet.component?.backgroundColor).toBe('#ff0000');
        });
    });

    describe('copy', () => {
        let clipboardContents = '';

        beforeEach(() => {
            clipboardContents = '';
            // test-setup.ts의 기본 mock을 사용하되, writeText와 readText만 override
            if (navigator.clipboard) {
                vi.mocked(navigator.clipboard.writeText).mockImplementation((text) => {
                    clipboardContents = text as string;
                    return Promise.resolve();
                });
                vi.mocked(navigator.clipboard.readText).mockImplementation(() => {
                    return Promise.resolve(clipboardContents);
                });
            }
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
            const clipboardText = await navigator.clipboard.readText();
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
            if (navigator.clipboard) {
                vi.mocked(navigator.clipboard.writeText).mockRejectedValue(new Error('Permission denied'));
            }

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

            // cleanup
            consoleErrorSpy.mockRestore();
        });
    });

    describe('link', () => {
        let mockedOpen: ReturnType<typeof vi.fn>;
        let consoleWarnSpy: ReturnType<typeof vi.spyOn>;
        const originalOpen = window.open;

        beforeEach(() => {
            mockedOpen = vi.fn();
            window.open = mockedOpen;
            consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
        });

        afterEach(() => {
            consoleWarnSpy.mockRestore();
        });

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

        it('http 프로토콜 URL이 허용되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'link',
                },
                props: {
                    link: 'http://example.com',
                },
                attachTo: document.body,
            });

            // when
            await wrapper.find('.vs-link-button').trigger('click');

            // then
            expect(mockedOpen).toHaveBeenCalledWith('http://example.com', '_blank');
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });

        it('https 프로토콜 URL이 허용되어야 한다', async () => {
            // given
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'link',
                },
                props: {
                    link: 'https://example.com',
                },
                attachTo: document.body,
            });

            // when
            await wrapper.find('.vs-link-button').trigger('click');

            // then
            expect(mockedOpen).toHaveBeenCalledWith('https://example.com', '_blank');
            expect(consoleWarnSpy).not.toHaveBeenCalled();
        });

        it('javascript: 프로토콜 URL이 차단되어야 한다', async () => {
            // given
            const dangerousUrl = 'javascript:alert("XSS")';
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'link',
                },
                props: {
                    link: dangerousUrl,
                },
                attachTo: document.body,
            });

            // when
            await wrapper.find('.vs-link-button').trigger('click');

            // then
            expect(mockedOpen).not.toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid or unsafe URL'));
        });

        it('data: 프로토콜 URL이 차단되어야 한다', async () => {
            // given
            const dangerousUrl = 'data:text/html,<script>alert("XSS")</script>';
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'link',
                },
                props: {
                    link: dangerousUrl,
                },
                attachTo: document.body,
            });

            // when
            await wrapper.find('.vs-link-button').trigger('click');

            // then
            expect(mockedOpen).not.toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid or unsafe URL'));
        });

        it('file: 프로토콜 URL이 차단되어야 한다', async () => {
            // given
            const dangerousUrl = 'file:///etc/passwd';
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'link',
                },
                props: {
                    link: dangerousUrl,
                },
                attachTo: document.body,
            });

            // when
            await wrapper.find('.vs-link-button').trigger('click');

            // then
            expect(mockedOpen).not.toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid or unsafe URL'));
        });

        it('잘못된 URL 형식이 차단되어야 한다', async () => {
            // given
            const invalidUrl = 'not-a-valid-url';
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'link',
                },
                props: {
                    link: invalidUrl,
                },
                attachTo: document.body,
            });

            // when
            await wrapper.find('.vs-link-button').trigger('click');

            // then
            expect(mockedOpen).not.toHaveBeenCalled();
            expect(consoleWarnSpy).toHaveBeenCalledWith(expect.stringContaining('Invalid or unsafe URL'));
        });

        it('빈 문자열 URL은 link 버튼이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsTextWrap, {
                slots: {
                    default: 'link',
                },
                props: {
                    link: '',
                },
            });

            // then
            expect(wrapper.find('.vs-link-button').exists()).toBe(false);
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
