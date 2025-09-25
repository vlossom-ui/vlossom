<template>
    <div class="vs-page" :style="styleSetVariables">
        <div v-if="$slots['title']" class="vs-page-title">
            <slot name="title" />
        </div>
        <div v-if="$slots['description']" class="vs-page-description">
            <slot name="description" />
        </div>
        <div class="vs-page-content">
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

const name = VsComponent.VsPage;

export default defineComponent({
    name,
    props: {
        ...getStyleSetProps<VsPageStyleSet>(),
    },
    setup(props) {
        const { styleSet } = toRefs(props);
        const { styleSetVariables } = useStyleSet<VsPageStyleSet>(name, styleSet);

        return {
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsPage.css" />
