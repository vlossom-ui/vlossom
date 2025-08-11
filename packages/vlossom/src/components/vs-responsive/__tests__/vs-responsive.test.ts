import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsResponsive from './../VsResponsive.vue';

describe('VsResponsive', () => {
    describe('width props', () => {
        it('문자열 width가 주어지면 width 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    width: '300px',
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            expect(responsive.attributes('style')).toContain('width: 300px');
        });

        it('숫자 width가 주어지면 width 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    width: 500,
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            expect(responsive.attributes('style')).toContain('width: 500px');
        });

        it('Breakpoints 객체 width가 주어지면 반응형 CSS 변수와 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    width: {
                        sm: '400px',
                        md: '600px',
                        lg: '800px',
                        xl: '1000px',
                    },
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            const style = responsive.attributes('style');

            // CSS 변수 확인
            expect(style).toContain('--vs-width-sm: 400px');
            expect(style).toContain('--vs-width-md: 600px');
            expect(style).toContain('--vs-width-lg: 800px');
            expect(style).toContain('--vs-width-xl: 1000px');

            // 클래스 확인
            expect(responsive.classes()).toContain('vs-width-sm');
            expect(responsive.classes()).toContain('vs-width-md');
            expect(responsive.classes()).toContain('vs-width-lg');
            expect(responsive.classes()).toContain('vs-width-xl');
        });

        it('일부 breakpoint만 주어진 width 객체가 주어지면 해당 값들만 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    width: {
                        sm: '400px',
                        lg: '800px',
                    },
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            const style = responsive.attributes('style');

            // 설정된 값들만 CSS 변수에 포함
            expect(style).toContain('--vs-width-sm: 400px');
            expect(style).toContain('--vs-width-lg: 800px');
            expect(style).not.toContain('--vs-width-md');
            expect(style).not.toContain('--vs-width-xl');

            // 설정된 값들만 클래스에 포함
            expect(responsive.classes()).toContain('vs-width-sm');
            expect(responsive.classes()).toContain('vs-width-lg');
            expect(responsive.classes()).not.toContain('vs-width-md');
            expect(responsive.classes()).not.toContain('vs-width-xl');
        });
    });

    describe('grid props', () => {
        it('문자열 grid가 주어지면 grid CSS 변수가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    grid: '12',
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            expect(responsive.attributes('style')).toContain('--vs-grid-xs: 12');
        });

        it('숫자 grid가 주어지면 grid CSS 변수가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    grid: 8,
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            expect(responsive.attributes('style')).toContain('--vs-grid-xs: 8');
        });

        it('Breakpoints 객체 grid가 주어지면 반응형 CSS 변수와 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    grid: {
                        sm: '6',
                        md: '8',
                        lg: '10',
                        xl: '12',
                    },
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            const style = responsive.attributes('style');

            // CSS 변수 확인
            expect(style).toContain('--vs-grid-sm: 6');
            expect(style).toContain('--vs-grid-md: 8');
            expect(style).toContain('--vs-grid-lg: 10');
            expect(style).toContain('--vs-grid-xl: 12');

            // 클래스 확인
            expect(responsive.classes()).toContain('vs-grid-sm');
            expect(responsive.classes()).toContain('vs-grid-md');
            expect(responsive.classes()).toContain('vs-grid-lg');
            expect(responsive.classes()).toContain('vs-grid-xl');
        });

        it('일부 breakpoint만 주어진 grid 객체가 주어지면 해당 값들만 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    grid: {
                        md: '8',
                        xl: '12',
                    },
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            const style = responsive.attributes('style');

            // 설정된 값들만 CSS 변수에 포함
            expect(style).toContain('--vs-grid-md: 8');
            expect(style).toContain('--vs-grid-xl: 12');
            expect(style).not.toContain('--vs-grid-sm');
            expect(style).not.toContain('--vs-grid-lg');

            // 설정된 값들만 클래스에 포함
            expect(responsive.classes()).toContain('vs-grid-md');
            expect(responsive.classes()).toContain('vs-grid-xl');
            expect(responsive.classes()).not.toContain('vs-grid-sm');
            expect(responsive.classes()).not.toContain('vs-grid-lg');
        });
    });

    describe('width와 grid 동시 사용', () => {
        it('width와 grid가 모두 주어지면 두 속성이 모두 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    width: '600px',
                    grid: '8',
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            const style = responsive.attributes('style');

            expect(style).toContain('width: 600px');
            expect(style).toContain('--vs-grid-xs: 8');
        });

        it('width와 grid가 모두 Breakpoints 객체로 주어지면 모든 반응형 속성이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    width: {
                        sm: '400px',
                        md: '600px',
                    },
                    grid: {
                        sm: '6',
                        md: '8',
                    },
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            const style = responsive.attributes('style');

            // width CSS 변수
            expect(style).toContain('--vs-width-sm: 400px');
            expect(style).toContain('--vs-width-md: 600px');

            // grid CSS 변수
            expect(style).toContain('--vs-grid-sm: 6');
            expect(style).toContain('--vs-grid-md: 8');

            // width 클래스
            expect(responsive.classes()).toContain('vs-width-sm');
            expect(responsive.classes()).toContain('vs-width-md');

            // grid 클래스
            expect(responsive.classes()).toContain('vs-grid-sm');
            expect(responsive.classes()).toContain('vs-grid-md');
        });
    });

    describe('기본 동작', () => {
        it('props가 주어지지 않으면 기본 div 태그로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive);

            // then
            expect(wrapper.find('div').exists()).toBe(true);
            expect(wrapper.find('div').classes()).toContain('vs-responsive');
        });

        it('tag prop이 주어지면 해당 태그로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    tag: 'section',
                },
            });

            // then
            expect(wrapper.find('section').exists()).toBe(true);
            expect(wrapper.find('section').classes()).toContain('vs-responsive');
        });

        it('slot 내용이 올바르게 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                slots: {
                    default: '<span class="test-content">테스트 내용</span>',
                },
            });

            // then
            expect(wrapper.find('.test-content').exists()).toBe(true);
            expect(wrapper.find('.test-content').text()).toBe('테스트 내용');
        });
    });

    describe('에지 케이스', () => {
        it('빈 문자열이 주어지면 스타일이나 클래스가 적용되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    width: '',
                    grid: '',
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            const style = responsive.attributes('style');

            expect(style).toBeUndefined();
            expect(responsive.classes()).not.toContain('vs-width-sm');
            expect(responsive.classes()).not.toContain('vs-grid-sm');
        });

        it('undefined 값이 주어지면 스타일이나 클래스가 적용되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    width: undefined,
                    grid: undefined,
                },
            });

            // then
            const responsive = wrapper.find('.vs-responsive');
            const style = responsive.attributes('style');

            expect(style).toBeUndefined();
            expect(responsive.classes()).not.toContain('vs-width-sm');
            expect(responsive.classes()).not.toContain('vs-grid-sm');
        });
    });
});
