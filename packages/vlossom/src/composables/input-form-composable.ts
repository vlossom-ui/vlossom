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
    const formStore = inject<FormStore>(
        FORM_STORE_KEY,
        FormStore.getDefaultFormStore(), // for no provide error
    );

    watch(changed, () => {
        formStore.updateChanged(id.value, changed.value);
    });

    watch(valid, () => {
        formStore.updateValid(id.value, valid.value);
    });

    watch(formStore.validateFlag, validate);

    watch(formStore.clearFlag, clear);

    onMounted(() => {
        formStore.updateChanged(id.value, changed.value);
        formStore.updateValid(id.value, valid.value);
    });

    watch(id, (newId, oldId) => {
        formStore.removeFromForm(oldId);
        formStore.updateChanged(newId, changed.value);
        formStore.updateValid(newId, valid.value);
    });

    onBeforeUnmount(() => {
        formStore.removeFromForm(id.value);
    });

    return {
        formDisabled: formStore.disabled,
        formReadonly: formStore.readonly,
    };
}
