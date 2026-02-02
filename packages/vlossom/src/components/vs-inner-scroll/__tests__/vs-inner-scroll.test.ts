import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsInnerScroll from './../VsInnerScroll.vue';

describe('VsInnerScroll', () => {
    describe('props', () => {
        it('hideScroll이 true일 때 vs-hide-scroll 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInnerScroll, {
                props: {
                    hideScroll: true,
                },
            });

            // then
            const body = wrapper.find('.vs-inner-scroll-body');
            expect(body.classes()).toContain('vs-hide-scroll');
        });
    });
});
