<template>
    <div class="vs-page" :style="componentStyleSet.component">
        <div v-if="$slots['title']" class="vs-page-title" :style="componentStyleSet.title">
            <slot name="title" />
        </div>
        <div v-if="$slots['description']" class="vs-page-description" :style="componentStyleSet.description">
            <slot name="description" />
        </div>

        <div class="vs-page-content" :style="componentStyleSet.content">
            <slot />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
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

        const { componentStyleSet } = useStyleSet<VsPageStyleSet>(componentName, styleSet);

        return {
            componentStyleSet,
        };
    },
});
</script>

<style src="./VsPage.css" />
