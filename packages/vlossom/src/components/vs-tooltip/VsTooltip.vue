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
            >
                <div v-if="isVisible" class="vs-tooltip-contents" :style="styleSetVariables" :class="animationClass">
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
        margin: { type: [String, Number], default: 5 },
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

        const triggerRef: Ref<HTMLElement | null> = ref(null);
        const tooltipRef: Ref<HTMLElement | null> = ref(null);

        const { appendOverlayDom } = useOverlayDom();

        const { isVisible, computedPlacement, appear, disappear } = usePositioning(
            triggerRef as Ref<HTMLElement>,
            tooltipRef as Ref<HTMLElement>,
        );

        const triggerOver = ref(false);
        const tooltipOver = ref(false);

        const computedShow = computed(() => {
            if (disabled.value) {
                return false;
            }
            return triggerOver.value || (contentsHover.value && tooltipOver.value);
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

        const { open, close } = useOverlay(id, computedCallbacks, escClose);

        watch(isVisible, (visible) => {
            if (visible) {
                open();
            } else {
                close();
            }
        });

        watch(computedShow, (show) => {
            if (show) {
                nextTick(() => {
                    appear({
                        placement: placement.value,
                        align: align.value,
                        margin:
                            typeof margin.value === 'string' ? Number(margin.value.replace('px', '')) : margin.value,
                    });
                });
            } else if (isVisible.value) {
                setTimeout(
                    () => {
                        disappear();
                    },
                    noAnimation.value ? 0 : 200, // for waiting animation end
                );
            }
        });

        const animationClass = computed(() => {
            if (noAnimation.value) {
                return null;
            }
            const direction = computedShow.value ? 'in' : 'out';
            return `fade-${direction}-${computedPlacement.value}`;
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
            if (!contentsHover.value) {
                return;
            }
            // 툴팁 영역에 마우스가 들어왔을 때 즉시 tooltipOver를 true로 설정
            tooltipOver.value = true;
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

        onBeforeUnmount(() => {
            disappear();
        });

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
        };
    },
});
</script>

<style src="./VsTooltip.css" />
