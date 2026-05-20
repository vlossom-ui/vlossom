import { describe, expect, it, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import { nextTick, defineComponent } from 'vue';
import VsDatePicker from '../VsDatePicker.vue';
import VsForm from '@/components/vs-form/VsForm.vue';
import { DEFAULT_TIMEZONE_OPTIONS } from '../constants';
import { type TimezoneOption } from '../types';

function findDateInput(wrapper: ReturnType<typeof mount>) {
    return wrapper.find('.vs-date-picker-input input');
}

describe('VsDatePicker', () => {
    describe('datetime 기본 동작', () => {
        it('type=date에서 VsInput 내부 input의 type 속성이 date여야 한다', () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: null, type: 'date' },
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
                    props: { modelValue: null, type: t },
                });
                expect(findDateInput(wrapper).attributes('type')).toBe(t);
            }
        });

        it('type=time에서는 기본 시계 아이콘을 사용하고 그 외 타입은 캘린더 아이콘을 사용한다', () => {
            const timeWrapper = mount(VsDatePicker, {
                props: { modelValue: null, type: 'time' },
            });
            expect(timeWrapper.find('.vs-date-picker-icon circle').exists()).toBe(true);

            const dateWrapper = mount(VsDatePicker, {
                props: { modelValue: null, type: 'date' },
            });
            expect(dateWrapper.find('.vs-date-picker-icon rect').exists()).toBe(true);
        });

        it('modelValue가 Date면 display input value에 화면 표시용 ISO가 반영된다 (UTC tz)', () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: new Date('2026-05-18T15:30:00Z'),
                    type: 'datetime-local',
                },
            });
            // timezone=false → 'Etc/UTC' 고정 → 화면 표시값 = '2026-05-18T15:30'
            expect((findDateInput(wrapper).element as HTMLInputElement).value).toBe('2026-05-18T15:30');
        });

        it('min/max는 input attribute로 forward하지 않고 rule로 검증한다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: new Date('2025-12-31T00:00:00Z'),
                    type: 'date',
                    min: new Date('2026-01-01T00:00:00Z'),
                    max: new Date('2026-12-31T00:00:00Z'),
                },
            });
            const input = findDateInput(wrapper);
            expect(input.attributes('min')).toBeUndefined();
            expect(input.attributes('max')).toBeUndefined();

            expect((wrapper.vm as unknown as { validate: () => boolean }).validate()).toBe(false);
            await nextTick();
            expect(wrapper.text()).toContain('Must be on or after 2026-01-01T00:00:00.000Z');
        });

        it('canSelectDate가 false를 반환하는 날짜 입력 시 invalid 이벤트가 emit되고 modelValue는 그대로다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: null,
                    type: 'date',
                    canSelectDate: (date: Date) => !date.toISOString().startsWith('2026-05-18'),
                },
            });
            await findDateInput(wrapper).setValue('2026-05-18');
            expect(wrapper.emitted('invalid')).toBeTruthy();
            const events = wrapper.emitted('invalid') as Array<[{ reason: string }]>;
            expect(events[0][0].reason).toBe('disabled');
        });

        it('clear 버튼 클릭 시 clear 이벤트 emit + modelValue가 null이 된다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: new Date('2026-05-18T15:30:00Z'),
                    type: 'datetime-local',
                },
            });
            await wrapper.find('.vs-clear-button').trigger('click');
            expect(wrapper.emitted('clear')).toBeTruthy();
            const updates = wrapper.emitted('update:modelValue') as Array<[Date | null]>;
            expect(updates[updates.length - 1][0]).toBeNull();
        });

        it('readonly/disabled에서 clear 버튼이 렌더링되지 않는다', () => {
            const w1 = mount(VsDatePicker, {
                props: { modelValue: new Date(), readonly: true },
            });
            expect(w1.find('.vs-clear-button').exists()).toBe(false);

            const w2 = mount(VsDatePicker, {
                props: { modelValue: new Date(), disabled: true },
            });
            expect(w2.find('.vs-clear-button').exists()).toBe(false);
        });

        it('open() 메서드는 showPicker가 있으면 호출하고 없으면 focus한다', () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: null, type: 'date' },
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
                props: { modelValue: null, type: 'date' },
            });
            const input = findDateInput(wrapper).element as HTMLInputElement & {
                showPicker?: () => void;
            };
            const showPicker = vi.fn();
            input.showPicker = showPicker;
            await wrapper.find('.vs-date-picker-input').trigger('click');
            expect(showPicker).toHaveBeenCalled();
        });

        it('calendar icon 클릭 시에도 picker 가 열린다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: null, type: 'date' },
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
                    props: { modelValue: null, type: 'date', [propKey]: true },
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
                props: { modelValue: null, type: 'date', required: true },
            });
            await nextTick();
            expect(findDateInput(wrapper).attributes('aria-required')).toBe('true');
        });

        it('invalid raw input 시 invalid 이벤트가 emit된다 (onDateInput 직접 호출)', async () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: null, type: 'date' },
            });
            // jsdom의 input[type=date]는 invalid string을 element.value로 보관하지 않으므로
            // 핸들러를 직접 호출해 parse 실패 분기를 검증.
            const fn = (wrapper.vm as unknown as { onDateInput: (value: string) => void }).onDateInput;
            fn('not-a-date');
            await nextTick();
            const events = wrapper.emitted('invalid') as Array<[{ reason: string }]>;
            expect(events).toBeTruthy();
            expect(events[0][0].reason).toBe('parse');
        });

        it('VsForm 내부에서 validate()가 동작한다 (required 미충족)', async () => {
            const Form = defineComponent({
                components: { VsForm, VsDatePicker },
                template: '<vs-form ref="formRef"><vs-date-picker :modelValue="null" required type="date" /></vs-form>',
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

        it('VsForm 내부에서 빈 DatePicker의 timezone만 변경해도 form changed가 true가 되지 않는다', async () => {
            const Form = defineComponent({
                components: { VsForm, VsDatePicker },
                template: '<vs-form ref="formRef"><vs-date-picker :modelValue="null" type="datetime-local" timezone /></vs-form>',
            });
            const wrapper = mount(Form);
            await nextTick();

            const selectComp = wrapper.findComponent({ name: 'VsSelect' });
            selectComp.vm.$emit('update:model-value', 'Asia/Seoul');
            await nextTick();

            const formRef = (
                wrapper.vm as unknown as {
                    $refs: { formRef: { changed: boolean } };
                }
            ).$refs.formRef;
            expect(formRef.changed).toBe(false);
        });
    });

    describe('timezone 통합', () => {
        it('timezone=false(default)에서 timezone select가 렌더되지 않는다', () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: null, type: 'date' },
            });
            expect(wrapper.find('.vs-date-picker-timezone').exists()).toBe(false);
        });

        it('timezone=true에서 timezone select가 렌더되고 초기값은 timezoneOptions[0].value', () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: null,
                    type: 'datetime-local',
                    timezone: true,
                },
            });
            expect(wrapper.find('.vs-date-picker-timezone').exists()).toBe(true);
            const exposed = wrapper.vm as unknown as { currentTimezone: string };
            expect(exposed.currentTimezone).toBe(DEFAULT_TIMEZONE_OPTIONS[0].value);
        });

        it('timezone=true에서 timezone select와 date input field 가 동시에 렌더된다', () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: null,
                    type: 'datetime-local',
                    timezone: true,
                },
            });
            const root = wrapper.find('.vs-date-picker');
            expect(root.exists()).toBe(true);
            expect(root.find('.vs-date-picker-timezone').exists()).toBe(true);
            expect(root.find('.vs-date-picker-input input').exists()).toBe(true);
            expect(root.find('.vs-date-picker-native').exists()).toBe(false);
        });

        it('timezone=true에서 select와 date input 사이에 vertical vs-divider가 들어간다', () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: null,
                    type: 'datetime-local',
                    timezone: true,
                },
            });
            const divider = wrapper.find('.vs-date-picker-divider');
            expect(divider.exists()).toBe(true);
            expect(divider.classes()).toContain('vs-divider');
            expect(divider.classes()).toContain('vs-vertical');
        });

        it('timezone=false에서는 vs-divider도 렌더되지 않는다', () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: null, type: 'date' },
            });
            expect(wrapper.find('.vs-date-picker-divider').exists()).toBe(false);
        });

        it('responsive layout은 기본 적용되고 vs-divider 도 responsive 로 전환된다', () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: null,
                    type: 'datetime-local',
                    timezone: true,
                },
            });
            const divider = wrapper.find('.vs-date-picker-divider');
            // VsDivider 가 responsive prop 을 받아 vs-divider-responsive 클래스를 부여
            expect(divider.classes()).toContain('vs-divider-responsive');
        });

        it('timezone select 변경 시 화면에 보이는 날짜/시간이 유지되고 UTC가 재계산된다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: new Date('2026-05-18T15:30:00Z'),
                    type: 'datetime-local',
                    timezone: true,
                },
            });
            await nextTick();
            // UTC 모드에서 화면 표시값 = '2026-05-18T15:30'
            // Asia/Seoul로 바꾸면 화면 표시값 15:30을 KST로 해석 → UTC 06:30
            const selectComp = wrapper.findComponent({ name: 'VsSelect' });
            selectComp.vm.$emit('update:model-value', 'Asia/Seoul');
            await nextTick();

            const tzChangeEvents = wrapper.emitted('timezone-change') as Array<[{ from: string; to: string }]>;
            expect(tzChangeEvents).toBeTruthy();
            expect(tzChangeEvents[0][0]).toEqual({
                from: 'Etc/UTC',
                to: 'Asia/Seoul',
            });

            const updates = wrapper.emitted('update:modelValue') as Array<[Date]>;
            const newUtc = updates[updates.length - 1][0];
            expect(newUtc.toISOString()).toBe('2026-05-18T06:30:00.000Z');
        });

        it('invalid timezone 변경 시 invalid 이벤트가 emit된다 (currentTimezone 미변경)', async () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: null,
                    type: 'datetime-local',
                    timezone: true,
                },
            });
            const before = (wrapper.vm as unknown as { currentTimezone: string }).currentTimezone;
            const selectComp = wrapper.findComponent({ name: 'VsSelect' });
            selectComp.vm.$emit('update:model-value', 'Invalid/Zone');
            await nextTick();

            const invalidEvents = wrapper.emitted('invalid') as Array<[{ reason: string }]>;
            expect(invalidEvents).toBeTruthy();
            expect(invalidEvents[0][0].reason).toBe('timezone');
            const after = (wrapper.vm as unknown as { currentTimezone: string }).currentTimezone;
            expect(after).toBe(before);
        });

        it('사용자 정의 timezoneOptions의 첫번째가 초기값으로 사용된다', () => {
            const custom: TimezoneOption[] = [
                { value: 'Asia/Seoul', label: 'Seoul' },
                { value: 'Etc/UTC', label: 'UTC' },
            ];
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: null,
                    type: 'datetime-local',
                    timezone: true,
                    timezoneOptions: custom,
                },
            });
            const exposed = wrapper.vm as unknown as { currentTimezone: string };
            expect(exposed.currentTimezone).toBe('Asia/Seoul');
        });

        it('exposed currentTimezone은 외부에서 readonly Ref로 노출된다', () => {
            const wrapper = mount(VsDatePicker, {
                props: { modelValue: null, type: 'date', timezone: true },
            });
            const exposed = wrapper.vm as unknown as { currentTimezone: string };
            expect(exposed.currentTimezone).toBeDefined();
            expect(typeof exposed.currentTimezone).toBe('string');
        });

        it('VsInput 입력 시 currentTimezone 기준으로 UTC가 재계산된다', async () => {
            const wrapper = mount(VsDatePicker, {
                props: {
                    modelValue: null,
                    type: 'datetime-local',
                    timezone: true,
                    timezoneOptions: [{ value: 'Asia/Seoul', label: 'Seoul' }],
                },
            });
            await nextTick();
            await findDateInput(wrapper).setValue('2026-05-18T15:30');
            const updates = wrapper.emitted('update:modelValue') as Array<[Date]>;
            const utc = updates[updates.length - 1][0];
            // Seoul 15:30 → UTC 06:30
            expect(utc.toISOString()).toBe('2026-05-18T06:30:00.000Z');
        });
    });
});
