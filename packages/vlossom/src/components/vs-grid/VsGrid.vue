<template>
    <component :is="tag" class="vs-grid" :style="{ ...styleSetVariables, ...componentStyleSet.component }">
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import { VsComponent } from '@/declaration';
import { useStyleSet } from '@/composables';
import { getGridProps, getStyleSetProps } from '@/props';
import { stringUtil, objectUtil } from '@/utils';
import type { VsGridStyleSet } from './types';

const componentName = VsComponent.VsGrid;
export default defineComponent({
    name: componentName,
    props: {
        ...getGridProps(),
        ...getStyleSetProps<VsGridStyleSet>(),
        width: { type: [String, Number] },
        height: { type: [String, Number] },
        tag: { type: String, default: 'div' },
    },
    setup(props) {
        const { width, height, gridSize, columnGap, rowGap, styleSet } = toRefs(props);

        const baseStyleSet: ComputedRef<Partial<VsGridStyleSet>> = computed(() => ({}));
        const additionalStyleSet: ComputedRef<Partial<VsGridStyleSet>> = computed(() => {
            return objectUtil.shake({
                variables: objectUtil.shake({
                    gridSize: gridSize.value === undefined ? undefined : Number(gridSize.value),
                    columnGap: columnGap.value === undefined ? undefined : stringUtil.toStringSize(columnGap.value),
                    rowGap: rowGap.value === undefined ? undefined : stringUtil.toStringSize(rowGap.value),
                }),
                component: objectUtil.shake({
                    width: width.value === undefined ? undefined : stringUtil.toStringSize(width.value),
                    height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
                }),
            });
        });

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsGridStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        return {
            componentStyleSet,
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsGrid.css" />
