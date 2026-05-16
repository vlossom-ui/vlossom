<template>
    <vs-responsive
        :class="['vs-steps', colorSchemeClass, { 'vs-vertical': vertical }]"
        :style="{ ...styleSetVariables, ...componentInlineStyle }"
        :width
        :grid
    >
        <div class="vs-step-line" :style="trackStyleSet">
            <div class="vs-step-progress" :style="progressStyleSet" />
        </div>
        <ul
            role="tablist"
            :class="['vs-steps-list', { 'vs-steps-no-label': noLabel }]"
            :style="componentStyleSet.$steps"
        >
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
                <div class="vs-step-num" :style="getStepStyleSet(index)">
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
                <div v-if="!noLabel" class="vs-step-label" :style="getLabelStyleSet(index)">
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
    </vs-responsive>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    toRefs,
    ref,
    watch,
    type Ref,
    type PropType,
    type ComputedRef,
    type CSSProperties,
} from 'vue';
import { useColorScheme, useStyleSet, useIndexSelector } from '@/composables';
import { getResponsiveProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import { NOT_SELECTED, VsComponent } from '@/declaration';
import { objectUtil, stringUtil } from '@/utils';
import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';
import type { VsStepsStyleSet } from './types';

const componentName = VsComponent.VsSteps;
export default defineComponent({
    name: componentName,
    components: { VsResponsive },
    props: {
        ...getResponsiveProps(),
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsStepsStyleSet>(),
        disabled: {
            type: [Boolean, Function] as PropType<boolean | ((step: string, index: number) => boolean)>,
            default: false,
        },
        height: { type: [String, Number] },
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
        const { colorScheme, styleSet, height, disabled, steps, modelValue, vertical } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<VsStepsStyleSet> = computed(() => ({}));

        const additionalStyleSet: ComputedRef<Partial<VsStepsStyleSet>> = computed(() => {
            return objectUtil.shake({
                height: height.value === undefined ? undefined : stringUtil.toStringSize(height.value),
            });
        });

        const { componentStyleSet, styleSetVariables, componentInlineStyle } = useStyleSet<VsStepsStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const stepRefs: Ref<HTMLElement[]> = ref([]);
        const gapCount = computed(() => steps.value.length - 1);

        const {
            selectedIndex,
            isSelected,
            isDisabled,
            isPrevious,
            findActiveIndexForwardFrom,
            selectIndex: selectStep,
            handleKeydown,
        } = useIndexSelector(steps, disabled);

        const trackStyleSet: ComputedRef<CSSProperties> = computed(() => {
            const { $active, ...base } = componentStyleSet.value.$progress ?? {};
            return base;
        });

        const progressStyleSet: ComputedRef<CSSProperties> = computed(() => {
            const dimensionKey = vertical.value ? 'height' : 'width';
            if (gapCount.value === 0) {
                return { [dimensionKey]: '0%' };
            }

            const percentage = selectedIndex.value === NOT_SELECTED ? 0 : (selectedIndex.value / gapCount.value) * 100;
            return {
                ...componentStyleSet.value.$progress?.$active,
                [dimensionKey]: `${percentage}%`,
            };
        });

        function getStepStyleSet(index: number): CSSProperties {
            const { $completed = {}, $active = {}, ...base } = componentStyleSet.value.$step ?? {};
            if (isPrevious(index)) {
                return objectUtil.assign(base, $completed);
            }
            if (isSelected(index)) {
                return objectUtil.assign(base, $active);
            }
            return base;
        }

        function getLabelStyleSet(index: number): CSSProperties {
            const { $completed = {}, $active = {}, ...base } = componentStyleSet.value.$label ?? {};
            if (isPrevious(index)) {
                return objectUtil.assign(base, $completed);
            }
            if (isSelected(index)) {
                return objectUtil.assign(base, $active);
            }
            return base;
        }

        watch(steps, () => {
            selectedIndex.value = steps.value.length > 0 ? 0 : NOT_SELECTED;
        });

        watch(selectedIndex, (index: number) => {
            stepRefs.value[index]?.focus();
            emit('update:modelValue', index);
            emit('change', index);
        });

        watch(
            modelValue,
            (value) => {
                if (value < 0 || value >= steps.value.length) {
                    selectedIndex.value = NOT_SELECTED;
                } else {
                    selectedIndex.value = value;
                }
            },
            { immediate: true },
        );

        return {
            // Style
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            componentInlineStyle,
            trackStyleSet,
            progressStyleSet,
            getStepStyleSet,
            getLabelStyleSet,

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
