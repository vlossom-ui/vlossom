<template>
    <progress
        :class="['vs-progress', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
        :value="computedValue"
        :max="computedMax"
        :data-label="label"
    />
</template>

<script lang="ts">
import { computed, defineComponent, toRefs } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsProgressStyleSet } from './types';

const componentName = VsComponent.VsProgress;
export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsProgressStyleSet>(),
        max: {
            type: [Number, String],
            default: 1,
            validator: (value: number | string) => {
                const num = Number(value);
                return isFinite(num) && num > 0;
            },
        },
        value: {
            type: [Number, String],
            default: 0,
            validator: (value: number | string) => {
                const num = Number(value);
                return isFinite(num) && num >= 0;
            },
        },
        label: { type: String, default: '' },
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsProgressStyleSet>(componentName, styleSet);

        const { value, max } = toRefs(props);

        const computedMax = computed(() => {
            const num = Number(max.value);
            if (!isFinite(num) || num <= 0) {
                return 1;
            }

            return num;
        });

        const computedValue = computed(() => {
            const num = Number(value.value);
            if (!isFinite(num) || num < 0) {
                return 0;
            }
            if (num > computedMax.value) {
                return computedMax.value;
            }

            return num;
        });

        return {
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            computedValue,
            computedMax,
        };
    },
});
</script>

<style src="./VsProgress.css" />
