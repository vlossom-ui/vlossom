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
    let validateSpy: ReturnType<typeof vi.fn<() => boolean>>;
    let clearSpy: ReturnType<typeof vi.fn<() => void>>;
    let TestComponent: ReturnType<typeof defineComponent>;

    beforeEach(() => {
        formStore = new FormStore();
        vi.spyOn(FormStore, 'getDefaultFormStore').mockImplementation(() => formStore);
        id = ref('test-input-id');
        valid = ref(true);
        changed = ref(false);
        validateSpy = vi.fn();
        clearSpy = vi.fn();
        TestComponent = defineComponent({
            setup() {
                const result = useInputForm(id, valid, changed, validateSpy, clearSpy);
                return { result };
            },
            template: '<div></div>',
        });
    });

    it('changed 값이 변경되면 updateChanged가 호출되어야 한다', async () => {
        // given
        const updateChangedSpy = vi.spyOn(formStore, 'updateChanged');

        mount(TestComponent);

        await nextTick();

        // when
        changed.value = true;
        await nextTick();

        // then
        expect(updateChangedSpy).toHaveBeenCalledWith('test-input-id', true);
    });

    it('valid 값이 변경되면 updateValid가 호출되어야 한다', async () => {
        // given
        const updateValidSpy = vi.spyOn(formStore, 'updateValid');

        mount(TestComponent);

        await nextTick();

        // when
        valid.value = false;
        await nextTick();

        // then
        expect(updateValidSpy).toHaveBeenCalledWith('test-input-id', false);
    });

    it('validateFlag가 토글되면 validate 함수가 호출되어야 한다', async () => {
        // given
        mount(TestComponent);

        await nextTick();

        // when
        formStore.toggleValidateFlag();
        await nextTick();

        // then
        expect(validateSpy).toHaveBeenCalled();
    });

    it('clearFlag가 토글되면 clear 함수가 호출되어야 한다', async () => {
        // given
        mount(TestComponent);

        await nextTick();

        // when
        formStore.toggleClearFlag();
        await nextTick();

        // then
        expect(clearSpy).toHaveBeenCalled();
    });

    it('컴포넌트 마운트 시 초기값으로 updateChanged와 updateValid가 호출되어야 한다', async () => {
        // given
        const updateChangedSpy = vi.spyOn(formStore, 'updateChanged');
        const updateValidSpy = vi.spyOn(formStore, 'updateValid');

        // when
        mount(TestComponent);

        await nextTick();

        // then
        expect(updateChangedSpy).toHaveBeenCalledWith('test-input-id', false);
        expect(updateValidSpy).toHaveBeenCalledWith('test-input-id', true);
    });

    it('컴포넌트 언마운트 시 removeFromForm이 호출되어야 한다', async () => {
        // given
        const removeFromFormSpy = vi.spyOn(formStore, 'removeFromForm');

        const wrapper = mount(TestComponent);

        await nextTick();

        // when
        wrapper.unmount();

        // then
        expect(removeFromFormSpy).toHaveBeenCalledWith('test-input-id');
    });
});
