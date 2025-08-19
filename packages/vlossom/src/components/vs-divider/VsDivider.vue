<template>
    <div :class="['vs-divider', colorSchemeClass, classObj]" :style="styleSetVariables" />
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { VsComponent } from '@/declaration';

import type { VsDividerStyleSet } from './types';

const name = VsComponent.VsDivider;
export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsDividerStyleSet>(),
        responsive: { type: Boolean, default: false },
        vertical: { type: Boolean, default: false /* horizontal */ },
    },
    setup(props) {
        const { colorScheme, styleSet, responsive, vertical } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { styleSetVariables } = useStyleSet<VsDividerStyleSet>(name, styleSet);

        const classObj = computed(() => ({
            'vs-horizontal': !vertical.value,
            'vs-vertical': vertical.value,
            'vs-divider-responsive': responsive.value,
        }));

        return {
            colorSchemeClass,
            styleSetVariables,
            classObj,
        };
    },
});
</script>

<style src="./VsDivider.css" scoped />
