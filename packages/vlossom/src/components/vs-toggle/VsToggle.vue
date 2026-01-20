<template>
    <vs-button
        class="vs-toggle"
        type="button"
        :color-scheme
        :style-set="componentStyleSet"
        :circle
        :disabled
        :ghost
        :loading
        :outline
        :primary
        :responsive
        :size
        @click.prevent.stop="toggle"
    >
        <slot />
    </vs-button>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, ref, watch, type ComputedRef } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getButtonProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsToggleStyleSet } from './types';

import VsButton from '@/components/vs-button/VsButton.vue';

const componentName = VsComponent.VsToggle;
export default defineComponent({
    name: componentName,
    components: { VsButton },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsToggleStyleSet>(),
        ...getButtonProps(),

        // v-model
        modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue', 'toggle'],
    // expose: ['toggle'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, modelValue, disabled } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<Partial<VsToggleStyleSet>> = computed(() => ({}));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsToggleStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        const isToggled = ref(modelValue.value);

        function toggle() {
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
            toggle,
        };
    },
});
</script>
