<template>
    <div class="vs-page" :style="{ ...styleSetVariables, ...componentStyleSet.component }">
        <div v-if="$slots['title']" class="vs-page-title">
            <slot name="title" />
        </div>
        <div v-if="$slots['description']" class="vs-page-description">
            <slot name="description" />
        </div>

        <slot />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef } from 'vue';
import { useStyleSet } from '@/composables';
import { VsComponent } from '@/declaration';
import { getStyleSetProps } from '@/props';
import type { VsPageStyleSet } from './types';

const componentName = VsComponent.VsPage;
export default defineComponent({
    name: componentName,
    props: {
        ...getStyleSetProps<VsPageStyleSet>(),
    },
    setup(props) {
        const { styleSet } = toRefs(props);

        const baseStyleSet: ComputedRef<Partial<VsPageStyleSet>> = computed(() => ({}));

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsPageStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        return {
            componentStyleSet,
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsPage.css" />
