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
            expect(wrapper.vm.responsiveStyles).toEqual({
                width: '300px',
            });
        });

        it('숫자 width가 주어지면 width 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    width: 500,
                },
            });

            // then
            expect(wrapper.vm.responsiveStyles).toEqual({
                width: '500px',
            });
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
            // CSS 변수 확인
            expect(wrapper.vm.responsiveStyles).toEqual({
                '--vs-width-sm': '400px',
                '--vs-width-md': '600px',
                '--vs-width-lg': '800px',
                '--vs-width-xl': '1000px',
            });

            // 클래스 확인
            expect(wrapper.vm.responsiveClasses).toEqual(['vs-width-sm', 'vs-width-md', 'vs-width-lg', 'vs-width-xl']);
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
            // 설정된 값들만 CSS 변수에 포함
            expect(wrapper.vm.responsiveStyles).toEqual({
                '--vs-width-sm': '400px',
                '--vs-width-lg': '800px',
            });

            // 설정된 값들만 클래스에 포함
            expect(wrapper.vm.responsiveClasses).toEqual(['vs-width-sm', 'vs-width-lg']);
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
            expect(wrapper.vm.responsiveStyles).toEqual({
                '--vs-grid-xs': '12',
            });
        });

        it('숫자 grid가 주어지면 grid CSS 변수가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsResponsive, {
                props: {
                    grid: 8,
                },
            });

            // then
            expect(wrapper.vm.responsiveStyles).toEqual({
                '--vs-grid-xs': '8',
            });
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
            // CSS 변수 확인
            expect(wrapper.vm.responsiveStyles).toEqual({
                '--vs-grid-sm': '6',
                '--vs-grid-md': '8',
                '--vs-grid-lg': '10',
                '--vs-grid-xl': '12',
            });

            // 클래스 확인
            expect(wrapper.vm.responsiveClasses).toEqual(['vs-grid-sm', 'vs-grid-md', 'vs-grid-lg', 'vs-grid-xl']);
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
            // 설정된 값들만 CSS 변수에 포함
            expect(wrapper.vm.responsiveStyles).toEqual({
                '--vs-grid-md': '8',
                '--vs-grid-xl': '12',
            });

            // 설정된 값들만 클래스에 포함
            expect(wrapper.vm.responsiveClasses).toEqual(['vs-grid-md', 'vs-grid-xl']);
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
            expect(wrapper.vm.responsiveStyles).toEqual({
                width: '600px',
                '--vs-grid-xs': '8',
            });
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
            // width와 grid CSS 변수
            expect(wrapper.vm.responsiveStyles).toEqual({
                '--vs-width-sm': '400px',
                '--vs-width-md': '600px',
                '--vs-grid-sm': '6',
                '--vs-grid-md': '8',
            });

            // width와 grid 클래스
            expect(wrapper.vm.responsiveClasses).toEqual(['vs-width-sm', 'vs-width-md', 'vs-grid-sm', 'vs-grid-md']);
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
            expect(wrapper.vm.responsiveStyles).toEqual({});
            expect(wrapper.vm.responsiveClasses).toEqual([]);
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
            expect(wrapper.vm.responsiveStyles).toEqual({});
            expect(wrapper.vm.responsiveClasses).toEqual([]);
        });
    });
});
