<template>
    <div :class="['vs-tooltip', colorSchemeClass]">
        <div
            ref="triggerRef"
            class="vs-tooltip-trigger"
            @mouseenter.stop="onTriggerEnter"
            @mouseleave.stop="onTriggerLeave"
            @click.prevent.stop="onTriggerClick"
            @focusin.stop="onTriggerEnter"
            @focusout.stop="onTriggerLeave"
            tabindex="0"
            style="border: 2px solid red; background: yellow"
        >
            isVisible: {{ isVisible }}, computedShow: {{ computedShow }}, triggerOver: {{ triggerOver }}, tooltipOver:
            {{ tooltipOver }}
            <slot />
        </div>

        <Teleport :to="tooltipOverlayId" v-if="computedShow || isVisible">
            <div
                ref="tooltipRef"
                :class="['vs-tooltip-wrap', colorSchemeClass, `vs-placement-${computedPlacement}`, `vs-align-${align}`]"
                @mouseenter.stop="onTooltipEnter"
                @mouseleave.stop="onTooltipLeave"
                style="border: 2px solid red; background: yellow"
                :style="tooltipMargin"
            >
                <div class="vs-tooltip-contents" :style="styleSetVariables" :class="animationClass">
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
    nextTick,
    onBeforeUnmount,
    onBeforeMount,
    type PropType,
    type Ref,
} from 'vue';
import { useColorScheme, useStyleSet, useOverlay, useOverlayDom, usePositioning } from '@/composables';
import { VsComponent, type Placement, type Alignment } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps, getOverlayProps } from '@/props';

import type { VsTooltipStyleSet } from './types';
import { stringUtil } from '@/utils';

const name = VsComponent.VsTooltip;

export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsTooltipStyleSet>(),
        ...getOverlayProps(),
        align: {
            type: String as PropType<Alignment>,
            default: 'center',
        },
        clickable: { type: Boolean, default: false },
        contentsHover: { type: Boolean, default: false },
        disabled: { type: Boolean, default: false },
        enterDelay: { type: Number, default: 100 },
        escClose: { type: Boolean, default: true },
        leaveDelay: { type: Number, default: 100 },
        margin: { type: [String, Number], default: 50 },
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
            callbacks,
            id,
        } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { styleSetVariables } = useStyleSet<VsTooltipStyleSet>(name, styleSet);

        const triggerOver = ref(false);
        const tooltipOver = ref(false);

        const triggerRef: Ref<HTMLElement | null> = ref(null);
        const tooltipRef: Ref<HTMLElement | null> = ref(null);

        const { appendOverlayDom } = useOverlayDom();

        const { isVisible, computedPlacement, appear, disappear } = usePositioning(
            triggerRef as Ref<HTMLElement>,
            tooltipRef as Ref<HTMLElement>,
        );

        const computedShow = computed(() => {
            console.log(`triggerOver: ${triggerOver.value}, tooltipOver: ${tooltipOver.value}`);
            if (disabled.value) {
                return false;
            }
            return triggerOver.value || (contentsHover.value && tooltipOver.value);
        });

        const animationClass = computed(() => {
            if (noAnimation.value) {
                return null;
            }
            const direction = computedShow.value ? 'in' : 'out';
            return `fade-${direction}-${computedPlacement.value}`;
        });

        const computedCallbacks = computed(() => {
            return {
                ...callbacks.value,
                'key-Escape': () => {
                    callbacks.value['key-Escape']?.();
                    if (escClose.value) {
                        triggerOver.value = false;
                        tooltipOver.value = false;
                    }
                },
            };
        });

        const tooltipMargin = computed(() => {
            const paddingSize = stringUtil.toStringSize(margin.value);

            if (computedPlacement.value === 'top') {
                return { paddingBottom: paddingSize };
            } else if (computedPlacement.value === 'right') {
                return { paddingLeft: paddingSize };
            } else if (computedPlacement.value === 'bottom') {
                return { paddingTop: paddingSize };
            } else if (computedPlacement.value === 'left') {
                return { paddingRight: paddingSize };
            }
            return {};
        });

        const { open: openOverlay, close: closeOverlay } = useOverlay(id, computedCallbacks, escClose);

        function showTooltip() {
            openOverlay();
            nextTick(() => {
                appear({
                    placement: placement.value,
                    align: align.value,
                });
            });
        }

        function hideTooltip() {
            closeOverlay();
            setTimeout(disappear, noAnimation.value ? 0 : 400);
        }

        watch(computedShow, (show) => {
            if (show) {
                showTooltip();
            } else {
                hideTooltip();
            }
        });

        function onTriggerEnter() {
            if (clickable.value) {
                return;
            }

            setTimeout(() => {
                triggerOver.value = true;
            }, enterDelay.value);
        }

        function onTriggerLeave() {
            setTimeout(() => {
                triggerOver.value = false;
            }, leaveDelay.value);
        }

        function onTriggerClick() {
            if (!clickable.value) {
                return;
            }

            if (isVisible.value) {
                triggerOver.value = false;
            } else {
                triggerOver.value = true;
            }
        }

        function onTooltipEnter() {
            if (contentsHover.value) {
                tooltipOver.value = true;
            }
        }

        function onTooltipLeave() {
            if (!contentsHover.value) {
                return;
            }

            setTimeout(() => {
                tooltipOver.value = false;
            }, leaveDelay.value);
        }

        const tooltipOverlayId = '#vs-tooltip-overlay';
        onBeforeMount(() => {
            appendOverlayDom(document.body, tooltipOverlayId, { zIndex: 10000 });
        });

        onBeforeUnmount(hideTooltip);

        return {
            colorSchemeClass,
            styleSetVariables,
            animationClass,
            triggerRef,
            tooltipRef,
            isVisible,
            computedShow,
            computedPlacement,
            triggerOver,
            tooltipOver,
            onTriggerEnter,
            onTriggerLeave,
            onTriggerClick,
            onTooltipEnter,
            onTooltipLeave,
            tooltipOverlayId,
            tooltipMargin,
        };
    },
});
</script>

<style src="./VsTooltip.css" />
