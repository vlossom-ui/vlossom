<template>
    <progress :value="value" :max="max" :class="['vs-progress', colorSchemeClass]" :style="componentStyleSet" />
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
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
        max: { type: Number, default: 100 },
        value: { type: Number, default: 0 },
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const { componentStyleSet } = useStyleSet<VsProgressStyleSet>(name, styleSet);

        return {
            colorSchemeClass,
            componentStyleSet,
        };
    },
});
</script>

<style src="./VsProgress.css" />
