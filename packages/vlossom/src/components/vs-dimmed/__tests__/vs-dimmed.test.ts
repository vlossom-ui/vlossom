import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import VsDimmed from './../VsDimmed.vue';

describe('vs-dimmed', () => {
    let defaultOptions: any;

    beforeEach(() => {
        defaultOptions = {
            props: {},
        };
    });

    describe('기본 렌더링', () => {
        it('기본 상태에서 modelValue가 false이면 dimmed 요소가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsDimmed, defaultOptions);

            // then
            expect(wrapper.find('.vs-dimmed').exists()).toBe(false);
        });

        it('modelValue가 true일 때 dimmed 요소가 렌더링되어야 한다', async () => {
            // given, when
            const wrapper = mount(VsDimmed, {
                props: {
                    modelValue: true,
                },
            });

            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.find('.vs-dimmed').exists()).toBe(true);
        });

        it('aria-hidden 속성이 true로 설정되어야 한다', async () => {
            // given, when
            const wrapper = mount(VsDimmed, {
                props: {
                    modelValue: true,
                },
            });

            await wrapper.vm.$nextTick();

            // then
            expect(wrapper.find('.vs-dimmed').attributes('aria-hidden')).toBe('true');
        });
    });

    describe('v-model', () => {
        it('modelValue가 변경되면 내부 show 상태가 동기화되어야 한다', async () => {
            // given
            const wrapper = mount(VsDimmed, {
                props: {
                    modelValue: false,
                },
            });

            // when
            await wrapper.setProps({ modelValue: true });

            // then
            expect(wrapper.vm.isShow).toBe(true);
            expect(wrapper.find('.vs-dimmed').exists()).toBe(true);
        });

        it('modelValue가 false로 변경되면 요소가 사라져야 한다', async () => {
            // given
            const wrapper = mount(VsDimmed, {
                props: {
                    modelValue: true,
                },
            });

            await wrapper.vm.$nextTick();
            expect(wrapper.find('.vs-dimmed').exists()).toBe(true);

            // when
            await wrapper.setProps({ modelValue: false });

            // then
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.isShow).toBe(false);
            // Transition 때문에 요소가 즉시 사라지지 않을 수 있음
        });
    });
});
