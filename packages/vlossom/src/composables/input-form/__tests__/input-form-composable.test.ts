import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ref, defineComponent, type Ref, nextTick } from 'vue';
import { mount } from '@vue/test-utils';
import { FormStore } from '@/stores';
import { useInputForm } from './../input-form-composable';

describe('useInputForm', () => {
    let formStore: FormStore;
    let id: Ref<string>;
    let valid: Ref<boolean>;
    let changed: Ref<boolean>;
    let validateSpy: ReturnType<typeof vi.fn<() => Promise<boolean>>>;
    let clearSpy: ReturnType<typeof vi.fn<() => void>>;
    let resetSpy: ReturnType<typeof vi.fn<() => void>>;
    let TestComponent: ReturnType<typeof defineComponent>;

    beforeEach(() => {
        formStore = new FormStore();
        vi.spyOn(FormStore, 'getDefaultFormStore').mockImplementation(() => formStore);
        id = ref('test-input-id');
        valid = ref(true);
        changed = ref(false);
        validateSpy = vi.fn<() => Promise<boolean>>(async () => true);
        clearSpy = vi.fn<() => void>();
        resetSpy = vi.fn<() => void>();
        TestComponent = defineComponent({
            setup() {
                const result = useInputForm(id, valid, changed, validateSpy, clearSpy, resetSpy);
                return { result };
            },
            template: '<div></div>',
        });
    });

    it('컴포넌트 마운트 시 input의 상태와 함수가 폼 스토어에 등록되어야 한다', () => {
        // when
        mount(TestComponent);

        // then
        const entry = formStore.inputs.get('test-input-id');
        expect(entry?.valid).toBe(valid);
        expect(entry?.changed).toBe(changed);
        expect(entry?.validate).toBe(validateSpy);
        expect(entry?.clear).toBe(clearSpy);
        expect(entry?.reset).toBe(resetSpy);
    });

    it('valid, changed 값이 변경되면 등록된 항목에서 바로 반영되어야 한다', () => {
        // given
        mount(TestComponent);

        // when
        valid.value = false;
        changed.value = true;

        // then
        const entry = formStore.inputs.get('test-input-id');
        expect(entry?.valid.value).toBe(false);
        expect(entry?.changed.value).toBe(true);
    });

    it('id가 변경되면 이전 id를 해제하고 새 id로 등록해야 한다', async () => {
        // given
        mount(TestComponent);
        const unregisterSpy = vi.spyOn(formStore, 'unregister');
        const registerSpy = vi.spyOn(formStore, 'register');

        // when
        id.value = 'new-input-id';
        await nextTick();

        // then
        expect(unregisterSpy).toHaveBeenCalledWith('test-input-id');
        expect(registerSpy).toHaveBeenCalledWith('new-input-id', expect.any(Object));
        expect(unregisterSpy.mock.invocationCallOrder[0]).toBeLessThan(registerSpy.mock.invocationCallOrder[0]);
        expect([...formStore.inputs.keys()]).toEqual(['new-input-id']);
    });

    it('컴포넌트 언마운트 시 폼 스토어에서 해제되어야 한다', () => {
        // given
        const wrapper = mount(TestComponent);

        // when
        wrapper.unmount();

        // then
        expect(formStore.inputs.has('test-input-id')).toBe(false);
    });
});
