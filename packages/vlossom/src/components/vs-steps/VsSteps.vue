<template>
    <vs-responsive :width :grid>
        <div :class="['vs-steps', colorSchemeClass, { 'vs-vertical': vertical }]" :style="styleSetVariables">
            <div class="vs-step-line">
                <div class="vs-step-progress" :style="progressWidth" />
            </div>
            <ul role="tablist" :class="['vs-steps-list', { 'vs-steps-no-label': noLabel }]">
                <li
                    v-for="(step, index) in steps"
                    ref="stepRefs"
                    class="vs-step-item"
                    :key="step"
                    :class="[
                        {
                            'vs-previous': isPrevious(index),
                            'vs-disabled': isDisabled(index),
                            'vs-selected': isSelected(index),
                        },
                    ]"
                    role="tab"
                    :tabindex="isSelected(index) ? 0 : -1"
                    @click.prevent.stop="selectStep(index)"
                    @keydown.stop="(e) => handleKeydown(e, vertical)"
                >
                    <div class="vs-step-num">
                        <slot
                            name="step"
                            :step
                            :index
                            :is-selected="isSelected(index)"
                            :is-previous="isPrevious(index)"
                            :is-disabled="isDisabled(index)"
                        >
                            {{ index + 1 }}
                        </slot>
                    </div>
                    <div v-if="!noLabel" class="vs-step-label">
                        <slot
                            name="label"
                            :step
                            :index
                            :is-selected="isSelected(index)"
                            :is-previous="isPrevious(index)"
                            :is-disabled="isDisabled(index)"
                        >
                            {{ step }}
                        </slot>
                    </div>
                </li>
            </ul>
        </div>
    </vs-responsive>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, ref, watch, type Ref, type PropType, type ComputedRef } from 'vue';
import { useColorScheme, useStyleSet, useIndexSelector } from '@/composables';
import { getResponsiveProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import { INVALID_INDEX, VsComponent } from '@/declaration';
import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';
import type { VsStepsStyleSet } from './types';
import { objectUtil } from '@/utils';

const name = VsComponent.VsSteps;
export default defineComponent({
    name,
    components: { VsResponsive },
    props: {
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsStepsStyleSet>(),
        height: { type: String },
        disabled: {
            type: [Boolean, Function] as PropType<boolean | ((step: string, index: number) => boolean)>,
            default: false,
        },
        gap: { type: [String, Number], default: '' },
        noLabel: { type: Boolean, default: false },
        steps: {
            type: Array as PropType<string[]>,
            default: () => [],
        },
        vertical: { type: Boolean, default: false },
        // v-model
        modelValue: { type: Number, default: 0 },
    },
    emits: ['update:modelValue', 'change'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, width, height, disabled, gap, steps, modelValue, vertical } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const gapCount = computed(() => steps.value.length - 1);

        const additionalStyleSet: ComputedRef<Partial<VsStepsStyleSet>> = computed(() => {
            return objectUtil.shake({
                height: height.value,
                width: width.value,
                gap: gap.value || '0',
                gapCount: gapCount.value,
            });
        });

        const { styleSetVariables } = useStyleSet<VsStepsStyleSet>(name, styleSet, additionalStyleSet);

        const stepRefs: Ref<HTMLElement[]> = ref([]);

        const {
            selectedIndex,
            isSelected,
            isDisabled,
            isPrevious,
            findActiveIndexForwardFrom,
            selectIndex: selectStep,
            handleKeydown,
        } = useIndexSelector(steps, disabled, modelValue);

        const progressWidth = computed(() => {
            const dimensionKey = vertical.value ? 'height' : 'width';
            if (gapCount.value === 0) {
                return { [dimensionKey]: '0%' };
            }

            const percentage = selectedIndex.value === INVALID_INDEX ? 0 : (selectedIndex.value / gapCount.value) * 100;
            return { [dimensionKey]: `${percentage}%` };
        });

        watch(steps, () => {
            selectStep(findActiveIndexForwardFrom(0));
        });

        watch(selectedIndex, (index: number) => {
            if (index === INVALID_INDEX) {
                return;
            }

            stepRefs.value[index]?.focus();
            emit('update:modelValue', index);
            emit('change', index);
        });

        watch(modelValue, selectStep);

        return {
            // Style
            colorSchemeClass,
            styleSetVariables,
            progressWidth,

            // Selection State
            selectedIndex,
            isPrevious,
            isSelected,
            isDisabled,

            // Actions
            selectStep,
            handleKeydown,

            // Refs
            stepRefs,
        };
    },
});
</script>

<style src="./VsSteps.css" />
