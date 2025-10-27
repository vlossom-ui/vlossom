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
            expect(wrapper.vm.isChecked('A')).toBe(true);
            expect(wrapper.vm.isChecked('B')).toBe(true);
            expect(wrapper.vm.isChecked('C')).toBe(false);
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
            expect(wrapper.vm.isChecked('A')).toBe(false);
            expect(wrapper.vm.isChecked('B')).toBe(false);
            expect(wrapper.vm.isChecked('C')).toBe(false);
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
            const options = ['A', 'B', 'C'];
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options,
                    modelValue: [],
                    beforeChange,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            const firstCheckbox = wrapper.findAllComponents({ name: 'VsCheckbox' })[0];
            await firstCheckbox.vm.$emit('update:modelValue', true);

            // then
            expect(beforeChange).toHaveBeenCalledWith([], ['A'], 'A');
        });

        it('beforeChange 함수가 Promise<true>를 리턴하면 값이 업데이트된다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: [],
                    beforeChange: () => Promise.resolve(true),
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            const firstCheckbox = wrapper.findAllComponents({ name: 'VsCheckbox' })[0];
            await firstCheckbox.vm.$emit('update:modelValue', true);
            await nextTick();

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toBeTruthy();
            if (updateModelValueEvent) {
                expect(updateModelValueEvent).toHaveLength(1);
                expect(updateModelValueEvent[0][0]).toEqual(['A']);
            }
        });

        it('beforeChange 함수가 Promise<false>를 리턴하면 값이 업데이트되지 않는다', async () => {
            // given
            const wrapper = mount(VsCheckboxSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: [],
                    beforeChange: () => Promise.resolve(false),
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            const firstCheckbox = wrapper.findAllComponents({ name: 'VsCheckbox' })[0];
            await firstCheckbox.vm.$emit('update:modelValue', true);

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toBeUndefined();
        });
    });
});
