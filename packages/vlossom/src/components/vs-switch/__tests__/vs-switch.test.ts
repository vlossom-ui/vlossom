import { afterEach, describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick } from 'vue';
import VsSwitch from './../VsSwitch.vue';

describe('VsSwitch', () => {
    describe('v-model', () => {
        it('modelValue를 바꿔서 스위치 값을 업데이트할 수 있다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: false,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await wrapper.setProps({ modelValue: true });

            // then
            expect(wrapper.vm.isChecked).toBe(true);
        });

        it('modelValue가 null이면 false로 보정된다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: null,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await nextTick();

            // then
            expect(wrapper.vm.isChecked).toBe(false);
            expect(wrapper.props('modelValue')).toBe(false);
        });

        it('modelValue에 null을 할당하면 falseValue로 보정된다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: 'hello',
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: 'hello',
                    falseValue: 'world',
                },
            });

            // when
            await wrapper.setProps({ modelValue: null });

            // then
            expect(wrapper.vm.isChecked).toBe(false);
            expect(wrapper.vm.inputValue).toBe('world');
        });
    });

    describe('true / false value', () => {
        it('스위치를 true로 업데이트하면 modelValue를 trueValue로 업데이트한다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: 'B',
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: 'A',
                    falseValue: 'B',
                },
            });

            // when
            await wrapper.find('input').trigger('change');

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toHaveLength(1);
            expect(updateModelValueEvent?.[0][0]).toEqual('A');
        });

        it('스위치를 false로 업데이트하면 modelValue를 falseValue로 업데이트한다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: 'A',
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: 'A',
                    falseValue: 'B',
                },
            });

            // when
            await wrapper.find('input').trigger('change');

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toHaveLength(1);
            expect(updateModelValueEvent?.[0][0]).toEqual('B');
        });

        it('object 타입 trueValue, falseValue를 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: { id: 'A' },
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: { id: 'A' },
                    falseValue: { id: 'B' },
                },
            });

            // then
            expect(wrapper.vm.isChecked).toBe(true);
        });
    });

    describe('true / false label', () => {
        it('false-label을 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    falseLabel: 'Rejected',
                    modelValue: false,
                },
            });

            // then
            const label = wrapper.find('.vs-status-label[data-value=false]');
            expect(label.isVisible()).toBe(true);
            expect(label.text()).toBe('Rejected');
        });
        it('true-label을 설정할 수 있다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    trueLabel: 'Approved',
                    modelValue: false,
                    'onUpdate:modelValue': (e: any) => wrapper.setProps({ modelValue: e }),
                },
            });

            const target = wrapper.find('input.vs-switch-input');
            await target.trigger('change');

            // then
            const label = wrapper.find('.vs-status-label[data-value=true]');
            expect(label.isVisible()).toBe(true);
            expect(label.text()).toBe('Approved');
        });
    });

    describe('v-model (multiple true)', () => {
        it('modelValue 원소 중 하나라도 trueValue와 일치하면 스위치 값은 true이다', () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    multiple: true,
                    modelValue: ['A'],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: 'A',
                },
            });

            // then
            expect(wrapper.vm.isChecked).toBe(true);
        });

        it('스위치를 true로 업데이트하면 trueValue가 modelValue 배열에 포함된다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    multiple: true,
                    modelValue: [],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: 'A',
                },
            });

            // when
            await wrapper.find('input').trigger('change');

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toHaveLength(1);
            expect(updateModelValueEvent?.[0][0]).toEqual(['A']);
        });

        it('modelValue의 초깃값이 null이면 빈 배열로 보정된다', () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    multiple: true,
                    modelValue: null,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: 'A',
                },
            });

            // then
            expect(wrapper.vm.isChecked).toBe(false);
            expect(wrapper.vm.inputValue).toEqual([]);
        });

        it('modelValue에 null을 할당하면 빈 배열로 보정된다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    multiple: true,
                    modelValue: ['A'],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: 'A',
                },
            });

            // when
            await wrapper.setProps({ modelValue: null });

            // then
            expect(wrapper.vm.isChecked).toBe(false);
            expect(wrapper.vm.inputValue).toEqual([]);
        });

        it('array 타입 modelValue를 바꿔서 스위치 값을 업데이트할 수 있다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    multiple: true,
                    modelValue: [],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: 'A',
                },
            });

            // when
            await wrapper.setProps({ modelValue: ['A'] });

            // then
            expect(wrapper.vm.isChecked).toBe(true);
        });

        it('object array 타입으로 modelValue의 초깃값을 설정할 수 있다', () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    multiple: true,
                    modelValue: [{ id: 'A' }],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: { id: 'A' },
                },
            });

            // then
            expect(wrapper.vm.isChecked).toBe(true);
        });

        it('object array 타입으로 modelValue를 업데이트할 수 있다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    multiple: true,
                    modelValue: [],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: { id: 'A' },
                },
            });

            // when
            await wrapper.find('input').trigger('change');

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toHaveLength(1);
            expect(updateModelValueEvent?.[0][0]).toEqual([{ id: 'A' }]);
        });

        it('object array 타입 modelValue를 바꿔서 스위치 값을 업데이트할 수 있다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    multiple: true,
                    modelValue: [],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    trueValue: { id: 'A' },
                },
            });

            // when
            await wrapper.setProps({ modelValue: [{ id: 'A' }] });

            // then
            expect(wrapper.vm.isChecked).toBe(true);
        });
    });

    describe('checked', () => {
        it('checked를 설정하면 체크된 상태로 mount된다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    checked: true,
                },
            });

            // when
            await nextTick();

            // then
            expect(wrapper.vm.isChecked).toBe(true);
        });

        it('multiple일 때 checked를 설정하면 array에 값이 들어가 있다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    multiple: true,
                    checked: true,
                    modelValue: [],
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                },
            });

            // when
            await nextTick();

            // then
            expect(wrapper.vm.inputValue).toEqual([true]);
        });
    });

    describe('clear', () => {
        describe('multiple이 true인 경우', () => {
            it('clear 함수를 호출하면 빈 배열로 업데이트된다', async () => {
                // given
                const wrapper = mount(VsSwitch, {
                    props: {
                        multiple: true,
                        modelValue: ['A', 'B'],
                        'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                        trueValue: 'A',
                    },
                });

                // when
                wrapper.vm.clear();
                await nextTick();

                // then
                expect(wrapper.vm.isChecked).toBe(false);
                expect(wrapper.props('modelValue')).toEqual([]);
            });
        });

        describe('multiple이 false이거나 v-model이 array 타입이 아닌 경우', () => {
            it('clear 함수를 호출하면 falseValue로 업데이트된다', async () => {
                // given
                const wrapper = mount(VsSwitch, {
                    props: {
                        modelValue: true,
                        'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    },
                });

                // when
                wrapper.vm.clear();
                await nextTick();

                // then
                expect(wrapper.vm.isChecked).toBe(false);
                expect(wrapper.props('modelValue')).toBe(false);
            });
        });
    });

    describe('rules', () => {
        it('required 체크가 가능하다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: true,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    required: true,
                },
            });

            // when
            await nextTick();
            await wrapper.setProps({ modelValue: false });

            // then
            expect(wrapper.vm.computedMessages).toHaveLength(1);
            expect(wrapper.html()).toContain('required');
        });
    });

    describe('validate', () => {
        it('valid할 때 validate 함수를 호출하면 true를 반환한다', () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: true,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    required: true,
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(true);
        });

        it('invalid할 때 validate 함수를 호출하면 false를 반환한다', () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: false,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    required: true,
                },
            });

            // then
            expect(wrapper.vm.validate()).toBe(false);
        });
    });

    describe('before change', () => {
        afterEach(() => {
            vi.restoreAllMocks();
        });

        it('beforeChange 함수에 from, to 인자가 전달된다', async () => {
            // given
            const beforeChange = vi.fn().mockResolvedValue(true);
            const wrapper = mount(VsSwitch, {
                props: {
                    trueValue: 'A',
                    falseValue: 'B',
                    modelValue: 'B',
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    beforeChange,
                },
            });

            // when
            await wrapper.find('input').trigger('change');

            // then
            expect(beforeChange).toHaveBeenCalledWith('B', 'A');
        });

        it('beforeChange 함수가 Promise<true>를 리턴하면 값이 업데이트된다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: false,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    beforeChange: () => Promise.resolve(true),
                },
            });

            // when
            await wrapper.find('input').trigger('change');

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toHaveLength(1);
            expect(updateModelValueEvent?.[0][0]).toEqual(true);
        });

        it('beforeChange 함수가 Promise<false>를 리턴하면 값이 업데이트되지 않는다', async () => {
            // given
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: false,
                    'onUpdate:modelValue': (e) => wrapper.setProps({ modelValue: e }),
                    beforeChange: () => Promise.resolve(false),
                },
            });

            // when
            await wrapper.find('input').trigger('change');

            // then
            const updateModelValueEvent = wrapper.emitted('update:modelValue');
            expect(updateModelValueEvent).toBeUndefined();
        });
    });

    describe('styleSet', () => {
        it('styleSet 객체가 주어지면 스타일이 적용되어야 한다', () => {
            // given, when
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: false,
                    styleSet: {
                        variables: {
                            width: 'fit-content',
                            height: '2.5rem',
                            backgroundColor: '#f5f5f5',
                            border: '2px solid #ddd',
                            borderRadius: '2rem',
                            handleSize: '1.8rem',
                            handleColor: '#4caf50',
                        },
                    },
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables).toEqual({
                '--vs-switch-width': 'fit-content',
                '--vs-switch-height': '2.5rem',
                '--vs-switch-backgroundColor': '#f5f5f5',
                '--vs-switch-border': '2px solid #ddd',
                '--vs-switch-borderRadius': '2rem',
                '--vs-switch-handleSize': '1.8rem',
                '--vs-switch-handleColor': '#4caf50',
            });
        });
    });

    describe('styleSet 하위 속성 전달', () => {
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
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: false,
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
                    width: '4rem',
                    height: '2rem',
                    backgroundColor: '#e3f2fd',
                },
                wrapper: {
                    variables: {
                        width: '200px',
                        label: {
                            fontColor: '#1976d2',
                            fontSize: '0.875rem',
                        },
                    },
                },
            };

            // when
            const wrapper = mount(VsSwitch, {
                props: {
                    modelValue: false,
                    styleSet: fullStyleSet,
                },
            });

            // then
            expect(wrapper.vm.styleSetVariables['--vs-switch-width']).toBe('4rem');
            expect(wrapper.vm.componentStyleSet.wrapper).toEqual(fullStyleSet.wrapper);
        });
    });
});
