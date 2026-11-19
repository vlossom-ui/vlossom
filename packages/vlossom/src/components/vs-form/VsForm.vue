<template>
    <vs-grid class="vs-form" tag="form" :grid-size :column-gap :row-gap @submit="onSubmit">
        <slot />
    </vs-grid>
</template>

<script lang="ts">
import { computed, defineComponent, provide, toRefs, watch } from 'vue';
import { FORM_STORE_KEY, VsComponent } from '@/declaration';
import { getGridProps } from '@/props';
import { FormStore } from '@/stores';

import VsGrid from '@/components/vs-grid/VsGrid.vue';

const componentName = VsComponent.VsForm;
export default defineComponent({
    name: componentName,
    components: { VsGrid },
    props: {
        ...getGridProps(),
        disabled: { type: Boolean, default: false },
        nativeSubmit: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
    },
    emits: ['error'],
    // expose: ['valid', 'changed', 'validate', 'clear', 'reset'],
    setup(props, { emit }) {
        const { disabled, nativeSubmit, readonly } = toRefs(props);

        const formStore = FormStore.getDefaultFormStore();
        provide(FORM_STORE_KEY, formStore);

        const inputs = computed(() => [...formStore.inputs.values()]);
        const valid = computed(() => inputs.value.every((input) => input.valid.value));
        const changed = computed(() => inputs.value.some((input) => input.changed.value));

        async function validate() {
            const entries = [...formStore.inputs.entries()];
            const results = await Promise.all(entries.map(([, input]) => input.validate()));
            const invalidIds = entries.filter((_, index) => !results[index]).map(([id]) => id);
            if (invalidIds.length > 0) {
                // on error callback with invalid ids
                emit('error', invalidIds);
            }

            return invalidIds.length === 0;
        }

        function clear() {
            inputs.value.forEach((input) => input.clear());
        }

        function reset() {
            inputs.value.forEach((input) => input.reset());
        }

        function onSubmit(event: SubmitEvent) {
            if (!nativeSubmit.value) {
                event.preventDefault();
            }
        }

        watch(
            disabled,
            (value) => {
                formStore.setDisabled(value);
            },
            { immediate: true },
        );

        watch(
            readonly,
            (value) => {
                formStore.setReadonly(value);
            },
            { immediate: true },
        );

        return {
            valid,
            changed,
            validate,
            clear,
            reset,
            onSubmit,
        };
    },
});
</script>

<style src="./VsForm.css" />
