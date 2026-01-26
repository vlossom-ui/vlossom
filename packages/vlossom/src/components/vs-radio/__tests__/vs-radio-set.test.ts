import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { nextTick } from 'vue';

import VsRadioSet from './../VsRadioSet.vue';

describe('VsRadioSet', () => {
    describe('v-model', () => {
        it('modelValue 변경으로 라디오 선택 상태를 제어할 수 있다', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'A',
                    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
                },
            });

            // then
            const radios = wrapper.findAllComponents({ name: 'VsRadio' });
            expect(radios).toHaveLength(3);
            expect(radios[0].vm.isChecked).toBe(true);

            // when
            await radios[1].find('input').trigger('change');
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toBe('B');
            expect(radios[1].vm.isChecked).toBe(true);
        });

        it('modelValue가 업데이트되면 해당 라디오가 선택된다', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'A',
                    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'C' });
            await nextTick();

            // then
            const radios = wrapper.findAllComponents({ name: 'VsRadio' });
            expect(radios[2].vm.isChecked).toBe(true);
            expect(radios[2].find('input').element.checked).toBe(true);
        });

        it('modelValue가 선택되어 있는 경우, 같은 값을 가진 라디오 버튼을 클릭하더라도 선택 상태가 유지된다.', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'A',
                },
            });
            const targetRadio = wrapper.findAllComponents({ name: 'VsRadio' })[0];

            // when
            await targetRadio.find('input').trigger('change');
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toBe('A');
            expect(targetRadio.vm.isChecked).toBe(true);
            expect(targetRadio.find('input').element.checked).toBe(true);
        });
    });

    describe('options', () => {
        it('객체 배열 옵션을 사용할 수 있다', () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: [
                        { id: 1, name: 'Apple' },
                        { id: 2, name: 'Banana' },
                    ],
                    optionLabel: 'name',
                    optionValue: 'id',
                    modelValue: null,
                },
            });

            // then
            const radios = wrapper.findAllComponents({ name: 'VsRadio' });
            expect(radios).toHaveLength(2);
            expect(wrapper.vm.getOptionLabel(wrapper.vm.options[0])).toBe('Apple');
            expect(wrapper.vm.getOptionValue(wrapper.vm.options[0])).toBe(1);
        });
    });

    describe('validation', () => {
        it('required 검증이 가능하다', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    required: true,
                    modelValue: null,
                },
            });

            // when
            const result = wrapper.vm.validate();
            await nextTick();

            // then
            expect(result).toBe(false);
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.html()).toContain('required');
        });

        it('값이 존재하는 경우, validate 함수를 호출하면 true를 반환한다', () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B'],
                    required: true,
                    modelValue: 'A',
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(true);
        });
    });

    describe('before change', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('beforeChange 함수에 from, to, optionValue 인자가 전달된다', async () => {
            // given
            const beforeChange = vi.fn().mockResolvedValue(true);
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'A',
                    beforeChange,
                    'onUpdate:modelValue': (value: any) => wrapper.setProps({ modelValue: value }),
                } as any,
            });

            const targetRadio = wrapper.findAllComponents({ name: 'VsRadio' })[1];
            const input = targetRadio.find('input');
            (input.element as HTMLInputElement).checked = true;

            // when
            await input.trigger('change');

            // then
            expect(beforeChange).toHaveBeenCalledWith('A', 'B', 'B');
        });

        it('beforeChange가 Promise<true>를 반환하면 값이 업데이트 된다', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'A',
                    beforeChange: () => Promise.resolve(true),
                    'onUpdate:modelValue': (value: any) => wrapper.setProps({ modelValue: value }),
                } as any,
            });

            const targetRadio = wrapper.findAllComponents({ name: 'VsRadio' })[1];
            const input = targetRadio.find('input');
            (input.element as HTMLInputElement).checked = true;

            // when
            await input.trigger('change');
            await nextTick();

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toHaveLength(1);
            expect(updateModelValueEvent?.[0][0]).toBe('B');
            expect(wrapper.props('modelValue')).toBe('B');
        });

        it('beforeChange가 Promise<false>를 반환하면 값이 업데이트 되지 않는다', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'A',
                    beforeChange: () => Promise.resolve(false),
                    'onUpdate:modelValue': (value: any) => wrapper.setProps({ modelValue: value }),
                } as any,
            });

            const targetRadio = wrapper.findAllComponents({ name: 'VsRadio' })[1];
            const input = targetRadio.find('input');
            (input.element as HTMLInputElement).checked = true;

            // when
            await input.trigger('change');
            await nextTick();

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toBeUndefined();
            expect(wrapper.props('modelValue')).toBe('A');
        });
    });

    describe('clear', () => {
        it('clear 함수를 호출하면 선택이 해제된다. null 값으로 업데이트된다.', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B'],
                    modelValue: 'A',
                    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
                },
            });

            // when
            wrapper.vm.clear();
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toBe(null);
        });
    });

    describe('styleSet 하위 속성 전달', () => {
        it('radio styleSet이 각 vs-radio 컴포넌트에 전달되어야 한다', () => {
            // given
            const radioStyleSet = {
                variables: {
                    radioColor: '#2196f3',
                    radioSize: '1.5rem',
                },
            };

            // when
            const wrapper = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B'],
                    modelValue: null,
                    styleSet: {
                        radio: radioStyleSet,
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.radio).toEqual(radioStyleSet);
            const vsRadios = wrapper.findAllComponents({ name: 'VsRadio' });
            expect(vsRadios).toHaveLength(2);
            vsRadios.forEach((radio) => {
                expect(radio.props('styleSet')).toEqual(radioStyleSet);
            });
        });

        it('wrapper styleSet이 vs-input-wrapper 컴포넌트에 전달되어야 한다', () => {
            // given
            const wrapperStyleSet = {
                variables: {
                    width: '100%',
                    label: {
                        fontColor: '#333',
                    },
                },
            };

            // when
            const wrapper = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B'],
                    modelValue: null,
                    styleSet: {
                        wrapper: wrapperStyleSet,
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.wrapper).toEqual(wrapperStyleSet);
            const vsInputWrapper = wrapper.findComponent({ name: 'VsInputWrapper' });
            expect(vsInputWrapper.exists()).toBe(true);
            expect(vsInputWrapper.props('styleSet')).toEqual(wrapperStyleSet);
        });

        it('모든 styleSet 하위 속성이 함께 전달되어야 한다', () => {
            // given
            const fullStyleSet = {
                variables: {
                    gap: '1rem',
                    flexWrap: 'wrap',
                },
                radio: {
                    variables: {
                        radioColor: '#e91e63',
                        radioSize: '1.25rem',
                    },
                },
                wrapper: {
                    variables: {
                        width: '200px',
                        label: {
                            fontColor: '#333',
                        },
                    },
                },
            };

            // when
            const wrapper = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: null,
                    styleSet: fullStyleSet,
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.variables?.gap).toBe('1rem');
            expect(wrapper.vm.componentStyleSet.radio).toEqual(fullStyleSet.radio);
            expect(wrapper.vm.componentStyleSet.wrapper).toEqual(fullStyleSet.wrapper);
        });
    });
});
