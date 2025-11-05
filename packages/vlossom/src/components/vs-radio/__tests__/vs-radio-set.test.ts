import { describe, it, expect } from 'vitest';
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
});
