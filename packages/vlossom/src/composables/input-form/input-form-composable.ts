import { type Ref, inject, onMounted, onBeforeUnmount, watch } from 'vue';
import { FORM_STORE_KEY, type FormInputEntry } from '@/declaration';
import { FormStore } from '@/stores';

export function useInputForm(
    id: Ref<string>,
    valid: Ref<boolean>,
    changed: Ref<boolean>,
    validate: () => Promise<boolean>,
    clear: () => void,
    reset: () => void,
) {
    const formStore = inject<FormStore>(
        FORM_STORE_KEY,
        FormStore.getDefaultFormStore(), // for no provide error
    );

    const entry: FormInputEntry = { valid, changed, validate, clear, reset };

    onMounted(() => {
        formStore.register(id.value, entry);
    });

    watch(id, (newId, oldId) => {
        formStore.unregister(oldId);
        formStore.register(newId, entry);
    });

    onBeforeUnmount(() => {
        formStore.unregister(id.value);
    });

    return {
        formDisabled: formStore.disabled,
        formReadonly: formStore.readonly,
    };
}
