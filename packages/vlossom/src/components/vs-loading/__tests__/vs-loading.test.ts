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

    describe('colorScheme props', () => {
        it('colorScheme이 주어지면 해당 컬러 스킴 클래스가 적용되어야 한다', () => {
            // given
            const colorScheme = 'red';

            // when
            const wrapper = mount(VsLoading, {
                props: {
                    colorScheme,
                },
            });

            // then
            expect(wrapper.classes()).toContain('vs-loading');
            expect(wrapper.classes()).toContain('vs-red');
        });

        it('colorScheme이 주어지지 않으면 기본 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsLoading);

            // then
            expect(wrapper.classes()).toContain('vs-loading');
            expect(wrapper.classes()).not.toContain('vs-red');
            expect(wrapper.classes()).not.toContain('vs-blue');
        });
    });

    describe('styleSet props', () => {
        it('styleSet이 주어지면 커스텀 스타일이 적용되어야 한다', () => {
            // given
            const styleSet = {
                width: '100px',
                height: '120px',
                color: '#ff0000',
                barWidth: '20%',
            };

            // when
            const wrapper = mount(VsLoading, {
                props: {
                    styleSet,
                },
            });

            // then
            const style = wrapper.attributes('style');
            expect(style).toContain('--vs-loading-width: 100px');
            expect(style).toContain('--vs-loading-height: 120px');
            expect(style).toContain('--vs-loading-color: #ff0000');
            expect(style).toContain('--vs-loading-barWidth: 20%');
        });

        it('styleSet의 일부 속성만 주어져도 올바르게 적용되어야 한다', () => {
            // given
            const styleSet = {
                width: '50px',
                color: '#00ff00',
            };

            // when
            const wrapper = mount(VsLoading, {
                props: {
                    styleSet,
                },
            });

            // then
            const style = wrapper.attributes('style');
            expect(style).toContain('--vs-loading-width: 50px');
            expect(style).toContain('--vs-loading-color: #00ff00');
            expect(style).not.toContain('--vs-loading-height');
            expect(style).not.toContain('--vs-loading-barWidth');
        });

        it('styleSet이 빈 객체여도 기본 스타일로 렌더링되어야 한다', () => {
            // given
            const styleSet = {};

            // when
            const wrapper = mount(VsLoading, {
                props: {
                    styleSet,
                },
            });

            // then
            expect(wrapper.find('.vs-loading').exists()).toBe(true);
            expect(wrapper.find('.vs-loading-rect1').exists()).toBe(true);
        });
    });

    describe('props 조합', () => {
        it('colorScheme과 styleSet이 함께 주어지면 둘 다 적용되어야 한다', () => {
            // given
            const colorScheme = 'blue';
            const styleSet = {
                width: '80px',
                color: '#0000ff',
            };

            // when
            const wrapper = mount(VsLoading, {
                props: {
                    colorScheme,
                    styleSet,
                },
            });

            // then
            expect(wrapper.classes()).toContain('vs-loading');
            expect(wrapper.classes()).toContain('vs-blue');

            const style = wrapper.attributes('style');
            expect(style).toContain('--vs-loading-width: 80px');
            expect(style).toContain('--vs-loading-color: #0000ff');
        });
    });
});
