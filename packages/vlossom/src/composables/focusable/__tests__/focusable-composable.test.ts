import { describe, it, expect } from 'vitest';
import { nextTick, defineComponent, ref, type Ref } from 'vue';
import { mount } from '@vue/test-utils';
import { useFocusable } from './../focusable-composable';

const KEYS = ['a', 'b', 'c'];

function mountFocusable(keys: Ref<string[]> = ref(KEYS), renderedKeys: string[] = keys.value) {
    return mount(
        defineComponent({
            props: {
                renderedKeys: { type: Array as () => string[], default: () => [] },
            },
            setup(props) {
                const wrapperRef = ref<HTMLElement | null>(null);
                const focusable = useFocusable(wrapperRef, keys);
                return { ...focusable, wrapperRef, keys, items: props.renderedKeys };
            },
            template: `
                <div ref="wrapperRef">
                    <div v-for="key in items" :key="key" :data-focusable="key">
                        <span class="label">{{ key }}</span>
                    </div>
                </div>
            `,
        }),
        { props: { renderedKeys } },
    );
}

describe('useFocusable', () => {
    describe('초기 상태', () => {
        it('focusIndex가 -1로 초기화되어야 한다', () => {
            // given, when
            const wrapper = mountFocusable();

            // then
            expect(wrapper.vm.focusIndex).toBe(-1);
        });

        it('currentFocusableKey가 null로 초기화되어야 한다', () => {
            // given, when
            const wrapper = mountFocusable();

            // then
            expect(wrapper.vm.currentFocusableKey).toBe(null);
        });
    });

    describe('updateFocusIndex', () => {
        it('focusIndex와 currentFocusableKey를 업데이트할 수 있어야 한다', async () => {
            // given
            const wrapper = mountFocusable();

            // when
            wrapper.vm.updateFocusIndex(1);
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(1);
            expect(wrapper.vm.currentFocusableKey).toBe('b');
        });

        it('focusIndex를 음수로 업데이트하면 -1로 설정되어야 한다', async () => {
            // given
            const wrapper = mountFocusable();

            // when
            wrapper.vm.updateFocusIndex(-5);
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(-1);
            expect(wrapper.vm.currentFocusableKey).toBe(null);
        });

        it('focusIndex가 범위를 벗어나면 마지막 키의 인덱스로 설정되어야 한다', async () => {
            // given
            const wrapper = mountFocusable();

            // when
            wrapper.vm.updateFocusIndex(999);
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(KEYS.length - 1);
            expect(wrapper.vm.currentFocusableKey).toBe('c');
        });

        it('DOM에 렌더되지 않은 키에도 포커스를 옮길 수 있어야 한다', async () => {
            // given - 키는 3개지만 DOM에는 첫 번째만 렌더되어 있다 (가상 스크롤 상황)
            const wrapper = mountFocusable(ref(KEYS), ['a']);

            // when
            wrapper.vm.updateFocusIndex(2);
            await nextTick();

            // then
            expect(wrapper.vm.focusIndex).toBe(2);
            expect(wrapper.vm.currentFocusableKey).toBe('c');
        });
    });

    describe('getFocusableElement', () => {
        it('키에 해당하는 엘리먼트를 반환해야 한다', () => {
            // given
            const wrapper = mountFocusable();

            // when
            const element = wrapper.vm.getFocusableElement('b');

            // then
            expect(element).toBe(wrapper.find('[data-focusable="b"]').element);
        });

        it('렌더되지 않은 키는 null을 반환해야 한다', () => {
            // given
            const wrapper = mountFocusable(ref(KEYS), ['a']);

            // when, then
            expect(wrapper.vm.getFocusableElement('c')).toBe(null);
        });

        it('wrapperElement가 없으면 null을 반환해야 한다', () => {
            // given
            const wrapper = mount(
                defineComponent({
                    setup() {
                        const wrapperRef = ref<HTMLElement | null>(null);
                        return useFocusable(wrapperRef, ref(KEYS));
                    },
                    template: '<span />',
                }),
            );

            // when, then
            expect(wrapper.vm.getFocusableElement('a')).toBe(null);
        });
    });

    describe('addMouseMoveListener', () => {
        it('data-focusable 엘리먼트에 마우스를 올리면 focusIndex가 업데이트되어야 한다', async () => {
            // given
            const wrapper = mountFocusable();
            wrapper.vm.addMouseMoveListener();

            // when
            await wrapper.find('[data-focusable="c"]').trigger('mousemove');

            // then
            expect(wrapper.vm.focusIndex).toBe(2);
        });

        it('data-focusable의 자식 엘리먼트에 마우스를 올려도 focusIndex가 업데이트되어야 한다', async () => {
            // given
            const wrapper = mountFocusable();
            wrapper.vm.addMouseMoveListener();

            // when
            await wrapper.find('[data-focusable="b"] .label').trigger('mousemove');

            // then
            expect(wrapper.vm.focusIndex).toBe(1);
        });

        it('키 목록에 없는 엘리먼트에 마우스를 올리면 focusIndex가 유지되어야 한다', async () => {
            // given
            const wrapper = mountFocusable(ref(KEYS), ['a', 'unknown']);
            wrapper.vm.addMouseMoveListener();
            wrapper.vm.updateFocusIndex(0);
            await nextTick();

            // when
            await wrapper.find('[data-focusable="unknown"]').trigger('mousemove');

            // then
            expect(wrapper.vm.focusIndex).toBe(0);
        });

        it('data-focusable이 없는 엘리먼트에 마우스를 올리면 focusIndex가 업데이트되지 않아야 한다', async () => {
            // given
            const wrapper = mountFocusable();
            wrapper.vm.addMouseMoveListener();

            // when
            await wrapper.find('div').trigger('mousemove');

            // then
            expect(wrapper.vm.focusIndex).toBe(-1);
        });
    });

    describe('removeMouseMoveListener', () => {
        it('리스너를 제거하면 마우스를 올려도 focusIndex가 업데이트되지 않아야 한다', async () => {
            // given
            const wrapper = mountFocusable();
            wrapper.vm.addMouseMoveListener();
            wrapper.vm.removeMouseMoveListener();

            // when
            await wrapper.find('[data-focusable="c"]').trigger('mousemove');

            // then
            expect(wrapper.vm.focusIndex).toBe(-1);
        });

        it('컴포넌트 언마운트 시 에러가 발생하지 않아야 한다', () => {
            // given
            const wrapper = mountFocusable();
            wrapper.vm.addMouseMoveListener();

            // when, then
            expect(() => wrapper.unmount()).not.toThrow();
        });
    });
});
