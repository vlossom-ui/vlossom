<template>
    <component :is="tag" class="vs-grid" :style="computedStyle">
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef, type CSSProperties } from 'vue';
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

        const baseStyleSet: ComputedRef<VsGridStyleSet> = computed(() => ({}));
        const additionalStyleSet: ComputedRef<Partial<VsGridStyleSet>> = computed(() => {
            return objectUtil.shake({
                variables: objectUtil.shake({
                    gridSize: gridSize.value === undefined ? undefined : Number(gridSize.value),
                    columnGap: columnGap.value === undefined ? undefined : stringUtil.toStringSize(columnGap.value),
                    rowGap: rowGap.value === undefined ? undefined : stringUtil.toStringSize(rowGap.value),
                }),
            });
        });

        const { styleSetVariables } = useStyleSet<VsGridStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const computedStyle = computed((): CSSProperties => {
            return {
                ...styleSetVariables.value,
                width: width.value === undefined ? undefined : stringUtil.toStringSize(width.value),
                height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
            };
        });

        return {
            computedStyle,
        };
    },
});
</script>

<style src="./VsGrid.css" />
