import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import VsProgress from './../VsProgress.vue';

describe('VsProgress', () => {
    describe('기본 렌더링', () => {
        it('progress 요소가 기본 클래스와 함께 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress);

            // then
            const progress = wrapper.find('progress');
            expect(progress.exists()).toBe(true);
            expect(progress.classes()).toContain('vs-progress');
        });

        it('기본 value와 max 값이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress);

            // then
            expect(wrapper.vm.computedValue).toBe(0);
            expect(wrapper.vm.computedMax).toBe(1);
        });
    });

    describe('value props', () => {
        it('숫자 타입의 value가 주어지면 해당 value 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: 0.5,
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(0.5);
        });

        it('문자열 타입의 value가 주어지면 숫자로 변환되어 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: '0.75',
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(0.75);
        });

        it('value가 max보다 큰 값이면 max 값으로 제한되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: 150,
                    max: 100,
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(100);
        });

        it('음수 value가 주어지면 0으로 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: -10,
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(0);
        });

        it('유효하지 않은 문자열 value가 주어지면 0으로 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: 'invalid',
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(0);
        });
    });

    describe('max props', () => {
        it('숫자 타입의 max가 주어지면 해당 max 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    max: 200,
                },
            });

            // then
            expect(wrapper.vm.computedMax).toBe(200);
        });

        it('문자열 타입의 max가 주어지면 숫자로 변환되어 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    max: '150',
                },
            });

            // then
            expect(wrapper.vm.computedMax).toBe(150);
        });

        it('음수 max가 주어지면 1로 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    max: -50,
                },
            });

            // then
            expect(wrapper.vm.computedMax).toBe(1);
        });

        it('유효하지 않은 문자열 max가 주어지면 1로 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    max: 'invalid',
                },
            });

            // then
            expect(wrapper.vm.computedMax).toBe(1);
        });
    });

    describe('label props', () => {
        it('label이 주어지면 data-label 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    label: 'Loading progress',
                },
            });

            // then
            expect(wrapper.vm.label).toBe('Loading progress');
        });

        it('빈 문자열 label이 주어져도 data-label 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    label: '',
                },
            });

            // then
            expect(wrapper.vm.label).toBe('');
        });
    });

    describe('경계값 테스트', () => {
        it('매우 큰 숫자가 주어져도 올바르게 처리되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: 1000000,
                    max: 2000000,
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(1000000);
            expect(wrapper.vm.computedMax).toBe(2000000);
        });

        it('소수점이 포함된 value와 max가 주어져도 올바르게 처리되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: 33.33,
                    max: 66.66,
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(33.33);
            expect(wrapper.vm.computedMax).toBe(66.66);
        });
    });
});
