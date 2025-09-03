<template>
    <div :class="['vs-toggle']">
        <vs-button
            type="button"
            :color-scheme="colorScheme"
            :style-set="componentStyleSet"
            :circle="circle"
            :disabled="disabled"
            :ghost="ghost"
            :large="large"
            :outline="outline"
            :primary="primary"
            :responsive="responsive"
            :small="small"
            :aria-label="ariaLabel"
            @click="toggleOnOff"
        >
            <slot />
        </vs-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getButtonProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsToggleStyleSet } from './types';

import VsButton from '@/components/vs-button/VsButton.vue';

const name = VsComponent.VsToggle;

export default defineComponent({
    name,
    components: { VsButton },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsToggleStyleSet>(),
        ...getButtonProps(),

        // v-model
        modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'toggle'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, modelValue } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsToggleStyleSet>(name, styleSet);

        function toggleOnOff() {
            const nextValue = !modelValue.value;
            emit('update:modelValue', nextValue);
            emit('toggle', nextValue);
        }

        return {
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            toggleOnOff,
        };
    },
});
</script>

<style src="./VsToggle.css" />
