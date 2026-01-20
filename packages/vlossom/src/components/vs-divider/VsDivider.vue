<template>
    <div
        :class="['vs-divider', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    />
</template>

<script lang="ts">
import { defineComponent, toRefs, computed, type ComputedRef } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';

import type { VsDividerStyleSet } from './types';

const componentName = VsComponent.VsDivider;
export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsDividerStyleSet>(),
        responsive: { type: Boolean, default: false },
        vertical: { type: Boolean, default: false /* horizontal */ },
    },
    setup(props) {
        const { colorScheme, styleSet, responsive, vertical } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<Partial<VsDividerStyleSet>> = computed(() => ({}));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsDividerStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        const classObj = computed(() => ({
            'vs-vertical': vertical.value,
            'vs-divider-responsive': responsive.value,
        }));

        return {
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            classObj,
        };
    },
});
</script>

<style src="./VsDivider.css" />
