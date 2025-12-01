<template>
    <div :class="['vs-tooltip', colorSchemeClass]">
        <div
            ref="triggerRef"
            class="vs-tooltip-trigger"
            tabindex="0"
            @mouseenter.stop="onTriggerEnter"
            @mouseleave.stop="onTriggerLeave"
            @click.prevent.stop="onTriggerClick"
            @focusin.stop="onTriggerEnter"
            @focusout.stop="onTriggerLeave"
        >
            <slot />
        </div>

        <Teleport :to="tooltipOverlayId" v-if="isVisible">
            <div
                ref="tooltipRef"
                :class="['vs-tooltip-wrap', colorSchemeClass, `vs-placement-${computedPlacement}`, `vs-align-${align}`]"
                :style="tooltipPadding"
                @mouseenter.stop="onTooltipEnter"
                @mouseleave.stop="onTooltipLeave"
            >
                <div class="vs-tooltip-contents" :style="tooltipStyle" :class="animationClass">
                    <slot name="tooltip" />
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script lang="ts">
import {
    defineComponent,
    toRefs,
    ref,
    computed,
    watch,
    onBeforeUnmount,
    onBeforeMount,
    type PropType,
    type Ref,
    type ComputedRef,
} from 'vue';
import { useColorScheme, useStyleSet, useOverlay, useOverlayDom, usePositioning } from '@/composables';
import { VsComponent, type Placement, type Alignment, type OverlayCallbacks } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { stringUtil } from '@/utils';
import type { VsTooltipStyleSet } from './types';

const name = VsComponent.VsTooltip;
export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTooltipStyleSet>(),
        align: {
            type: String as PropType<Alignment>,
            default: 'center',
        },
        clickable: { type: Boolean, default: false },
        contentsHover: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        enterDelay: { type: Number, default: 0 },
        escClose: { type: Boolean, default: true },
        leaveDelay: { type: Number, default: 0 },
        margin: { type: [String, Number], default: '0.5rem' },
        noAnimation: { type: Boolean, default: false },
        placement: {
            type: String as PropType<Exclude<Placement, 'middle'>>,
            default: 'top',
        },
    },
    setup(props) {
        const {
            colorScheme,
            styleSet,
            align,
            placement,
            clickable,
            contentsHover,
            disabled,
            noAnimation,
            enterDelay,
            leaveDelay,
            margin,
            escClose,
        } = toRefs(props);

        const id = ref(stringUtil.createID());
        const triggerOver = ref(false);
        const tooltipOver = ref(false);
        const isMovingOut = ref(false);
        const isClickOpened = ref(false);

        // setTimeout ID를 저장해서 취소할 수 있도록 함
        let timer: any = null;

        const triggerRef: Ref<HTMLElement | null> = ref(null);
        const tooltipRef: Ref<HTMLElement | null> = ref(null);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { styleSetVariables } = useStyleSet<VsTooltipStyleSet>(name, styleSet);

        const { appendOverlayDom } = useOverlayDom();

        const { isVisible, computedPlacement, appear, disappear } = usePositioning(
            triggerRef as Ref<HTMLElement>,
            tooltipRef as Ref<HTMLElement>,
        );

        const computedShow = computed(() => {
            if (disabled.value) {
                return false;
            }

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
        });

        const animationClass = computed(() => {
            if (noAnimation.value) {
                return null;
            }
            const direction = computedShow.value ? 'in' : 'out';
            return `fade-${direction}-${computedPlacement.value}`;
        });

        const tooltipStyle = computed(() => {
            const animationDelay = computedShow.value ? {} : { animationDelay: `${leaveDelay.value}ms` };
            return { ...styleSetVariables.value, ...animationDelay };
        });

        const tooltipPadding = computed(() => {
            const result: Record<string, string> = {};
            const paddingSize = stringUtil.toStringSize(margin.value);

            if (computedPlacement.value === 'top') {
                result.paddingBottom = paddingSize;
            } else if (computedPlacement.value === 'right') {
                result.paddingLeft = paddingSize;
            } else if (computedPlacement.value === 'bottom') {
                result.paddingTop = paddingSize;
            } else if (computedPlacement.value === 'left') {
                result.paddingRight = paddingSize;
            }

            return result;
        });

        const computedCallbacks: ComputedRef<OverlayCallbacks> = computed(() => {
            if (!escClose.value) {
                return {} as OverlayCallbacks;
            }
            return {
                'key-Escape': () => {
                    if (clickable.value) {
                        isClickOpened.value = false;
                    } else {
                        tooltipOver.value = false;
                        triggerOver.value = false;
                    }

                    unmountOverlay();
                },
            };
        });

        const { mountOverlay, unmountOverlay } = useOverlay(id, computedCallbacks);

        function showTooltip() {
            if (timer) {
                clearTimeout(timer);
            }

            timer = setTimeout(() => {
                mountOverlay();
                appear({
                    placement: placement.value,
                    align: align.value,
                });
                timer = null;
            }, enterDelay.value);
        }

        function hideTooltip() {
            if (timer) {
                clearTimeout(timer);
            }

            unmountOverlay();
            // + 250ms wait for the fade out animation.
            const delay = noAnimation.value ? 0 : leaveDelay.value + 250;
            timer = setTimeout(() => {
                disappear();
                timer = null;

                tooltipOver.value = false;
            }, delay);
        }

        watch(isMovingOut, () => {
            if (isMovingOut.value) {
                setTimeout(() => {
                    isMovingOut.value = false;
                }, 100);
            }
        });

        watch(computedShow, (show) => {
            if (show) {
                showTooltip();
            } else {
                hideTooltip();
            }
        });

        watch([triggerOver, tooltipOver], () => {
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

        const tooltipOverlayId = '#vs-tooltip-overlay';
        onBeforeMount(() => {
            appendOverlayDom(document.body, tooltipOverlayId, { zIndex: 10000 });
        });

        onBeforeUnmount(() => {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
            hideTooltip();
        });

        return {
            colorSchemeClass,
            styleSetVariables,
            animationClass,
            triggerRef,
            tooltipRef,
            computedPlacement,
            onTriggerEnter,
            onTriggerLeave,
            onTriggerClick,
            onTooltipEnter,
            onTooltipLeave,
            tooltipOverlayId,
            tooltipStyle,
            tooltipPadding,
            isVisible,
        };
    },
});
</script>

<style src="./VsTooltip.css" />
