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
            expect(wrapper.vm.computedMax).toBe(100);
        });
    });

    describe('value props', () => {
        it('숫자 타입의 value가 주어지면 해당 value 속성이 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: 50,
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(50);
        });

        it('문자열 타입의 value가 주어지면 숫자로 변환되어 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: '75',
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(75);
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

        it('음수 max가 주어지면 0으로 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    max: -50,
                },
            });

            // then
            expect(wrapper.vm.computedMax).toBe(0);
        });

        it('유효하지 않은 문자열 max가 주어지면 0으로 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    max: 'invalid',
                },
            });

            // then
            expect(wrapper.vm.computedMax).toBe(0);
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

    describe('colorScheme props', () => {
        it('colorScheme이 주어지면 해당 컬러 스킴 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    colorScheme: 'green',
                },
            });

            // then
            expect(wrapper.classes()).toContain('vs-color-scheme-green');
        });
    });

    describe('styleSet props', () => {
        it('styleSet 객체가 주어지면 CSS 변수가 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    styleSet: {
                        width: '300px',
                        height: '20px',
                        backgroundColor: '#f0f0f0',
                        valueColor: '#007bff',
                    },
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style['--vs-progress-width']).toBe('300px');
            expect(style['--vs-progress-height']).toBe('20px');
            expect(style['--vs-progress-backgroundColor']).toBe('#f0f0f0');
            expect(style['--vs-progress-valueColor']).toBe('#007bff');
        });

        it('styleSet에 label 스타일이 주어지면 올바르게 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    styleSet: {
                        label: {
                            fontSize: '14px',
                            fontWeight: 'bold',
                            textAlign: 'center',
                            textShadow: '1px 1px 2px rgba(0,0,0,0.3)',
                        },
                    },
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style['--vs-progress-label-fontSize']).toBe('14px');
            expect(style['--vs-progress-label-fontWeight']).toBe('bold');
            expect(style['--vs-progress-label-textAlign']).toBe('center');
            expect(style['--vs-progress-label-textShadow']).toBe('1px 1px 2px rgba(0,0,0,0.3)');
        });

        it('styleSet의 일부 속성만 주어져도 올바르게 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    styleSet: {
                        width: '250px',
                        valueColor: '#28a745',
                    },
                },
            });

            // then
            const style = wrapper.vm.styleSetVariables;
            expect(style['--vs-progress-width']).toBe('250px');
            expect(style['--vs-progress-valueColor']).toBe('#28a745');
            expect(style).not.toContain('--vs-progress-height');
            expect(style).not.toContain('--vs-progress-backgroundColor');
        });
    });

    describe('복합 시나리오', () => {
        it('모든 props가 함께 주어져도 올바르게 작동해야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: 75,
                    max: 100,
                    label: 'Loading 75%',
                    colorScheme: 'blue',
                    styleSet: {
                        width: '400px',
                        height: '24px',
                        valueColor: '#0066cc',
                    },
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(75);
            expect(wrapper.vm.computedMax).toBe(100);
            expect(wrapper.vm.label).toBe('Loading 75%');
            expect(wrapper.classes()).toContain('vs-color-scheme-blue');
            const style = wrapper.vm.styleSetVariables;
            expect(style['--vs-progress-width']).toBe('400px');
            expect(style['--vs-progress-height']).toBe('24px');
            expect(style['--vs-progress-valueColor']).toBe('#0066cc');
        });

        it('value가 max를 초과하는 경우와 다른 props가 함께 작동해야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: 120,
                    max: 80,
                    label: 'Completed',
                    colorScheme: 'green',
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(80); // value가 max로 제한됨
            expect(wrapper.vm.computedMax).toBe(80);
            expect(wrapper.vm.label).toBe('Completed');
            expect(wrapper.classes()).toContain('vs-color-scheme-green');
        });

        it('문자열 타입 value와 max가 함께 사용되어도 올바르게 작동해야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: '45.5',
                    max: '90.5',
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(45.5);
            expect(wrapper.vm.computedMax).toBe(90.5);
        });
    });

    describe('경계값 테스트', () => {
        it('value가 0이고 max가 0인 경우 올바르게 처리되어야 한다', () => {
            // given, when
            const wrapper = mount(VsProgress, {
                props: {
                    value: 0,
                    max: 0,
                },
            });

            // then
            expect(wrapper.vm.computedValue).toBe(0);
            expect(wrapper.vm.computedMax).toBe(0);
        });

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
