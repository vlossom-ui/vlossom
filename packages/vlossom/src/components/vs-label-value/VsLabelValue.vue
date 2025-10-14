<template>
    <vs-responsive
        :class="['vs-label-value', colorSchemeClass, classObj]"
        :style="{ ...componentStyleSet, ...styleSetVariables }"
        :width="width"
        :grid="grid"
    >
        <div v-if="$slots['label']" class="vs-cell vs-label">
            <slot name="label" />
        </div>
        <div v-if="$slots.default" class="vs-cell vs-value">
            <slot />
        </div>
    </vs-responsive>
</template>
<script lang="ts">
import { type PropType, computed, defineComponent, toRefs } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { getResponsiveProps } from '@/props';
import { VsComponent, type ColorScheme } from '@/declaration';
import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';

import type { VsLabelValueStyleSet } from './types';

const name = VsComponent.VsLabelValue;
export default defineComponent({
    name,
    components: { VsResponsive },
    props: {
        ...getResponsiveProps(),
        colorScheme: { type: String as PropType<ColorScheme> },
        styleSet: { type: [String, Object] as PropType<string | VsLabelValueStyleSet> },
        dense: { type: Boolean, default: false },
        primary: { type: Boolean, default: false },
    },
    setup(props) {
        const { colorScheme, styleSet, dense, primary } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsLabelValueStyleSet>(name, styleSet);

        const classObj = computed(() => ({
            'vs-dense': dense.value,
            'vs-primary': primary.value,
        }));

        return {
            classObj,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
        };
    },
});
</script>

<style lang="scss" src="./VsLabelValue.css" />
