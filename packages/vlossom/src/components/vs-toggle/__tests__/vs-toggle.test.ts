import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsToggle from '../VsToggle.vue';

describe('VsToggle', () => {
    describe('기본 렌더링', () => {
        it('vs-toggle 컨테이너와 내부 vs-button이 렌더링되어야 한다', () => {
            // given & when
            const wrapper = mount(VsToggle);

            // then
            expect(wrapper.find('.vs-toggle').exists()).toBe(true);
            expect(wrapper.findComponent({ name: 'VsButton' }).exists()).toBe(true);
        });

        it('슬롯 콘텐츠가 올바르게 렌더링되어야 한다', () => {
            // given
            const slotContent = '토글 버튼 텍스트';

            // when
            const wrapper = mount(VsToggle, {
                slots: {
                    default: slotContent,
                },
            });

            // then
            expect(wrapper.html()).toContain(slotContent);
        });
    });

    describe('modelValue prop', () => {
        it('기본값은 false여야 한다', () => {
            // given & when
            const wrapper = mount(VsToggle);

            // then
            expect(wrapper.vm.modelValue).toBe(false);
        });

        it('modelValue prop을 통해 초기값을 설정할 수 있어야 한다', () => {
            // given & when
            const wrapper = mount(VsToggle, {
                props: {
                    modelValue: true,
                },
            });

            // then
            expect(wrapper.vm.modelValue).toBe(true);
        });
    });

    describe('토글 기능', () => {
        it('버튼 클릭 시 update:modelValue 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsToggle, {
                props: {
                    modelValue: false,
                },
            });

            // when
            await wrapper.findComponent({ name: 'VsButton' }).trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
            expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);
        });

        it('버튼 클릭 시 toggle 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsToggle, {
                props: {
                    modelValue: false,
                },
            });

            // when
            await wrapper.findComponent({ name: 'VsButton' }).trigger('click');

            // then
            expect(wrapper.emitted('toggle')).toBeTruthy();
            expect(wrapper.emitted('toggle')).toHaveLength(1);
            expect(wrapper.emitted('toggle')![0]).toEqual([true]);
        });

        it('연속으로 클릭하면 값이 번갈아 토글되어야 한다', async () => {
            // given
            const wrapper = mount(VsToggle, {
                props: {
                    modelValue: false,
                },
            });
            const button = wrapper.findComponent({ name: 'VsButton' });

            // when - 첫 번째 클릭 (false → true)
            await button.trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')![0]).toEqual([true]);

            // when - modelValue 업데이트 시뮬레이션 후 두 번째 클릭 (true → false)
            await wrapper.setProps({ modelValue: true });
            await button.trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toHaveLength(2);
            expect(wrapper.emitted('update:modelValue')![1]).toEqual([false]);
        });
    });

    describe('이벤트 동시 발생', () => {
        it('한 번의 클릭으로 update:modelValue와 toggle 이벤트가 모두 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsToggle, {
                props: {
                    modelValue: false,
                },
            });

            // when
            await wrapper.findComponent({ name: 'VsButton' }).trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toHaveLength(1);
            expect(wrapper.emitted('toggle')).toHaveLength(1);

            // 두 이벤트의 값이 동일해야 함
            expect(wrapper.emitted('update:modelValue')![0]).toEqual(wrapper.emitted('toggle')![0]);
        });
    });
});
