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
        width: { type: [String, Number], default: '100%' },
        height: { type: [String, Number], default: '100%' },
        tag: { type: String, default: 'div' },
    },
    setup(props) {
        const { width, height, gridSize, columnGap, rowGap, styleSet } = toRefs(props);

        const additionalStyleSet = computed(() => {
            return objectUtil.shake({
                width: width.value ? stringUtil.toStringSize(width.value) : undefined,
                height: height.value ? stringUtil.toStringSize(height.value) : undefined,
                gridSize: gridSize.value ? Number(gridSize.value) : undefined,
                columnGap: columnGap.value ? stringUtil.toStringSize(columnGap.value) : undefined,
                rowGap: rowGap.value ? stringUtil.toStringSize(rowGap.value) : undefined,
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
