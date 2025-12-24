<template>
    <vs-floating
        v-model="computedShow"
        :target
        :placement
        :align
        :margin
        :no-animation
        :disabled
        :enter-delay
        :leave-delay
    >
        <template #default="{ placement: computedPlacement }">
            <div
                :class="['vs-tooltip', colorSchemeClass, `vs-placement-${computedPlacement}`, `vs-align-${align}`]"
                :style="tooltipStyle"
                @mouseenter.stop="onTooltipEnter"
                @mouseleave.stop="onTooltipLeave"
            >
                <div class="vs-tooltip-contents">
                    <slot />
                </div>
            </div>
        </template>
    </vs-floating>
</template>

<script lang="ts">
import {
    defineComponent,
    toRefs,
    ref,
    computed,
    watch,
    onMounted,
    onBeforeUnmount,
    type ComputedRef,
    type WritableComputedRef,
} from 'vue';
import { useColorScheme, useStyleSet, useOverlayCallback } from '@/composables';
import { VsComponent, type OverlayCallbacks } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps, getFloatingProps } from '@/props';
import { stringUtil } from '@/utils';
import type { VsTooltipStyleSet } from './types';

import VsFloating from '@/components/vs-floating/VsFloating.vue';

const componentName = VsComponent.VsTooltip;
export default defineComponent({
    name: componentName,
    components: { VsFloating },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTooltipStyleSet>(),
        ...getFloatingProps({ placement: 'top', align: 'center', margin: 10 }),
        clickable: { type: Boolean, default: false },
        contentsHover: { type: Boolean, default: false },
        escClose: { type: Boolean, default: true },
    },
    setup(props) {
        const { colorScheme, styleSet, target, clickable, contentsHover, escClose } = toRefs(props);

        const id = ref(stringUtil.createID());
        const triggerOver = ref(false);
        const tooltipOver = ref(false);
        const isMovingOut = ref(false);
        const isClickOpened = ref(false);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { styleSetVariables } = useStyleSet<VsTooltipStyleSet>(componentName, styleSet);

        const computedShow: WritableComputedRef<boolean> = computed({
            get() {
                // 1. basic tooltip
                if (!clickable.value && !contentsHover.value) {
                    return triggerOver.value;
                }

                // 2. clickable only
                if (clickable.value && !contentsHover.value) {
                    return triggerOver.value && isClickOpened.value;
                }

                // 3. contentsHover only
                if (!clickable.value && contentsHover.value) {
                    return triggerOver.value || tooltipOver.value || isMovingOut.value;
                }

                // 4. clickable and contentsHover
                if (clickable.value && contentsHover.value) {
                    return (triggerOver.value || tooltipOver.value || isMovingOut.value) && isClickOpened.value;
                }

                return false;
            },
            set(value: boolean) {
                if (value) {
                    activate();
                } else {
                    deactivate();
                    tooltipOver.value = false;
                }
            },
        });

        const tooltipStyle = computed(() => {
            return { ...styleSetVariables.value };
        });

        const computedCallbacks: ComputedRef<OverlayCallbacks> = computed(() => {
            if (!escClose.value) {
                return {} as OverlayCallbacks;
            }
            return {
                'key-Escape': (event: KeyboardEvent) => {
                    event.preventDefault();
                    event.stopPropagation();

                    if (clickable.value) {
                        isClickOpened.value = false;
                    } else {
                        tooltipOver.value = false;
                        triggerOver.value = false;
                    }

                    deactivate();
                },
            };
        });

        const { activate, deactivate } = useOverlayCallback(id, computedCallbacks);

        watch(computedShow, (show) => {
            if (show) {
                activate();
            } else {
                deactivate();
                tooltipOver.value = false;
            }
        });

        watch(isMovingOut, () => {
            if (isMovingOut.value) {
                setTimeout(() => {
                    isMovingOut.value = false;
                }, 100);
            }
        });

        watch([triggerOver, tooltipOver, isMovingOut], () => {
            if (!triggerOver.value && !tooltipOver.value && !isMovingOut.value) {
                isClickOpened.value = false;
            }
        });

        function onTriggerEnter() {
            triggerOver.value = true;
        }

        function onTriggerLeave() {
            if (contentsHover.value) {
                isMovingOut.value = true;
            }
            triggerOver.value = false;
        }

        function onTriggerClick() {
            if (!clickable.value) {
                return;
            }

            isClickOpened.value = !isClickOpened.value;
        }

        function onTooltipEnter() {
            tooltipOver.value = true;
        }

        function onTooltipLeave() {
            if (contentsHover.value) {
                isMovingOut.value = true;
            }
            tooltipOver.value = false;
        }

        function addTargetEventListeners() {
            const targetElement = document.querySelector(target.value);
            if (!targetElement) {
                return;
            }

            targetElement.addEventListener('mouseenter', onTriggerEnter);
            targetElement.addEventListener('mouseleave', onTriggerLeave);
            targetElement.addEventListener('click', onTriggerClick);
            targetElement.addEventListener('focusin', onTriggerEnter);
            targetElement.addEventListener('focusout', onTriggerLeave);
        }

        function removeTargetEventListeners() {
            const targetElement = document.querySelector(target.value);
            if (!targetElement) {
                return;
            }

            targetElement.removeEventListener('mouseenter', onTriggerEnter);
            targetElement.removeEventListener('mouseleave', onTriggerLeave);
            targetElement.removeEventListener('click', onTriggerClick);
            targetElement.removeEventListener('focusin', onTriggerEnter);
            targetElement.removeEventListener('focusout', onTriggerLeave);
        }

        onMounted(() => {
            addTargetEventListeners();
        });

        onBeforeUnmount(() => {
            removeTargetEventListeners();
        });

        return {
            colorSchemeClass,
            styleSetVariables,
            computedShow,
            onTooltipEnter,
            onTooltipLeave,
            tooltipStyle,
        };
    },
});
</script>

<style src="./VsTooltip.css" />
