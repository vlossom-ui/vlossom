<template>
    <progress
        :class="['vs-progress', colorSchemeClass]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
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
import { logUtil, numberUtil } from '@/utils';
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

        const { styleSetVariables, componentInlineStyle } = useStyleSet<VsProgressStyleSet>(componentName, styleSet);

        const { value, max } = toRefs(props);

        const computedMax = computed(() => {
            const num = Number(max.value);

            if (isNaN(num)) {
                logUtil.warning(componentName, 'Max value should be a number');
            }

            return numberUtil.clamp(num, 1, Number.MAX_SAFE_INTEGER);
        });

        const computedValue = computed(() => {
            const num = Number(value.value);

            if (isNaN(num)) {
                logUtil.warning(componentName, 'Value should be a number');
            }

            if (num > computedMax.value || num < 0) {
                logUtil.warning(componentName, `Value should be in the range of 0 to ${computedMax.value}`);
            }

            return numberUtil.clamp(num, 0, computedMax.value);
        });

        return {
            colorSchemeClass,
            styleSetVariables,
            componentInlineStyle,
            computedValue,
            computedMax,
        };
    },
});
</script>

<style src="./VsProgress.css" />
