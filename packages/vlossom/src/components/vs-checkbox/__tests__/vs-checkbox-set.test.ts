import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';

import VsCheckboxSet from './../VsCheckboxSet.vue';

describe('VsCheckboxSet', () => {
    describe('v-model', () => {
        it('modelValue를 바꿔서 체크박스 세트 값을 업데이트할 수 있다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: [],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: ['A', 'B'] });

            // then
            expect(wrapper.props('modelValue')).toEqual(['A', 'B']);
            const checkboxes = wrapper.findAllComponents({ name: 'VsCheckbox' });
            const checkboxStates = checkboxes.map((checkbox) => checkbox.vm.isChecked);
            expect(checkboxStates).toEqual([true, true, false]);
        });

        it('modelValue가 빈 배열이면 아무것도 선택되지 않는다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: [],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toEqual([]);
            const checkboxes = wrapper.findAllComponents({ name: 'VsCheckbox' });
            const checkboxStates = checkboxes.map((checkbox) => checkbox.vm.isChecked);
            expect(checkboxStates).toEqual([false, false, false]);
        });
    });

    describe('options', () => {
        it('문자열 배열 옵션을 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['Apple', 'Banana', 'Orange'],
                    modelValue: [],
                },
            });

            // then
            const checkboxes = wrapper.findAllComponents({ name: 'VsCheckbox' });
            expect(checkboxes).toHaveLength(3);
        });

        it('객체 배열 옵션을 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: [
                        { id: 1, name: 'Apple' },
                        { id: 2, name: 'Banana' },
                    ],
                    optionLabel: 'name',
                    optionValue: 'id',
                    modelValue: [],
                },
            });

            // then
            const checkboxes = wrapper.findAllComponents({ name: 'VsCheckbox' });
            expect(checkboxes).toHaveLength(2);
            expect(wrapper.vm.getOptionLabel(wrapper.vm.options[0])).toBe('Apple');
            expect(wrapper.vm.getOptionValue(wrapper.vm.options[0])).toBe(1);
        });
    });

    describe('validation', () => {
        it('required 검증이 가능하다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: [],
                    required: true,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            wrapper.vm.validate();
            await nextTick();

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.html()).toContain('required');
        });

        it('min 검증이 가능하다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: ['A'],
                    min: 2,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            wrapper.vm.validate();
            await nextTick();

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.html()).toContain('min number of items');
        });

        it('max 검증이 가능하다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: ['A', 'B', 'C'],
                    max: 2,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            wrapper.vm.validate();
            await nextTick();

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.html()).toContain('max number of items');
        });
    });

    describe('validate', () => {
        it('valid할 때 validate 함수를 호출하면 true를 반환한다', () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: ['A'],
                    required: true,
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(true);
        });

        it('invalid할 때 validate 함수를 호출하면 false를 반환한다', () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: [],
                    required: true,
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(false);
        });
    });

    describe('clear', () => {
        it('clear 함수를 호출하면 모든 선택이 해제된다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: ['A', 'B'],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            wrapper.vm.clear();
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toEqual([]);
        });
    });

    describe('before change', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('beforeChange 함수에 from, to, option 인자가 전달된다', async () => {
            // given
            const beforeChange = vi.fn().mockResolvedValue(true);
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    modelValue: ['A'],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    options: ['A', 'B', 'C'],
                    beforeChange,
                },
            });

            // when
            await wrapper.findAll('input[type="checkbox"]')[1].trigger('click');

            // then
            expect(beforeChange).toHaveBeenCalledWith(['A'], ['A', 'B'], 'B');
        });

        it('beforeChange 함수가 Promise<true>를 리턴하면 값이 업데이트 된다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    modelValue: ['A'],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    options: ['A', 'B', 'C'],
                    beforeChange: () => Promise.resolve(true),
                },
            });

            // when
            await wrapper.findAll('input[type="checkbox"]')[1].trigger('click');

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toHaveLength(1);
            expect(updateModelValueEvent?.[0]).toEqual([['A', 'B']]);
        });

        it('beforeChange 함수가 Promise<false>를 리턴하면 값이 업데이트 되지 않는다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    modelValue: ['A'],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    options: ['A', 'B', 'C'],
                    beforeChange: () => Promise.resolve(false),
                },
            });

            // when
            await wrapper.findAll('input[type="checkbox"]')[1].trigger('click');

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toBeUndefined();
        });
    });

    describe('styleSet 하위 속성 전달', () => {
        it('checkbox styleSet이 각 vs-checkbox 컴포넌트에 전달되어야 한다', () => {
            // given
            const checkboxStyleSet = {
                variables: {
                    checkboxColor: '#2196f3',
                    checkboxSize: '1.5rem',
                },
            };

            // when
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B'],
                    modelValue: [],
                    styleSet: {
                        checkbox: checkboxStyleSet,
                    },
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.checkbox).toEqual(checkboxStyleSet);
            const vsCheckboxes = wrapper.findAllComponents({ name: 'VsCheckbox' });
            expect(vsCheckboxes).toHaveLength(2);
            vsCheckboxes.forEach((checkbox) => {
                expect(checkbox.props('styleSet')).toEqual(checkboxStyleSet);
            });
        });

        it('wrapper styleSet이 vs-input-wrapper 컴포넌트에 전달되어야 한다', () => {
            // given
            const wrapperStyleSet = {
                variables: {
                    backgroundColor: '#f5f5f5',
                    border: '1px solid #ccc',
                },
            };

            // when
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B'],
                    modelValue: [],
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
                checkbox: {
                    variables: {
                        checkboxColor: '#e91e63',
                        checkboxSize: '1.25rem',
                    },
                },
                wrapper: {
                    variables: {
                        labelColor: '#333',
                    },
                },
            };

            // when
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: [],
                    styleSet: fullStyleSet,
                },
            });

            // then
            expect(wrapper.vm.componentStyleSet.variables?.gap).toBe('1rem');
            expect(wrapper.vm.componentStyleSet.checkbox).toEqual(fullStyleSet.checkbox);
            expect(wrapper.vm.componentStyleSet.wrapper).toEqual(fullStyleSet.wrapper);
        });
    });
});
