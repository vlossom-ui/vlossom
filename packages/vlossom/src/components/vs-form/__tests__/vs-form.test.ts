import { describe, it, expect, beforeEach, vi } from 'vitest';
import { h } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import VsForm from './../VsForm.vue';
import VsInput from '@/components/vs-input/VsInput.vue';
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

    describe('submit 동작', () => {
        it('기본적으로 브라우저 submit을 막는다', () => {
            const wrapper = mount(VsForm);
            const event = new Event('submit', { cancelable: true });
            wrapper.find('form').element.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
        });

        it('nativeSubmit이 true이면 브라우저 submit을 허용한다', () => {
            const wrapper = mount(VsForm, { props: { nativeSubmit: true } });
            const event = new Event('submit', { cancelable: true });
            wrapper.find('form').element.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(false);
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
            formStore.updateValid('field1', true);
            formStore.updateValid('field2', true);
            formStore.updateValid('field3', true);

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.valid).toBe(true);
        });

        it('valid - validObj 중 하나라도 false이면 valid가 false여야 한다', () => {
            // given
            formStore.updateValid('field1', true);
            formStore.updateValid('field2', false);
            formStore.updateValid('field3', true);

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.valid).toBe(false);
        });

        it('valid - validObj가 빈 객체일 때 valid가 true여야 한다', () => {
            // given
            formStore.updateValid('field1', true);
            formStore.updateValid('field2', true);
            formStore.updateValid('field3', true);

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.valid).toBe(true);
        });

        it('changed - changedObj 중 하나라도 true이면 changed가 true여야 한다', () => {
            // given
            formStore.updateChanged('field1', false);
            formStore.updateChanged('field2', true);
            formStore.updateChanged('field3', false);

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.changed).toBe(true);
        });

        it('changed - 모든 changedObj가 false일 때 changed가 false여야 한다', () => {
            // given
            formStore.updateChanged('field1', false);
            formStore.updateChanged('field2', false);
            formStore.updateChanged('field3', false);

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.changed).toBe(false);
        });

        it('changed - changedObj가 빈 객체일 때 changed가 false여야 한다', () => {
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
                formStore.setValidator('field1', async () => true);
                formStore.setValidator('field2', async () => true);
                const wrapper = mount(VsForm);

                // when
                const result = await wrapper.vm.validate();

                // then
                expect(result).toBe(true);
            });

            it('유효하지 않은 필드가 있을 때 false를 반환하고 error 이벤트를 emit해야 한다', async () => {
                // given
                formStore.setValidator('field1', async () => true);
                formStore.setValidator('field2', async () => false);
                formStore.setValidator('field3', async () => false);
                const wrapper = mount(VsForm);

                // when
                const result = await wrapper.vm.validate();

                // then
                expect(result).toBe(false);
                expect(wrapper.emitted('error')).toBeDefined();
                expect(wrapper.emitted('error')?.[0]).toEqual([['field2', 'field3']]);
            });

            it('등록된 모든 validator가 끝날 때까지 기다린 뒤 결과를 반환해야 한다', async () => {
                // given
                let resolveSlow: (valid: boolean) => void = () => {};
                formStore.setValidator('fast', async () => true);
                formStore.setValidator('slow', () => new Promise<boolean>((resolve) => (resolveSlow = resolve)));
                const wrapper = mount(VsForm);

                // when
                let result: boolean | undefined;
                wrapper.vm.validate().then((value: boolean) => (result = value));
                await flushPromises();

                // then
                expect(result).toBeUndefined();
                resolveSlow(false);
                await flushPromises();
                expect(result).toBe(false);
                expect(wrapper.emitted('error')?.[0]).toEqual([['slow']]);
            });

            it('자식 input의 async rule 결과를 기다려서 반영해야 한다 (#764)', async () => {
                // given
                let resolveRule: (message: string) => void = () => {};
                const asyncRule = () => new Promise<string>((resolve) => (resolveRule = resolve));
                const wrapper = mount(VsForm, {
                    slots: { default: () => h(VsInput, { id: 'user-id', modelValue: 'admin', rules: [asyncRule] }) },
                });
                await flushPromises();

                // when
                let result: boolean | undefined;
                wrapper.vm.validate().then((value: boolean) => (result = value));
                await flushPromises();

                // then
                expect(result).toBeUndefined();
                resolveRule('Already taken');
                await flushPromises();
                expect(result).toBe(false);
                expect(wrapper.emitted('error')?.[0]).toEqual([['user-id']]);
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

        describe('reset', () => {
            it('reset 호출 시 FormStore의 resetFlag가 토글되어야 한다', () => {
                // given
                const initialFlag = formStore.resetFlag.value;
                const wrapper = mount(VsForm);
                const toggleResetFlagSpy = vi.spyOn(formStore, 'toggleResetFlag');

                // when
                wrapper.vm.reset();

                // then
                expect(toggleResetFlagSpy).toHaveBeenCalled();
                expect(formStore.resetFlag.value).toBe(!initialFlag);
            });
        });
    });

    describe('events', () => {
        it('validate 실패 시 error 이벤트가 잘못된 필드 ID 배열과 함께 emit되어야 한다', async () => {
            // given
            formStore.setValidator('validField', async () => true);
            formStore.setValidator('invalidField1', async () => false);
            formStore.setValidator('invalidField2', async () => false);
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
            formStore.setValidator('field1', async () => true);
            formStore.setValidator('field2', async () => true);
            const wrapper = mount(VsForm);

            // when
            await wrapper.vm.validate();

            // then
            expect(wrapper.emitted('error')).toBeUndefined();
        });
    });
});
