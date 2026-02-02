import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsSkeleton from '../VsSkeleton.vue';

describe('VsSkeleton', () => {
    describe('기본 렌더링', () => {
        it('기본 상태에서 올바르게 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSkeleton);

            // then
            expect(wrapper.find('.vs-skeleton').exists()).toBe(true);
            expect(wrapper.find('.vs-skeleton-bg').exists()).toBe(true);
            expect(wrapper.find('.vs-skeleton-inner').exists()).toBe(true);
        });
    });

    describe('슬롯', () => {
        it('default 슬롯에 텍스트를 넣을 수 있어야 한다', () => {
            // given
            const text = 'Something is loading...';

            // when
            const wrapper = mount(VsSkeleton, {
                slots: {
                    default: text,
                },
            });

            // then
            expect(wrapper.find('.vs-skeleton-inner').text()).toBe(text);
        });
    });
});
