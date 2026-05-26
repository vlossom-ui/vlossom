import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, defineComponent } from 'vue';
import VsDatePicker from '../VsDatePicker.vue';
import VsForm from '@/components/vs-form/VsForm.vue';

function findDateInput(wrapper: ReturnType<typeof mount>) {
    return wrapper.find('.vs-date-picker input');
}

describe('VsDatePicker', () => {
    describe('datetime 기본 동작', () => {
        it('type=date에서 VsInput 내부 input의 type 속성이 date여야 한다', () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: '', type: 'date' },
            });
            expect(findDateInput(wrapper).attributes('type')).toBe('date');
        });

        it('type 4종 (date/datetime-local/time/month) 전환', () => {
            const types: Array<'date' | 'datetime-local' | 'time' | 'month'> = [
                'date',
                'datetime-local',
                'time',
                'month',
            ];
            for (const t of types) {
                const wrapper = mount(VsDatePicker, {
                    props: { modelValue: '', type: t },
                });
                expect(findDateInput(wrapper).attributes('type')).toBe(t);
            }
        });

        it('type=time에서는 기본 시계 아이콘을 사용하고 그 외 타입은 캘린더 아이콘을 사용한다', () => {
            const timeWrapper = mount(VsDatePicker, {
                props: { modelValue: '', type: 'time' },
            });
            expect(timeWrapper.find('.vs-date-picker-icon circle').exists()).toBe(true);

            const dateWrapper = mount(VsDatePicker, {
                props: { modelValue: '', type: 'date' },
            });
            expect(dateWrapper.find('.vs-date-picker-icon rect').exists()).toBe(true);
        });

        it('modelValue 가 type 형식에 맞는 string 이면 그대로 input 에 표시된다', () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: '2026-05-18T15:30',
                    type: 'datetime-local',
                },
            });
            expect((findDateInput(wrapper).element as HTMLInputElement).value).toBe('2026-05-18T15:30');
        });

        it('min/max는 input attribute로 forward하지 않고 rule로 검증한다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: '2025-12-31',
                    type: 'date',
                    min: '2026-01-01',
                    max: '2026-12-31',
                },
            });
            const input = findDateInput(wrapper);
            expect(input.attributes('min')).toBeUndefined();
            expect(input.attributes('max')).toBeUndefined();

            expect((wrapper.vm as unknown as { validate: () => boolean }).validate()).toBe(false);
            await nextTick();
            expect(wrapper.text()).toContain('Must be on or after 2026-01-01');
        });

        it('clear 버튼 클릭 시 clear 이벤트 emit + modelValue가 빈 문자열이 된다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: '2026-05-18T15:30',
                    type: 'datetime-local',
                },
            });
            await wrapper.find('.vs-clear-button').trigger('click');
            expect(wrapper.emitted('clear')).toBeTruthy();
            const updates = wrapper.emitted('update:modelValue') as Array<[string]>;
            expect(updates[updates.length - 1][0]).toBe('');
        });

        it('readonly/disabled에서 clear 버튼이 렌더링되지 않는다', () => {
            const w1 = mount(VsDatePicker, {
                props: { modelValue: '2026-05-18', readonly: true },
            });
            expect(w1.find('.vs-clear-button').exists()).toBe(false);

            const w2 = mount(VsDatePicker, {
                props: { modelValue: '2026-05-18', disabled: true },
            });
            expect(w2.find('.vs-clear-button').exists()).toBe(false);
        });

        it('open() 메서드는 showPicker가 있으면 호출하고 없으면 focus한다', () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: '', type: 'date' },
            });
            const input = findDateInput(wrapper).element as HTMLInputElement & {
                showPicker?: () => void;
            };
            const showPicker = vi.fn();
            input.showPicker = showPicker;
            (wrapper.vm as unknown as { open: () => void }).open();
            expect(showPicker).toHaveBeenCalled();
        });

        it('date input 영역 클릭 시 picker 가 열린다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: '', type: 'date' },
            });
            const input = findDateInput(wrapper).element as HTMLInputElement & {
                showPicker?: () => void;
            };
            const showPicker = vi.fn();
            input.showPicker = showPicker;
            await wrapper.find('.vs-date-picker').trigger('click');
            expect(showPicker).toHaveBeenCalled();
        });

        it('calendar icon 클릭 시에도 picker 가 열린다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: '', type: 'date' },
            });
            const input = findDateInput(wrapper).element as HTMLInputElement & {
                showPicker?: () => void;
            };
            const showPicker = vi.fn();
            input.showPicker = showPicker;
            await wrapper.find('.vs-date-picker-icon').trigger('click');
            expect(showPicker).toHaveBeenCalled();
        });

        it('open() 메서드는 readonly/disabled 상태에서 showPicker를 호출하지 않는다', () => {
            for (const propKey of ['readonly', 'disabled'] as const) {
                const wrapper = mount(VsDatePicker, {
                    props: { modelValue: '', type: 'date', [propKey]: true },
                });
                const input = findDateInput(wrapper).element as HTMLInputElement & {
                    showPicker?: () => void;
                };
                const showPicker = vi.fn();
                input.showPicker = showPicker;
                (wrapper.vm as unknown as { open: () => void }).open();
                expect(showPicker).not.toHaveBeenCalled();
            }
        });

        it('aria-required는 VsInput 내부 input에 forward된다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: '', type: 'date', required: true },
            });
            await nextTick();
            expect(findDateInput(wrapper).attributes('aria-required')).toBe('true');
        });

        it('VsForm 내부에서 validate()가 동작한다 (required 미충족)', async () => {
            const Form = defineComponent({
                components: { VsForm, VsDatePicker },
                template: '<vs-form ref="formRef"><vs-date-picker :modelValue="\'\'" required type="date" /></vs-form>',
            });
            const wrapper = mount(Form);
            await nextTick();
            const formRef = (
                wrapper.vm as unknown as {
                    $refs: { formRef: { validate: () => boolean | Promise<boolean> } };
                }
            ).$refs.formRef;
            const valid = await formRef.validate();
            expect(valid).toBe(false);
        });
    });

    describe('format validation', () => {
        it('잘못된 format 의 modelValue 가 외부에서 주입되면 invalid 이벤트가 emit 되고 display 가 비워진다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: 'garbage', type: 'date' },
            });
            await nextTick();
            const events = wrapper.emitted('invalid') as Array<[{ input: string }]>;
            expect(events).toBeTruthy();
            expect(events[0][0].input).toBe('garbage');
            expect((findDateInput(wrapper).element as HTMLInputElement).value).toBe('');
        });

        it('잘못된 format 의 modelValue 가 들어와도 modelValue 자체는 갱신되지 않는다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: 'garbage', type: 'date' },
            });
            await nextTick();
            expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        });

        it('valid format string 을 입력하면 update:modelValue 가 emit 된다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: '', type: 'date' },
            });
            await findDateInput(wrapper).setValue('2026-05-18');
            const updates = wrapper.emitted('update:modelValue') as Array<[string]>;
            expect(updates[updates.length - 1][0]).toBe('2026-05-18');
        });
    });

    describe('type prop 변경', () => {
        it('type 변경 시 modelValue를 자동 변환하지 않고 형식이 맞지 않으면 display를 비운다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: '2026-05-18', type: 'date' },
            });
            await wrapper.setProps({ type: 'datetime-local' });

            expect(wrapper.emitted('update:modelValue')).toBeFalsy();
            expect(wrapper.props('modelValue')).toBe('2026-05-18');
            expect((findDateInput(wrapper).element as HTMLInputElement).value).toBe('');
        });

        it('type과 modelValue를 함께 변경하면 새 형식의 값을 표시한다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: '2026-05-18', type: 'date' },
            });
            await wrapper.setProps({ type: 'month', modelValue: '2026-05' });

            expect((findDateInput(wrapper).element as HTMLInputElement).value).toBe('2026-05');
        });

        it('modelValue 가 비어 있으면 type 변경 시 emit 이 발생하지 않는다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: '', type: 'date' },
            });
            await wrapper.setProps({ type: 'datetime-local' });
            expect(wrapper.emitted('update:modelValue')).toBeFalsy();
        });
    });
});
