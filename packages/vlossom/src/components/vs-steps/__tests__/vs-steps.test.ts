import { describe, it, expect, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VsSteps from './../VsSteps.vue';

describe('VsSteps', () => {
    beforeEach(() => {
        HTMLElement.prototype.focus = () => {};
    });

    describe('responsive wrapper', () => {
        it('vs-responsive 컴포넌트로 감싸져 있어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                },
            });

            // then
            expect(wrapper.findComponent({ name: 'VsResponsive' }).exists()).toBe(true);
        });

        it('width prop이 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    width: '500px',
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('width')).toBe('500px');
        });

        it('grid prop이 전달되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    grid: 6,
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('grid')).toBe(6);
        });

        it('반응형 width 객체가 전달되어야 한다', () => {
            // given
            const responsiveWidth = { xs: '100%', md: '600px' };

            // when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    width: responsiveWidth,
                },
            });

            // then
            const responsive = wrapper.findComponent({ name: 'VsResponsive' });
            expect(responsive.props('width')).toEqual(responsiveWidth);
        });
    });

    describe('props', () => {
        it('steps prop이 주어지면 해당 개수만큼 스텝 아이템이 렌더링되어야 한다', () => {
            // given
            const steps = ['Step 1', 'Step 2', 'Step 3'];

            // when
            const wrapper = mount(VsSteps, {
                props: { steps },
            });

            // then
            const stepItems = wrapper.findAll('.vs-step-item');
            expect(stepItems).toHaveLength(3);
            expect(stepItems[0].text()).toContain('Step 1');
            expect(stepItems[1].text()).toContain('Step 2');
            expect(stepItems[2].text()).toContain('Step 3');
        });

        it('modelValue prop이 주어지면 해당 인덱스의 스텝이 선택되어야 한다', async () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    modelValue: 1,
                },
            });

            await nextTick();

            // then
            const stepItems = wrapper.findAll('.vs-step-item');
            expect(stepItems[1].classes()).toContain('vs-selected');
        });

        it('선택된 스텝 이전의 스텝들은 vs-previous 클래스가 적용되어야 한다', async () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
                    modelValue: 2,
                },
            });

            await nextTick();

            // then
            const stepItems = wrapper.findAll('.vs-step-item');
            expect(stepItems[0].classes()).toContain('vs-previous');
            expect(stepItems[1].classes()).toContain('vs-previous');
            expect(stepItems[2].classes()).toContain('vs-selected');
            expect(stepItems[3].classes()).not.toContain('vs-previous');
        });

        it('vertical prop이 true이면 vs-vertical 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    vertical: true,
                },
            });

            // then
            expect(wrapper.find('.vs-steps').classes()).toContain('vs-vertical');
        });

        it('noLabel prop이 true이면 vs-steps-no-label 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    noLabel: true,
                },
            });

            // then
            expect(wrapper.find('.vs-steps-list').classes()).toContain('vs-steps-no-label');
        });

        it('noLabel prop이 true이면 레이블이 렌더링되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    noLabel: true,
                },
            });

            // then
            const labels = wrapper.findAll('.vs-step-label');
            expect(labels).toHaveLength(0);
        });

        it('disabled prop에 true가 주어지면 모든 스텝에 vs-disabled 클래스가 적용되어야 한다', async () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    disabled: true,
                },
            });

            await nextTick();

            // then
            const stepItems = wrapper.findAll('.vs-step-item');
            expect(stepItems[0].classes()).toContain('vs-disabled');
            expect(stepItems[1].classes()).toContain('vs-disabled');
            expect(stepItems[2].classes()).toContain('vs-disabled');
        });

        it('disabled prop에 false가 주어지면 모든 스텝에 vs-disabled 클래스가 적용되지 않아야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    disabled: false,
                },
            });

            // then
            const stepItems = wrapper.findAll('.vs-step-item');
            expect(stepItems[0].classes()).not.toContain('vs-disabled');
            expect(stepItems[1].classes()).not.toContain('vs-disabled');
            expect(stepItems[2].classes()).not.toContain('vs-disabled');
        });

        it('disabled prop에 함수가 주어지면 해당 인덱스의 스텝에 vs-disabled 클래스가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
                    disabled: (step: string, index: number) => [1, 3].includes(index),
                },
            });

            // then
            const stepItems = wrapper.findAll('.vs-step-item');
            expect(stepItems[0].classes()).not.toContain('vs-disabled');
            expect(stepItems[1].classes()).toContain('vs-disabled');
            expect(stepItems[2].classes()).not.toContain('vs-disabled');
            expect(stepItems[3].classes()).toContain('vs-disabled');
        });

        it('gap prop이 주어지면 CSS 변수로 설정되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    gap: '2rem',
                },
            });

            // then
            const steps = wrapper.find('.vs-steps');
            expect(steps.attributes('style')).toContain('--vs-steps-gap: 2rem');
            expect(steps.attributes('style')).toContain('--vs-steps-gapCount: 2');
        });

        it('height prop이 주어지면 styleSet에 height가 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    height: '300px',
                },
            });

            // then
            const steps = wrapper.find('.vs-steps');
            expect(steps.attributes('style')).toContain('--vs-steps-height: 300px');
        });
    });

    describe('events', () => {
        it('스텝을 클릭하면 update:modelValue 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                },
            });

            // when
            const stepItems = wrapper.findAll('.vs-step-item');
            await stepItems[1].trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([1]);
        });

        it('스텝을 클릭하면 change 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                },
            });

            // when
            const stepItems = wrapper.findAll('.vs-step-item');
            await stepItems[2].trigger('click');

            // then
            expect(wrapper.emitted('change')).toBeTruthy();
            expect(wrapper.emitted('change')?.[0]).toEqual([2]);
        });

        it('함수를 통해 비활성화된 스텝을 클릭하면 NOT_SELECTED(-1)로 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    disabled: (step: string, index: number) => index === 1,
                },
            });

            // when
            const stepItems = wrapper.findAll('.vs-step-item');
            await stepItems[1].trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([-1]);
            expect(wrapper.emitted('change')).toBeTruthy();
            expect(wrapper.emitted('change')?.[0]).toEqual([-1]);
        });

        it('전체 비활성화된 스텝을 클릭하면 NOT_SELECTED(-1)로 이벤트가 발생해야 한다', async () => {
            // given
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    disabled: true,
                },
            });

            // when
            const stepItems = wrapper.findAll('.vs-step-item');
            await stepItems[0].trigger('click');

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([-1]);
            expect(wrapper.emitted('change')).toBeTruthy();
            expect(wrapper.emitted('change')?.[0]).toEqual([-1]);
        });
    });

    describe('slot', () => {
        it('step slot이 주어지면 커스텀 콘텐츠가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                },
                slots: {
                    step: '<span class="custom-step">{{ index }}</span>',
                },
            });

            // then
            const customSteps = wrapper.findAll('.custom-step');
            expect(customSteps).toHaveLength(3);
        });

        it('label slot이 주어지면 커스텀 콘텐츠가 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                },
                slots: {
                    label: '<span class="custom-label">{{ step }}</span>',
                },
            });

            // then
            const customLabels = wrapper.findAll('.custom-label');
            expect(customLabels).toHaveLength(3);
        });

        it('step slot은 isSelected, isPrevious, isDisabled props를 받아야 한다', async () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
                    modelValue: 2,
                    disabled: (step: string, index: number) => index === 3,
                },
                slots: {
                    step: `<span class="custom-step" 
                        :data-selected="isSelected" 
                        :data-previous="isPrevious"
                        :data-disabled="isDisabled">
                        {{ index }}
                    </span>`,
                },
            });

            await nextTick();

            // then
            const customSteps = wrapper.findAll('.custom-step');
            expect(customSteps[0].attributes('data-selected')).toBe('false');
            expect(customSteps[0].attributes('data-previous')).toBe('true');
            expect(customSteps[0].attributes('data-disabled')).toBe('false');

            expect(customSteps[2].attributes('data-selected')).toBe('true');
            expect(customSteps[2].attributes('data-previous')).toBe('false');
            expect(customSteps[2].attributes('data-disabled')).toBe('false');

            expect(customSteps[3].attributes('data-selected')).toBe('false');
            expect(customSteps[3].attributes('data-previous')).toBe('false');
            expect(customSteps[3].attributes('data-disabled')).toBe('true');
        });

        it('label slot은 isSelected, isPrevious, isDisabled props를 받아야 한다', async () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
                    modelValue: 1,
                    disabled: (step: string, index: number) => index === 2,
                },
                slots: {
                    label: `<span class="custom-label" 
                        :data-selected="isSelected"
                        :data-previous="isPrevious"
                        :data-disabled="isDisabled">
                        {{ step }}
                    </span>`,
                },
            });

            await nextTick();

            // then
            const customLabels = wrapper.findAll('.custom-label');
            expect(customLabels[0].attributes('data-selected')).toBe('false');
            expect(customLabels[0].attributes('data-previous')).toBe('true');
            expect(customLabels[0].attributes('data-disabled')).toBe('false');

            expect(customLabels[1].attributes('data-selected')).toBe('true');
            expect(customLabels[1].attributes('data-previous')).toBe('false');
            expect(customLabels[1].attributes('data-disabled')).toBe('false');

            expect(customLabels[2].attributes('data-selected')).toBe('false');
            expect(customLabels[2].attributes('data-previous')).toBe('false');
            expect(customLabels[2].attributes('data-disabled')).toBe('true');
        });
    });

    describe('reactivity', () => {
        it('modelValue가 외부에서 변경되면 선택된 스텝이 업데이트되어야 한다', async () => {
            // given
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
                    modelValue: 0,
                },
            });

            await nextTick();

            // when
            await wrapper.setProps({ modelValue: 2 });
            await nextTick();

            // then
            const stepItems = wrapper.findAll('.vs-step-item');
            expect(stepItems[0].classes()).toContain('vs-previous');
            expect(stepItems[1].classes()).toContain('vs-previous');
            expect(stepItems[2].classes()).toContain('vs-selected');
            expect(stepItems[3].classes()).not.toContain('vs-selected');
        });

        it('steps 배열이 변경되면 첫 번째 활성 스텝으로 이동해야 한다', async () => {
            // given
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    modelValue: 2,
                },
            });

            await nextTick();

            // when
            await wrapper.setProps({ steps: ['New Step 1', 'New Step 2'] });
            await nextTick();

            // then
            expect(wrapper.emitted('update:modelValue')).toBeTruthy();
            const stepItems = wrapper.findAll('.vs-step-item');
            expect(stepItems).toHaveLength(2);
            expect(stepItems[0].classes()).toContain('vs-selected');
        });
    });

    describe('styleSet', () => {
        it('styleSet 객체가 주어지면 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    modelValue: 1,
                    styleSet: {
                        variables: {
                            step: {
                                backgroundColor: '#f5f5f5',
                                border: '2px solid #ddd',
                                borderRadius: '50%',
                                size: '2rem',
                            },
                            activeStep: {
                                backgroundColor: '#4caf50',
                                border: '2px solid #4caf50',
                                size: '2.5rem',
                            },
                        },
                        component: {
                            margin: '2rem auto',
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-steps-gap': '0',
                '--vs-steps-gapCount': 2,
                '--vs-steps-step-backgroundColor': '#f5f5f5',
                '--vs-steps-step-border': '2px solid #ddd',
                '--vs-steps-step-borderRadius': '50%',
                '--vs-steps-step-size': '2rem',
                '--vs-steps-activeStep-backgroundColor': '#4caf50',
                '--vs-steps-activeStep-border': '2px solid #4caf50',
                '--vs-steps-activeStep-size': '2.5rem',
            });
            expect(wrapper.vm.componentStyleSet.component).toEqual({
                margin: '2rem auto',
            });
        });
    });

    describe('복합 styleSet 조합', () => {
        it('styleSet과 props가 동시에 주어지면 props가 우선되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3'],
                    modelValue: 1,
                    gap: '4rem',
                    height: '400px',
                    styleSet: {
                        variables: {
                            gap: '2rem',
                            height: '200px',
                            step: {
                                backgroundColor: '#ff0000',
                                size: '3rem',
                            },
                        },
                        component: {
                            margin: '1rem',
                        },
                    },
                },
            });

            // then
            // props가 우선되어야 함 (gap, height는 additionalStyleSet으로 덮어씌워짐)
            expect(wrapper.vm.styleSetVariables['--vs-steps-gap']).toBe('4rem');
            expect(wrapper.vm.styleSetVariables['--vs-steps-height']).toBe('400px');
            // styleSet의 나머지 값은 유지되어야 함
            expect(wrapper.vm.componentStyleSet.variables?.step?.backgroundColor).toBe('#ff0000');
            expect(wrapper.vm.componentStyleSet.variables?.step?.size).toBe('3rem');
            expect(wrapper.vm.componentStyleSet.component?.margin).toBe('1rem');
        });
    });

    describe('progress bar', () => {
        it('첫 번째 스텝이 선택되었을 때 진행 바가 0%여야 한다', async () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
                    modelValue: 0,
                },
            });

            await nextTick();

            // then
            const progress = wrapper.find('.vs-step-progress');
            expect(progress.attributes('style')).toContain('width: 0%');
        });

        it('두 번째 스텝이 선택되었을 때 진행 바가 33.33%여야 한다', async () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
                    modelValue: 1,
                },
            });

            await nextTick();

            // then
            const progress = wrapper.find('.vs-step-progress');
            expect(progress.attributes('style')).toMatch(/width:\s*33\.33+%/);
        });

        it('마지막 스텝이 선택되었을 때 진행 바가 100%여야 한다', async () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
                    modelValue: 3,
                },
            });

            await nextTick();

            // then
            const progress = wrapper.find('.vs-step-progress');
            expect(progress.attributes('style')).toContain('width: 100%');
        });

        it('vertical이 true일 때 진행 바가 height로 표시되어야 한다', async () => {
            // given, when
            const wrapper = mount(VsSteps, {
                props: {
                    steps: ['Step 1', 'Step 2', 'Step 3', 'Step 4'],
                    modelValue: 2,
                    vertical: true,
                },
            });

            await nextTick();

            // then
            const progress = wrapper.find('.vs-step-progress');
            expect(progress.attributes('style')).toMatch(/height:\s*66\.66+%/);
        });
    });
});
