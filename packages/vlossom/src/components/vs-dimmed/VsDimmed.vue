<template>
    <Transition name="dimmed">
        <div v-if="show" class="vs-dimmed" :style="styleSetVariables" aria-hidden="true" />
    </Transition>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch } from 'vue';
import { useStyleSet } from '@/composables';
import { getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';

import type { VsDimmedStyleSet } from './types';

const componentName = VsComponent.VsDimmed;
export default defineComponent({
    name: componentName,
    props: {
        ...getStyleSetProps<VsDimmedStyleSet>(),

        // v-model
        modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const { styleSet, modelValue } = toRefs(props);

        const show = ref(modelValue.value);

        const { styleSetVariables } = useStyleSet<VsDimmedStyleSet>(componentName, styleSet);

        watch(modelValue, (value) => {
            show.value = value;
        });

        watch(show, (value) => {
            emit('update:modelValue', value);
        });

        return {
            show,
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsDimmed.css" />
