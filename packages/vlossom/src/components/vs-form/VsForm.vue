<template>
    <vs-grid class="vs-form" tag="form" :grid-size :column-gap :row-gap>
        <slot />
    </vs-grid>
</template>

<script lang="ts">
import { computed, defineComponent, nextTick, provide, toRefs, watch } from 'vue';
import { FORM_STORE_KEY, VsComponent } from '@/declaration';
import VsGrid from '@/components/vs-grid/VsGrid.vue';
import { getGridProps } from '@/props';
import { FormStore } from '@/stores/form-store';

const name = VsComponent.VsForm;
export default defineComponent({
    name,
    components: { VsGrid },
    props: {
        ...getGridProps(),
        disabled: { type: Boolean, default: false },
        readonly: { type: Boolean, default: false },
    },
    emits: ['error'],
    // expose: ['valid', 'changed', 'validate', 'clear'],
    setup(props, { emit }) {
        const { disabled, readonly } = toRefs(props);

        const formStore = FormStore.getDefaultFormStore();
        provide(FORM_STORE_KEY, formStore);

        const valid = computed(() => Object.values(formStore.validObj.value).every((v) => v));
        const changed = computed(() => Object.values(formStore.changedObj.value).some((v) => v));

        async function validate() {
            formStore.toggleValidateFlag();
            await nextTick();

            if (!valid.value) {
                // on error callback with invalid labels
                const invalidIds = Object.keys(formStore.validObj.value).filter((id) => !formStore.validObj.value[id]);
                emit('error', invalidIds);
            }

            return valid.value;
        }

        function clear() {
            formStore.toggleClearFlag();
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
        };
    },
});
</script>

<style src="./VsForm.css" />
