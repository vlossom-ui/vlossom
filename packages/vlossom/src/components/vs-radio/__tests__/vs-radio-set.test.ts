import { describe, it, expect, vi, afterEach } from 'vitest';
import { mount, type VueWrapper } from '@vue/test-utils';
import { defineComponent, nextTick, ref } from 'vue';

import VsRadioSet from './../VsRadioSet.vue';
import VsForm from '@/components/vs-form/VsForm.vue';

describe('VsRadioSet', () => {
    describe('비동기 options', () => {
        it('options가 비어 있으면 초기값을 정리하지 않고, options가 들어오면 그 기준으로 정리한다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: [],
                    modelValue: 'A',
                    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
                },
            });
            await nextTick();
            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
            expect(warnSpy).not.toHaveBeenCalled();

            // when
            await wrapper.setProps({ options: ['A', 'B'] });
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toBe('A');
            expect(wrapper.find('input:checked').exists()).toBe(true);

            // when
            await wrapper.setProps({ options: ['C'] });
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toBe(null);
            warnSpy.mockRestore();
        });
    });

    describe('emptyValue', () => {
        it('modelValue가 emptyValue와 같으면 마운트 시 값을 바꾸지 않고 경고도 출력하지 않는다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            const wrapper = mount(VsRadioSet, {
                props: { options: ['A', 'B'], modelValue: '', emptyValue: '' },
            });
            await nextTick();

            // then
            expect(wrapper.emitted('update:modelValue')).toBeUndefined();
            expect(warnSpy).not.toHaveBeenCalled();
            warnSpy.mockRestore();
        });

        it('clear 시 emptyValue를 emit한다', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B'],
                    modelValue: 'A',
                    emptyValue: '',
                    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
                },
            });

            // when
            wrapper.vm.clear();
            await nextTick();

            // then
            expect(wrapper.props('modelValue')).toBe('');
        });

        it('options에 없는 값은 emptyValue로 초기화된다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            const wrapper = mount(VsRadioSet, {
                props: { options: ['A', 'B'], modelValue: 'invalid', emptyValue: '' },
            });
            await nextTick();

            // then
            expect(wrapper.emitted('update:modelValue')?.slice(-1)[0]).toEqual(['']);
            warnSpy.mockRestore();
        });

        it('required일 때 emptyValue는 빈 값으로 검증된다', () => {
            // given
            const wrapper = mount(VsRadioSet, {
                props: { options: ['A', 'B'], modelValue: '', emptyValue: '', required: true },
            });

            // then
            expect(wrapper.vm.validate()).toBe(false);
        });

        it('VsForm clear 시 자식 radio도 같은 emptyValue를 써서 다른 값을 emit하지 않는다', async () => {
            // given
            const values: any[] = [];
            const Form = defineComponent({
                components: { VsForm, VsRadioSet },
                setup() {
                    const model = ref('');
                    return { model, onUpdate: (v: any) => values.push(v) };
                },
                template: `<vs-form ref="formRef">
                    <vs-radio-set v-model="model" :options="['A', 'B', 'C']" empty-value="" @update:modelValue="onUpdate" />
                </vs-form>`,
            });
            const wrapper = mount(Form);
            await nextTick();

            // when
            (wrapper.vm.$refs.formRef as any).clear();
            await nextTick();
            await nextTick();

            // then
            expect(values).toEqual([]);
        });

        it('required일 때 빈 문자열 옵션을 선택하면 통과한다', () => {
            // given
            const wrapper = mount(VsRadioSet, {
                props: { options: ['', 'A'], modelValue: '', required: true },
            });

            // then
            expect(wrapper.vm.validate()).toBe(true);
        });
    });

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
            expect(wrapper.emitted('clear')?.[0]).toEqual(['A']);
        });
    });

    describe('invalid modelValue warning', () => {
        it('options에 없는 초기 modelValue를 설정하면 경고가 출력된다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'invalid',
                },
            });
            await nextTick();

            // then
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Tried to set "invalid"'));
            warnSpy.mockRestore();
        });

        it('options에 있는 유효한 초기 modelValue를 설정하면 경고가 출력되지 않는다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // when
            mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'A',
                },
            });
            await nextTick();

            // then
            expect(warnSpy).not.toHaveBeenCalled();
            warnSpy.mockRestore();
        });

        it('프로그래매틱하게 options에 없는 값으로 변경하면 경고가 출력된다', async () => {
            // given
            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'A',
                    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'invalid' });
            await nextTick();

            // then
            expect(warnSpy).toHaveBeenCalledWith(expect.stringContaining('Tried to set "invalid"'));
            warnSpy.mockRestore();
        });

        it('options에 없는 초기 modelValue를 설정하면 null로 리셋된다', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'invalid',
                    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
                },
            });
            await nextTick();

            // then
            expect(wrapper.emitted('update:modelValue')?.[0]).toEqual([null]);
        });

        it('프로그래매틱하게 options에 없는 값으로 변경하면 null로 리셋된다', async () => {
            // given
            const wrapper: VueWrapper<InstanceType<typeof VsRadioSet>> = mount(VsRadioSet, {
                props: {
                    options: ['A', 'B', 'C'],
                    modelValue: 'A',
                    'onUpdate:modelValue': (value) => wrapper.setProps({ modelValue: value }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: 'invalid' });
            await nextTick();

            // then
            const events = wrapper.emitted('update:modelValue');
            expect(events?.[events.length - 1]).toEqual([null]);
        });
    });
});
