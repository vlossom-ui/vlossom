<template>
    <component :is="tag" :class="['vs-bar', colorSchemeClass, classObj]" :style="styleSetVariables">
        <slot />
    </component>
</template>

<script lang="ts">
import { useColorScheme, useStyleSet } from '@/composables';
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import type { VsBarStyleSet } from './types';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getPositionProps, getStyleSetProps } from '@/props';
import { objectUtil } from '@/utils';

const name = VsComponent.VsBar;
export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsBarStyleSet>(),
        ...getPositionProps(),
        primary: { type: Boolean, default: false },
        tag: { type: String, default: 'div' },
    },
    setup(props) {
        const { colorScheme, styleSet, primary, position } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const additionalStyleSet: ComputedRef<Partial<VsBarStyleSet>> = computed(() => {
            return objectUtil.shake({
                position: position.value ? position.value : undefined,
            });
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
