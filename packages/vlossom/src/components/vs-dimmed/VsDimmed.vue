<template>
    <Transition name="dimmed">
        <div
            v-if="isShow"
            class="vs-dimmed"
            :style="{ ...styleSetVariables, ...componentStyleSet.component }"
            aria-hidden="true"
        />
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
    // expose: ['show', 'hide'],
    setup(props, { emit }) {
        const { styleSet, modelValue } = toRefs(props);

        const isShow = ref(modelValue.value);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsDimmedStyleSet>(componentName, styleSet);

        function show() {
            isShow.value = true;
        }

        function hide() {
            isShow.value = false;
        }

        watch(modelValue, (value) => {
            isShow.value = value;
        });

        watch(isShow, (value) => {
            emit('update:modelValue', value);
        });

        return {
            isShow,
            componentStyleSet,
            styleSetVariables,
            show,
            hide,
        };
    },
});
</script>

<style src="./VsDimmed.css" />
