<template>
    <progress
        :class="['vs-progress', colorSchemeClass]"
        :style="componentStyleSet"
        :value="computedValue"
        :max="computedMax"
    />
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsProgressStyleSet } from './types';

const name = VsComponent.VsProgress;
export default defineComponent({
    name: name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsProgressStyleSet>(),
        max: { type: [Number, String], default: 100 },
        value: { type: [Number, String], default: 0 },
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const { componentStyleSet } = useStyleSet<VsProgressStyleSet>(name, styleSet);
        const { value, max } = toRefs(props);

        const computedValue = computed(() => {
            return Number(value.value);
        });

        const computedMax = computed(() => {
            return Number(max.value);
        });

        return {
            colorSchemeClass,
            componentStyleSet,
            computedValue,
            computedMax,
        };
    },
});
</script>

<style src="./VsProgress.css" />
