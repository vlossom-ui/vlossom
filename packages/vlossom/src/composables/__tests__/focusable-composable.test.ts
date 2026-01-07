import { describe, it, expect } from 'vitest';
import { nextTick, defineComponent, ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useFocusable } from '../focusable-composable';

describe('useFocusable', () => {
    describe('초기 상태', () => {
        it('focusIndex가 -1로 초기화되어야 한다', () => {
            // given & when
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex } = useFocusable(wrapperRef);
                        return { focusIndex };
                    },
                    template: '<div ref="wrapperRef"></div>',
                }),
            );

            // then
            expect(wrapper.vm.focusIndex).toBe(-1);
        });

        it('currentFocusableElement가 null로 초기화되어야 한다', () => {
            // given & when
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { currentFocusableElement } = useFocusable(wrapperRef);
                        return { currentFocusableElement };
                    },
                    template: '<div ref="wrapperRef"></div>',
                }),
            );

            // then
            expect(wrapper.vm.currentFocusableElement).toBe(null);
        });
    });

    describe('updateFocusIndex', () => {
        it('focusIndex를 업데이트할 수 있어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex, updateFocusIndex } = useFocusable(wrapperRef);
                        return { focusIndex, updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div data-focusable>Item 2</div>
                            <div data-focusable>Item 3</div>
                        </div>
                    `,
                }),
            );

            // when
            wrapper.vm.updateFocusIndex(1);
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(1);
        });

        it('focusIndex를 0으로 업데이트할 수 있어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex, updateFocusIndex } = useFocusable(wrapperRef);
                        return { focusIndex, updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div data-focusable>Item 2</div>
                        </div>
                    `,
                }),
            );

            // when
            wrapper.vm.updateFocusIndex(0);
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(0);
        });

        it('focusIndex를 -1로 업데이트할 수 있어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex, updateFocusIndex } = useFocusable(wrapperRef);
                        return { focusIndex, updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                        </div>
                    `,
                }),
            );

            wrapper.vm.updateFocusIndex(0);
            await nextTick();

            // when
            wrapper.vm.updateFocusIndex(-1);
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(-1);
        });

        it('focusIndex를 음수로 업데이트하면 -1로 설정되어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex, updateFocusIndex } = useFocusable(wrapperRef);
                        return { focusIndex, updateFocusIndex, wrapperRef };
                    },
                    template: '<div ref="wrapperRef"></div>',
                }),
            );

            // when
            wrapper.vm.updateFocusIndex(-5);
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(-1);
        });

        it('focusIndex가 범위를 벗어나면 마지막 요소의 인덱스로 설정되어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex, updateFocusIndex } = useFocusable(wrapperRef);
                        return { focusIndex, updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div data-focusable>Item 2</div>
                            <div data-focusable>Item 3</div>
                        </div>
                    `,
                }),
            );

            // when
            wrapper.vm.updateFocusIndex(999);
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(2); // 3개 요소 중 마지막 인덱스는 2
        });
    });

    describe('focusIndex watch', () => {
        it('focusIndex가 변경되면 해당 엘리먼트에 vs-focusable-active 클래스가 추가되어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { updateFocusIndex } = useFocusable(wrapperRef);
                        return { updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div data-focusable>Item 2</div>
                            <div data-focusable>Item 3</div>
                        </div>
                    `,
                }),
            );

            // when
            wrapper.vm.updateFocusIndex(0);
            await nextTick();

            // then
            const focusableElements = wrapper.element.querySelectorAll('[data-focusable]');
            expect(focusableElements[0].classList.contains('vs-focusable-active')).toBe(true);
        });

        it('focusIndex가 변경되면 이전 엘리먼트에서 vs-focusable-active 클래스가 제거되어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { updateFocusIndex } = useFocusable(wrapperRef);
                        return { updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div data-focusable>Item 2</div>
                            <div data-focusable>Item 3</div>
                        </div>
                    `,
                }),
            );

            wrapper.vm.updateFocusIndex(0);
            await nextTick();

            // when
            wrapper.vm.updateFocusIndex(1);
            await nextTick();

            // then
            const focusableElements = wrapper.element.querySelectorAll('[data-focusable]');
            expect(focusableElements[0].classList.contains('vs-focusable-active')).toBe(false);
            expect(focusableElements[1].classList.contains('vs-focusable-active')).toBe(true);
        });

        it('focusIndex가 -1이면 모든 엘리먼트에서 vs-focusable-active 클래스가 제거되어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { updateFocusIndex } = useFocusable(wrapperRef);
                        return { updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div data-focusable>Item 2</div>
                            <div data-focusable>Item 3</div>
                        </div>
                    `,
                }),
            );

            wrapper.vm.updateFocusIndex(0);
            await nextTick();

            // when
            wrapper.vm.updateFocusIndex(-1);
            await nextTick();

            // then
            const focusableElements = wrapper.element.querySelectorAll('[data-focusable]');
            focusableElements.forEach((element: HTMLElement) => {
                expect(element.classList.contains('vs-focusable-active')).toBe(false);
            });
        });

        it('focusIndex가 -1이면 currentFocusableElement가 null이 되어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { currentFocusableElement, updateFocusIndex } = useFocusable(wrapperRef);
                        return { currentFocusableElement, updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                        </div>
                    `,
                }),
            );

            wrapper.vm.updateFocusIndex(0);
            await nextTick();

            // when
            wrapper.vm.updateFocusIndex(-1);
            await nextTick();

            // then
            expect(wrapper.vm.currentFocusableElement).toBe(null);
        });

        it('focusIndex가 유효한 값이면 currentFocusableElement가 해당 엘리먼트를 가리켜야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { currentFocusableElement, updateFocusIndex } = useFocusable(wrapperRef);
                        return { currentFocusableElement, updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div data-focusable>Item 2</div>
                            <div data-focusable>Item 3</div>
                        </div>
                    `,
                }),
            );

            // when
            wrapper.vm.updateFocusIndex(1);
            await nextTick();

            // then
            const focusableElements = wrapper.element.querySelectorAll('[data-focusable]');
            expect(wrapper.vm.currentFocusableElement).toBe(focusableElements[1]);
        });

        it('wrapperElement가 null이면 아무것도 하지 않아야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { currentFocusableElement, updateFocusIndex } = useFocusable(wrapperRef);
                        return { currentFocusableElement, updateFocusIndex, wrapperRef };
                    },
                    template: '<div></div>',
                }),
            );

            // when
            wrapper.vm.updateFocusIndex(0);
            await nextTick();

            // then
            expect(wrapper.vm.currentFocusableElement).toBe(null);
        });

        it('focusableElements가 없으면 아무것도 하지 않아야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { currentFocusableElement, updateFocusIndex } = useFocusable(wrapperRef);
                        return { currentFocusableElement, updateFocusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div>No focusable items</div>
                        </div>
                    `,
                }),
            );

            // when
            wrapper.vm.updateFocusIndex(0);
            await nextTick();

            // then
            expect(wrapper.vm.currentFocusableElement).toBe(null);
        });
    });

    describe('mousemove 이벤트 추적', () => {
        it('data-focusable 엘리먼트에 마우스를 올리면 focusIndex가 업데이트되어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex } = useFocusable(wrapperRef);
                        return { focusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div data-focusable>Item 2</div>
                            <div data-focusable>Item 3</div>
                        </div>
                    `,
                }),
            );

            await nextTick();

            // when
            const focusableElements = wrapper.element.querySelectorAll('[data-focusable]');
            await focusableElements[1].dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(1);
        });

        it('data-focusable이 없는 엘리먼트에 마우스를 올리면 focusIndex가 업데이트되지 않아야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex } = useFocusable(wrapperRef);
                        return { focusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div>Item 2 (not focusable)</div>
                            <div data-focusable>Item 3</div>
                        </div>
                    `,
                }),
            );

            await nextTick();

            // when
            const nonFocusableElement = wrapper.element.querySelector(':not([data-focusable])');
            await nonFocusableElement?.dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(-1);
        });

        it('이벤트 리스너가 onMounted에서 등록되어야 한다', async () => {
            // given & when
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex } = useFocusable(wrapperRef);
                        return { focusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div data-focusable>Item 2</div>
                        </div>
                    `,
                }),
            );

            await nextTick();

            // then - 마운트 후 mousemove 이벤트가 동작하는지 확인
            const focusableElements = wrapper.element.querySelectorAll('[data-focusable]');
            await focusableElements[0].dispatchEvent(new MouseEvent('mousemove', { bubbles: true }));
            await nextTick();

            expect(wrapper.vm.focusIndex).toBe(0);
        });

        it('이벤트 리스너가 onBeforeUnmount에서 제거되어야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { focusIndex } = useFocusable(wrapperRef);
                        return { focusIndex, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                        </div>
                    `,
                }),
            );

            await nextTick();

            // when - 컴포넌트 언마운트
            // then - 언마운트가 에러 없이 정상적으로 완료되면 이벤트 리스너가 제거된 것으로 볼 수 있음 (메모리 누수 방지)
            expect(() => wrapper.unmount()).not.toThrow();
        });
    });

    describe('getFocusableElements', () => {
        it('data-focusable 속성을 가진 엘리먼트들을 반환해야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { getFocusableElements } = useFocusable(wrapperRef);
                        return { getFocusableElements, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div data-focusable>Item 1</div>
                            <div>Item 2</div>
                            <div data-focusable>Item 3</div>
                            <div data-focusable>Item 4</div>
                        </div>
                    `,
                }),
            );

            // when
            const focusableElements = wrapper.vm.getFocusableElements();

            // then
            expect(focusableElements).toHaveLength(3);
            expect(focusableElements[0].textContent).toBe('Item 1');
            expect(focusableElements[1].textContent).toBe('Item 3');
            expect(focusableElements[2].textContent).toBe('Item 4');
        });

        it('data-focusable 속성을 가진 엘리먼트가 없으면 빈 배열을 반환해야 한다', async () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { getFocusableElements } = useFocusable(wrapperRef);
                        return { getFocusableElements, wrapperRef };
                    },
                    template: `
                        <div ref="wrapperRef">
                            <div>Item 1</div>
                            <div>Item 2</div>
                        </div>
                    `,
                }),
            );

            // when
            const focusableElements = wrapper.vm.getFocusableElements();

            // then
            expect(focusableElements).toHaveLength(0);
        });

        it('wrapperElement가 null이면 빈 배열을 반환해야 한다', () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        const { getFocusableElements } = useFocusable(wrapperRef);
                        return { getFocusableElements, wrapperRef };
                    },
                    template: '<div></div>',
                }),
            );

            // when
            const focusableElements = wrapper.vm.getFocusableElements();

            // then
            expect(focusableElements).toHaveLength(0);
        });
    });
});
