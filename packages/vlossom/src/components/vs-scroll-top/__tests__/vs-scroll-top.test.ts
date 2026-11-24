import { mount } from '@vue/test-utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { nextTick } from 'vue';
import VsScrollTop from './../VsScrollTop.vue';

function setWindowScrollY(value: number) {
    Object.defineProperty(window, 'scrollY', { value, configurable: true });
    window.dispatchEvent(new Event('scroll'));
}

const originalMatchMedia = vi.mocked(window.matchMedia).getMockImplementation();

function mockReducedMotion(matches: boolean) {
    vi.mocked(window.matchMedia).mockImplementation(
        (query: string) => ({ matches, media: query }) as unknown as MediaQueryList,
    );
}

function appendScrollArea() {
    const container = document.createElement('div');
    container.id = 'scroll-area';
    container.scrollTo = vi.fn();
    document.body.appendChild(container);
    return container;
}

describe('vs-scroll-top', () => {
    beforeEach(() => {
        Object.defineProperty(window, 'scrollY', { value: 0, configurable: true });
        window.scrollTo = vi.fn();
    });

    afterEach(() => {
        vi.mocked(window.matchMedia).mockImplementation(originalMatchMedia!);
        document.body.innerHTML = '';
    });

    describe('표시 여부 (threshold)', () => {
        it('스크롤 거리가 기본 threshold(200) 미만이면 렌더링되지 않는다', () => {
            // given & when
            const wrapper = mount(VsScrollTop);

            // then
            expect(wrapper.find('.vs-scroll-top').exists()).toBe(false);
        });

        it('스크롤 거리가 threshold 이상이 되면 나타나고 다시 올라가면 사라진다', async () => {
            // given
            const wrapper = mount(VsScrollTop, { props: { noAnimation: true } });

            // when
            setWindowScrollY(200);
            await nextTick();

            // then
            expect(wrapper.find('.vs-scroll-top').exists()).toBe(true);

            // when
            setWindowScrollY(100);
            await nextTick();

            // then
            expect(wrapper.find('.vs-scroll-top').exists()).toBe(false);
        });

        it('mount 시점에 이미 스크롤되어 있으면 바로 나타난다', async () => {
            // given
            Object.defineProperty(window, 'scrollY', { value: 500, configurable: true });

            // when
            const wrapper = mount(VsScrollTop);
            await nextTick();

            // then
            expect(wrapper.find('.vs-scroll-top').exists()).toBe(true);
        });

        it('threshold가 문자열이어도 숫자로 비교한다', async () => {
            // given
            const wrapper = mount(VsScrollTop, { props: { threshold: '50', noAnimation: true } });

            // when
            setWindowScrollY(60);
            await nextTick();

            // then
            expect(wrapper.find('.vs-scroll-top').exists()).toBe(true);
        });

        it('threshold가 0이면 항상 표시된다', async () => {
            // given & when
            const wrapper = mount(VsScrollTop, { props: { threshold: 0 } });
            await nextTick();

            // then
            expect(wrapper.find('.vs-scroll-top').exists()).toBe(true);
        });
    });

    describe('target', () => {
        it('target selector로 지정한 요소의 스크롤을 감지한다', async () => {
            // given
            const container = appendScrollArea();
            const wrapper = mount(VsScrollTop, { props: { target: '#scroll-area', noAnimation: true } });

            // when
            container.scrollTop = 300;
            container.dispatchEvent(new Event('scroll'));
            await nextTick();

            // then
            expect(wrapper.find('.vs-scroll-top').exists()).toBe(true);
        });

        it('target이 있으면 window 대신 target 요소를 맨 위로 스크롤한다', () => {
            // given
            const container = appendScrollArea();
            const wrapper = mount(VsScrollTop, { props: { target: '#scroll-area' } });

            // when
            wrapper.vm.scrollToTop();

            // then
            expect(container.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
            expect(window.scrollTo).not.toHaveBeenCalled();
        });

        it('target 요소를 찾지 못하면 경고를 출력한다', () => {
            // given
            const warn = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            mount(VsScrollTop, { props: { target: '#not-exist' } });

            // then
            expect(warn).toHaveBeenCalledWith(expect.stringContaining('#not-exist'));
        });

        it('target 요소를 찾지 못하면 threshold가 0이어도 렌더링되지 않는다', async () => {
            // given
            vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            const wrapper = mount(VsScrollTop, { props: { target: '#not-exist', threshold: 0 } });
            await nextTick();

            // then
            expect(wrapper.find('.vs-scroll-top').exists()).toBe(false);
        });

        it('unmount 시 scroll 리스너를 제거한다', () => {
            // given
            const removeEventListener = vi.spyOn(window, 'removeEventListener');
            const wrapper = mount(VsScrollTop);

            // when
            wrapper.unmount();

            // then
            expect(removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
        });
    });

    describe('scrollToTop', () => {
        it('기본 버튼을 클릭하면 window를 smooth하게 맨 위로 스크롤한다', async () => {
            // given
            const wrapper = mount(VsScrollTop, { props: { threshold: 0 } });
            await nextTick();

            // when
            await wrapper.find('button').trigger('click');

            // then
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        });

        it('noAnimation이면 즉시 이동한다', () => {
            // given
            const wrapper = mount(VsScrollTop, { props: { noAnimation: true } });

            // when
            wrapper.vm.scrollToTop();

            // then
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
        });

        it('prefers-reduced-motion이면 즉시 이동한다', () => {
            // given
            mockReducedMotion(true);
            const wrapper = mount(VsScrollTop);

            // when
            wrapper.vm.scrollToTop();

            // then
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'instant' });
        });
    });

    describe('기본 버튼', () => {
        it('VS_ARIA_SCROLL_TOP aria-label이 적용된다', async () => {
            // given & when
            const wrapper = mount(VsScrollTop, { props: { threshold: 0 } });
            await nextTick();

            // then
            expect(wrapper.find('button').attributes('aria-label')).toBe('Scroll to top');
        });

        it('ghost, outline, primary, size prop이 VsButton으로 전달된다', async () => {
            // given & when
            const wrapper = mount(VsScrollTop, {
                props: { threshold: 0, ghost: true, outline: true, primary: true, size: 'lg' },
            });
            await nextTick();

            // then
            const classes = wrapper.find('button').classes();
            expect(classes).toContain('vs-ghost');
            expect(classes).toContain('vs-outline');
            expect(classes).toContain('vs-primary');
            expect(classes).toContain('vs-lg');
        });

        it('colorScheme이 VsButton으로 전달된다', async () => {
            // given & when
            const wrapper = mount(VsScrollTop, { props: { threshold: 0, colorScheme: 'blue' } });
            await nextTick();

            // then
            expect(wrapper.find('button').classes()).toContain('vs-cs-blue');
        });
    });

    describe('fixed', () => {
        it('fixed이면 vs-fixed 클래스가 적용된다', async () => {
            // given & when
            const wrapper = mount(VsScrollTop, { props: { threshold: 0, fixed: true } });
            await nextTick();

            // then
            expect(wrapper.find('.vs-scroll-top').classes()).toContain('vs-fixed');
        });

        it('기본값에서는 vs-fixed 클래스가 없다', async () => {
            // given & when
            const wrapper = mount(VsScrollTop, { props: { threshold: 0 } });
            await nextTick();

            // then
            expect(wrapper.find('.vs-scroll-top').classes()).not.toContain('vs-fixed');
        });
    });

    describe('styleSet', () => {
        it('root CSSProperties는 래퍼에, $button은 VsButton에 적용된다', async () => {
            // given & when
            const wrapper = mount(VsScrollTop, {
                props: {
                    threshold: 0,
                    styleSet: { left: '1rem', right: 'auto', $button: { borderRadius: '50%' } },
                },
            });
            await nextTick();

            // then
            const root = wrapper.find('.vs-scroll-top').element as HTMLElement;
            expect(root.style.left).toBe('1rem');
            expect(root.style.right).toBe('auto');
            expect((wrapper.find('button').element as HTMLElement).style.borderRadius).toBe('50%');
        });
    });

    describe('default slot', () => {
        it('slot으로 버튼 전체를 교체하고 scrollToTop을 slot props로 제공한다', async () => {
            // given
            const wrapper = mount(VsScrollTop, {
                props: { threshold: 0 },
                slots: {
                    default: `<template #default="{ scrollToTop }">
                        <a class="custom-top" @click="scrollToTop">TOP</a>
                    </template>`,
                },
            });
            await nextTick();

            // when
            await wrapper.find('.custom-top').trigger('click');

            // then
            expect(wrapper.find('.vs-button').exists()).toBe(false);
            expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: 'smooth' });
        });
    });
});
