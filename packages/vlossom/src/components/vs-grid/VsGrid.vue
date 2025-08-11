<template>
    <component :is="tag" class="vs-grid" :style="styleSetVariables">
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { useStyleSet } from '@/composables';
import { getGridProps, getStyleSetProps } from '@/props';
import { stringUtil, objectUtil } from '@/utils';
import type { VsGridStyleSet } from './types';

const name = VsComponent.VsGrid;
export default defineComponent({
    name,
    props: {
        ...getGridProps(),
        ...getStyleSetProps<VsGridStyleSet>(),
        width: { type: [String, Number] },
        height: { type: [String, Number] },
        tag: { type: String, default: 'div' },
    },
    setup(props) {
        const { width, height, gridSize, columnGap, rowGap, styleSet } = toRefs(props);

        const additionalStyleSet = computed(() => {
            return objectUtil.shake({
                width: width.value === undefined ? undefined : stringUtil.toStringSize(width.value),
                height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
                gridSize: gridSize.value === undefined ? undefined : Number(gridSize.value),
                columnGap: columnGap.value === undefined ? undefined : stringUtil.toStringSize(columnGap.value),
                rowGap: rowGap.value === undefined ? undefined : stringUtil.toStringSize(rowGap.value),
            });
        });

        const { styleSetVariables } = useStyleSet(name, styleSet, additionalStyleSet);

        return {
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsGrid.css" />
