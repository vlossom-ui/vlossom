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

                if (!isFinite(num) || num <= 0) {
                    logUtil.warning(componentName, 'Max value should be a finite number and greater than 0');
                }

                return isFinite(num) && num > 0;
            },
        },
        value: {
            type: [Number, String],
            default: 0,
            validator: (value: number | string) => {
                const num = Number(value);

                if (!isFinite(num) || num < 0) {
                    logUtil.warning(componentName, 'Value should be a finite number and greater than or equal to 0');
                }

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

            return numberUtil.clamp(num, 1, Number.MAX_SAFE_INTEGER);
        });

        const computedValue = computed(() => {
            const num = Number(value.value);

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
