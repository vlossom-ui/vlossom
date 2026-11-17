import { describe, it, expect, beforeEach, vi } from 'vitest';
import { h, nextTick, ref } from 'vue';
import { mount, flushPromises } from '@vue/test-utils';
import type { FormInputEntry } from '@/declaration';
import VsForm from './../VsForm.vue';
import VsInput from '@/components/vs-input/VsInput.vue';
import { FormStore } from '@/stores/form-store';

function createEntry(entry: Partial<FormInputEntry> = {}): FormInputEntry {
    return {
        valid: ref(true),
        changed: ref(false),
        validate: async () => true,
        clear: () => {},
        reset: () => {},
        ...entry,
    };
}

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
        it('valid - 모든 input이 valid일 때 valid가 true여야 한다', () => {
            // given
            formStore.register('field1', createEntry({ valid: ref(true) }));
            formStore.register('field2', createEntry({ valid: ref(true) }));

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.valid).toBe(true);
        });

        it('valid - input 중 하나라도 invalid이면 valid가 false여야 한다', () => {
            // given
            formStore.register('field1', createEntry({ valid: ref(true) }));
            formStore.register('field2', createEntry({ valid: ref(false) }));

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.valid).toBe(false);
        });

        it('valid - 등록된 input이 없을 때 valid가 true여야 한다', () => {
            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.valid).toBe(true);
        });

        it('valid - input의 valid 변경과 해제가 반영되어야 한다', async () => {
            // given
            const valid = ref(true);
            formStore.register('field1', createEntry({ valid }));
            const wrapper = mount(VsForm);

            // when
            valid.value = false;
            await nextTick();

            // then
            expect(wrapper.vm.valid).toBe(false);

            // when
            formStore.unregister('field1');
            await nextTick();

            // then
            expect(wrapper.vm.valid).toBe(true);
        });

        it('changed - input 중 하나라도 changed이면 changed가 true여야 한다', () => {
            // given
            formStore.register('field1', createEntry({ changed: ref(false) }));
            formStore.register('field2', createEntry({ changed: ref(true) }));

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.changed).toBe(true);
        });

        it('changed - 모든 input이 changed가 아닐 때 changed가 false여야 한다', () => {
            // given
            formStore.register('field1', createEntry({ changed: ref(false) }));
            formStore.register('field2', createEntry({ changed: ref(false) }));

            // when
            const wrapper = mount(VsForm);

            // then
            expect(wrapper.vm.changed).toBe(false);
        });

        it('changed - 등록된 input이 없을 때 changed가 false여야 한다', () => {
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
                formStore.register('field1', createEntry({ validate: async () => true }));
                formStore.register('field2', createEntry({ validate: async () => true }));
                const wrapper = mount(VsForm);

                // when
                const result = await wrapper.vm.validate();

                // then
                expect(result).toBe(true);
            });

            it('유효하지 않은 필드가 있을 때 false를 반환하고 error 이벤트를 emit해야 한다', async () => {
                // given
                formStore.register('field1', createEntry({ validate: async () => true }));
                formStore.register('field2', createEntry({ validate: async () => false }));
                formStore.register('field3', createEntry({ validate: async () => false }));
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
                formStore.register('fast', createEntry({ validate: async () => true }));
                formStore.register(
                    'slow',
                    createEntry({ validate: () => new Promise<boolean>((resolve) => (resolveSlow = resolve)) }),
                );
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
            it('clear 호출 시 등록된 모든 input의 clear가 호출되어야 한다', () => {
                // given
                const clear1 = vi.fn();
                const clear2 = vi.fn();
                formStore.register('field1', createEntry({ clear: clear1 }));
                formStore.register('field2', createEntry({ clear: clear2 }));
                const wrapper = mount(VsForm);

                // when
                wrapper.vm.clear();

                // then
                expect(clear1).toHaveBeenCalledTimes(1);
                expect(clear2).toHaveBeenCalledTimes(1);
            });
        });

        describe('reset', () => {
            it('reset 호출 시 등록된 모든 input의 reset이 호출되어야 한다', () => {
                // given
                const reset1 = vi.fn();
                const reset2 = vi.fn();
                formStore.register('field1', createEntry({ reset: reset1 }));
                formStore.register('field2', createEntry({ reset: reset2 }));
                const wrapper = mount(VsForm);

                // when
                wrapper.vm.reset();

                // then
                expect(reset1).toHaveBeenCalledTimes(1);
                expect(reset2).toHaveBeenCalledTimes(1);
            });

            it('자식 input의 값을 초기값으로 되돌리고 changed를 false로 만들어야 한다', async () => {
                // given
                const wrapper = mount(VsForm, {
                    slots: { default: () => h(VsInput, { id: 'name', modelValue: 'initial' }) },
                });
                await flushPromises();
                await wrapper.find('input').setValue('edited');
                expect(wrapper.vm.changed).toBe(true);

                // when
                wrapper.vm.reset();
                await flushPromises();

                // then
                expect(wrapper.vm.changed).toBe(false);
            });
        });
    });

    describe('events', () => {
        it('validate 실패 시 error 이벤트가 잘못된 필드 ID 배열과 함께 emit되어야 한다', async () => {
            // given
            formStore.register('validField', createEntry({ validate: async () => true }));
            formStore.register('invalidField1', createEntry({ validate: async () => false }));
            formStore.register('invalidField2', createEntry({ validate: async () => false }));
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
            formStore.register('field1', createEntry({ validate: async () => true }));
            formStore.register('field2', createEntry({ validate: async () => true }));
            const wrapper = mount(VsForm);

            // when
            await wrapper.vm.validate();

            // then
            expect(wrapper.emitted('error')).toBeUndefined();
        });
    });
});
