import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import VsForm from './../VsForm.vue';
import { FormStore } from '@/stores/form-store';

describe('VsForm', () => {
    let formStore: FormStore;

    beforeEach(() => {
        formStore = new FormStore();
        vi.spyOn(FormStore, 'getDefaultFormStore').mockImplementation(() => formStore);
    });

    describe('기본 렌더링', () => {
        it('form 태그로 렌더링되어야 한다', () => {
            // given, when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.find('form').exists()).toBe(true);
            expect(wrapper.find('form').classes()).toContain('vs-form');
        });
    });

    describe('disabled', () => {
        it('disabled prop이 true로 설정되면 FormStore에 반영되어야 한다', () => {
            // given, when
            const wrapper = mount(VsForm, {
                props: {
                    disabled: true,
                },
            });

            // then
            expect(wrapper.props('disabled')).toBe(true);
            expect(formStore.disabled.value).toBe(true);
        });

        it('disabled prop이 변경되면 FormStore에 즉시 반영되어야 한다', async () => {
            // given
            const wrapper = mount(VsForm, {
                props: {
                    disabled: false,
                },
            });

            // when
            await wrapper.setProps({ disabled: true });

            // then
            expect(formStore.disabled.value).toBe(true);
        });
    });

    describe('readonly', () => {
        it('readonly prop이 true로 설정되면 FormStore에 반영되어야 한다', () => {
            // given, when
            const wrapper = mount(VsForm, {
                props: {
                    readonly: true,
                },
            });

            // then
            expect(wrapper.props('readonly')).toBe(true);
            expect(formStore.readonly.value).toBe(true);
        });

        it('readonly prop이 변경되면 FormStore에 즉시 반영되어야 한다', async () => {
            // given
            const wrapper = mount(VsForm, {
                props: {
                    readonly: false,
                },
            });

            // when
            await wrapper.setProps({ readonly: true });

            // then
            expect(formStore.readonly.value).toBe(true);
        });
    });

    describe('computed properties', () => {
        it('valid - 모든 validObj가 true일 때 valid가 true여야 한다', () => {
            // given
            formStore.setValidObj({ field1: true, field2: true, field3: true });

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.valid).toBe(true);
        });

        it('valid - validObj 중 하나라도 false이면 valid가 false여야 한다', () => {
            // given
            formStore.setValidObj({ field1: true, field2: false, field3: true });

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.valid).toBe(false);
        });

        it('valid - validObj가 빈 객체일 때 valid가 true여야 한다', () => {
            // given
            formStore.setValidObj({});

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.valid).toBe(true);
        });

        it('changed - changedObj 중 하나라도 true이면 changed가 true여야 한다', () => {
            // given
            formStore.setChangedObj({ field1: false, field2: true, field3: false });

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.changed).toBe(true);
        });

        it('changed - 모든 changedObj가 false일 때 changed가 false여야 한다', () => {
            // given
            formStore.setChangedObj({ field1: false, field2: false, field3: false });

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.changed).toBe(false);
        });

        it('changed - changedObj가 빈 객체일 때 changed가 false여야 한다', () => {
            // given
            formStore.setChangedObj({});

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.changed).toBe(false);
        });
    });

    describe('methods', () => {
        describe('validate', () => {
            it('모든 필드가 유효할 때 true를 반환해야 한다', async () => {
                // given
                formStore.setValidObj({ field1: true, field2: true });
                const wrapper = mount(VsForm);

                // when
                const result = await wrapper.vm.validate();

                // then
                expect(result).toBe(true);
            });

            it('유효하지 않은 필드가 있을 때 false를 반환하고 error 이벤트를 emit해야 한다', async () => {
                // given
                formStore.setValidObj({ field1: true, field2: false, field3: false });
                const wrapper = mount(VsForm);

                // when
                const result = await wrapper.vm.validate();

                // then
                expect(result).toBe(false);
                expect(wrapper.emitted('error')).toBeDefined();
                expect(wrapper.emitted('error')?.[0]).toEqual([['field2', 'field3']]);
            });

            it('validate 호출 시 FormStore의 validateFlag가 토글되어야 한다', async () => {
                // given
                const initialFlag = formStore.validateFlag.value;
                formStore.setValidObj({ field1: true });
                const wrapper = mount(VsForm);
                const toggleValidateFlagSpy = vi.spyOn(formStore, 'toggleValidateFlag');

                // when
                await wrapper.vm.validate();

                // then
                expect(toggleValidateFlagSpy).toHaveBeenCalled();
                expect(formStore.validateFlag.value).toBe(!initialFlag);
            });
        });

        describe('clear', () => {
            it('clear 호출 시 FormStore의 clearFlag가 토글되어야 한다', () => {
                // given
                const initialFlag = formStore.clearFlag.value;
                const wrapper = mount(VsForm);
                const toggleClearFlagSpy = vi.spyOn(formStore, 'toggleClearFlag');

                // when
                wrapper.vm.clear();

                // then
                expect(toggleClearFlagSpy).toHaveBeenCalled();
                expect(formStore.clearFlag.value).toBe(!initialFlag);
            });
        });
    });

    describe('events', () => {
        it('validate 실패 시 error 이벤트가 잘못된 필드 ID 배열과 함께 emit되어야 한다', async () => {
            // given
            formStore.setValidObj({
                validField: true,
                invalidField1: false,
                invalidField2: false,
            });
            const wrapper = mount(VsForm);

            // when
            await wrapper.vm.validate();

            // then
            const errorEvents = wrapper.emitted('error');
            expect(errorEvents).toBeDefined();
            expect(errorEvents?.[0]).toEqual([['invalidField1', 'invalidField2']]);
        });

        it('모든 필드가 유효할 때 error 이벤트가 emit되지 않아야 한다', async () => {
            // given
            formStore.setValidObj({ field1: true, field2: true });
            const wrapper = mount(VsForm);

            // when
            await wrapper.vm.validate();

            // then
            expect(wrapper.emitted('error')).toBeUndefined();
        });
    });
});
