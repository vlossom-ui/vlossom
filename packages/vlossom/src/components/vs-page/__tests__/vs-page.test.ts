import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsPage from './../VsPage.vue';

describe('VsPage', () => {
    describe('기본 렌더링', () => {
        it('title 슬롯이 없으면 vs-page-title 요소가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsPage);

            // then
            expect(wrapper.find('.vs-page-title').exists()).toBe(false);
        });

        it('description 슬롯이 없으면 vs-page-description 요소가 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsPage);

            // then
            expect(wrapper.find('.vs-page-description').exists()).toBe(false);
        });
    });
});
