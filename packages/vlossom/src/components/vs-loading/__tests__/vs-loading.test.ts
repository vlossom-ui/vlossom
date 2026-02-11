import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsLoading from './../VsLoading.vue';

describe('VsLoading', () => {
    describe('기본 렌더링', () => {
        it('기본 상태에서 5개의 로딩 막대가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsLoading);

            // then
            expect(wrapper.find('.vs-loading').exists()).toBe(true);
            expect(wrapper.find('.vs-loading-rect1').exists()).toBe(true);
            expect(wrapper.find('.vs-loading-rect2').exists()).toBe(true);
            expect(wrapper.find('.vs-loading-rect3').exists()).toBe(true);
            expect(wrapper.find('.vs-loading-rect4').exists()).toBe(true);
            expect(wrapper.find('.vs-loading-rect5').exists()).toBe(true);
        });

        it('기본 상태에서 vs-loading 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsLoading);

            // then
            expect(wrapper.classes()).toContain('vs-loading');
        });
    });

    describe('width, height props', () => {
        it('width와 height props가 문자열로 주어지면 올바르게 적용되어야 한다', () => {
            // given
            const width = '200px';
            const height = '150px';

            // when
            const wrapper = mount(VsLoading, {
                props: {
                    width,
                    height,
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                width: '200px',
                height: '150px',
            });
        });

        it('width와 height props가 숫자로 주어지면 픽셀 단위로 변환되어야 한다', () => {
            // given
            const width = 300;
            const height = 250;

            // when
            const wrapper = mount(VsLoading, {
                props: {
                    width,
                    height,
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                width: '300px',
                height: '250px',
            });
        });
    });
});
