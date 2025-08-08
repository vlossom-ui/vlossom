<template>
    <component :is="tag" class="vs-grid" :style="computedStyleSet">
        <slot />
    </component>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { useStyleSet } from '@/composables';
import { getGridProps, getStyleSetProps } from '@/props';
import { stringUtil } from '@/utils';
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

        const { computedStyleSet } = useStyleSet(name, styleSet, {
            width: stringUtil.toStringSize(width.value),
            height: stringUtil.toStringSize(height.value),
            gridSize: Number(gridSize.value),
            columnGap: stringUtil.toStringSize(columnGap.value),
            rowGap: stringUtil.toStringSize(rowGap.value),
        });

        return {
            computedStyleSet,
        };
    },
});
</script>

<style src="./VsGrid.css" />
