<template>
    <vs-button
        class="vs-toggle"
        type="button"
        :color-scheme="colorScheme"
        :style-set="componentStyleSet"
        :circle="circle"
        :disabled="disabled"
        :ghost="ghost"
        :large="large"
        :loading="loading"
        :outline="outline"
        :primary="primary"
        :responsive="responsive"
        :small="small"
        :aria-label="ariaLabel"
        @click.prevent.stop="toggleOnOff"
    >
        <slot />
    </vs-button>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, watch } from 'vue';
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
        const { colorScheme, styleSet, modelValue, disabled } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsToggleStyleSet>(name, styleSet);

        const isToggled = ref(modelValue.value);

        function toggleOnOff() {
            if (disabled.value) {
                return;
            }
            isToggled.value = !isToggled.value;
        }

        watch(modelValue, (o) => {
            isToggled.value = o;
        });

        watch(isToggled, (o) => {
            emit('update:modelValue', o);
            emit('toggle', o);
        });

        return {
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            toggleOnOff,
        };
    },
});
</script>
