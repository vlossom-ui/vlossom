<template>
    <component
        :is="tag"
        :class="['vs-bar', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
    >
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { VsComponent } from '@/declaration';
import { objectUtil } from '@/utils';
import { getColorSchemeProps, getPositionProps, getStyleSetProps } from '@/props';
import type { VsBarStyleSet } from './types';

const componentName = VsComponent.VsBar;
export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsBarStyleSet>(),
        ...getPositionProps(),
        primary: { type: Boolean, default: false },
        tag: { type: String, default: 'div' },
    },
    setup(props) {
        const { colorScheme, styleSet, primary, position } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
        const baseStyleSet: ComputedRef<Partial<VsBarStyleSet>> = computed(() => ({}));
        const additionalStyleSet: ComputedRef<Partial<VsBarStyleSet>> = computed(() => {
            return objectUtil.shake({
                component: objectUtil.shake({
                    position: position.value || undefined,
                }),
            });
        });
        const { componentStyleSet, styleSetVariables } = useStyleSet<VsBarStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const classObj = computed(() => ({
            'vs-primary': primary.value,
        }));

        return { colorSchemeClass, componentStyleSet, styleSetVariables, classObj };
    },
});
</script>

<style src="./VsBar.css" />
