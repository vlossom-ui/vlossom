<template>
    <div :class="['vs-bar', colorSchemeClass, classObj]" :style="styleSetVariables">
        <slot />
    </div>
</template>

<script lang="ts">
import { useColorScheme, useStyleSet } from '@/composables';
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import type { VsBarStyleSet } from './types';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getPositionProps, getStyleSetProps } from '@/props';

const name = VsComponent.VsBar;
export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsBarStyleSet>(),
        ...getPositionProps(),
        primary: { type: Boolean, default: false },
    },
    setup(props) {
        const { colorScheme, styleSet, primary, absolute, fixed, sticky, static: staticPosition } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const additionalStyleSet: ComputedRef<Partial<VsBarStyleSet>> = computed(() => {
            const resultSet: Partial<VsBarStyleSet> = {};
            if (absolute.value) {
                resultSet.position = 'absolute';
            }
            if (fixed.value) {
                resultSet.position = 'fixed';
            }
            if (sticky.value) {
                resultSet.position = 'sticky';
            }
            if (staticPosition.value) {
                resultSet.position = 'static';
            }
            return resultSet;
        });
        const { componentStyleSet, styleSetVariables } = useStyleSet<VsBarStyleSet>(name, styleSet, additionalStyleSet);

        const classObj = computed(() => ({
            'vs-primary': primary.value,
        }));

        return { colorSchemeClass, componentStyleSet, styleSetVariables, classObj };
    },
});
</script>

<style src="./VsBar.css" />
