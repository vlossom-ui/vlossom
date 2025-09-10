import { type Ref, inject, onMounted, onBeforeUnmount, watch } from 'vue';
import { FORM_STORE_KEY } from '@/declaration';
import { FormStore } from '@/stores';

export function useInputForm(
    id: Ref<string>,
    valid: Ref<boolean>,
    changed: Ref<boolean>,
    validate: () => boolean,
    clear: () => void,
) {
    const { disabled, readonly, validateFlag, clearFlag, updateChanged, updateValid, removeFromForm } =
        inject<FormStore>(
            FORM_STORE_KEY,
            FormStore.getDefaultFormStore(), // for no provide error
        );

    watch(changed, () => {
        updateChanged(id.value, changed.value);
    });

    watch(valid, () => {
        updateValid(id.value, valid.value);
    });

    watch(validateFlag, validate);

    watch(clearFlag, clear);

    onMounted(() => {
        updateChanged(id.value, changed.value);
        updateValid(id.value, valid.value);
    });

    watch(id, (newId, oldId) => {
        removeFromForm(oldId);
        updateChanged(newId, changed.value);
        updateValid(newId, valid.value);
    });

    onBeforeUnmount(() => {
        removeFromForm(id.value);
    });

    return {
        formDisabled: disabled,
        formReadonly: readonly,
    };
}
