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

        it('styleSet 객체가 주어지면 추가 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsInnerScroll, {
                props: {
                    styleSet: {
                        header: {
                            padding: '10px',
                        },
                        content: {
                            padding: '20px',
                        },
                        footer: {
                            padding: '15px',
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.header).toEqual({
                padding: '10px',
            });
            expect(wrapper.vm.componentStyleSet.content).toEqual({
                padding: '20px',
            });
            expect(wrapper.vm.componentStyleSet.footer).toEqual({
                padding: '15px',
            });
        });
    });
});
