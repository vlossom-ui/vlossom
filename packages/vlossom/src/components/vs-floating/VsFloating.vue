<template>
    <Teleport :to="overlayId" v-if="isVisible">
        <div ref="floatingRef" :class="['vs-floating', animationClass]" :style="floatingStyle">
            <slot :placement="computedPlacement" />
        </div>
    </Teleport>
</template>

<script lang="ts">
import {
    defineComponent,
    toRefs,
    useTemplateRef,
    computed,
    watch,
    ref,
    onBeforeMount,
    onBeforeUnmount,
    type PropType,
    type TemplateRef,
} from 'vue';
import { usePositioning, useOverlayDom, type FloatingTarget } from '@/composables';
import { VsComponent } from '@/declaration';
import { getFloatingProps } from '@/props';

const componentName = VsComponent.VsFloating;
export default defineComponent({
    name: componentName,
    props: {
        ...getFloatingProps(),
        target: { type: [String, Object] as PropType<FloatingTarget>, default: null },
        followWidth: { type: Boolean, default: false },
        overlayId: { type: String, default: '#vs-floating-overlay' },

        // v-model
        modelValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const {
            target,
            placement,
            align,
            modelValue,
            overlayId,
            margin,
            followWidth,
            noAnimation,
            disabled,
            enterDelay,
            leaveDelay,
        } = toRefs(props);

        const floatingRef: TemplateRef<HTMLElement> = useTemplateRef('floatingRef');

        const { appendOverlayDom } = useOverlayDom();

        const { isVisible, computedPlacement, appear, disappear } = usePositioning(() => target.value, floatingRef);

        const isFloated = ref(false);
        let timer: any = null;

        const animationClass = computed(() => {
            if (noAnimation.value) {
                return null;
            }
            const direction = isFloated.value ? 'in' : 'out';
            const placementValue = computedPlacement.value || placement.value;
            const resultPlacement = placementValue === 'middle' ? 'bottom' : placementValue;
            return `fade-${direction}-${resultPlacement}`;
        });

        const floatingStyle = computed(() => {
            return isFloated.value ? {} : { animationDelay: `${leaveDelay.value}ms` };
        });

        function cleanUpTimer() {
            if (timer) {
                clearTimeout(timer);
                timer = null;
            }
        }

        function showFloating() {
            cleanUpTimer();

            isFloated.value = true;

            timer = setTimeout(() => {
                appear({
                    placement: placement.value,
                    align: align.value,
                    margin: Number(margin.value),
                    followWidth: followWidth.value,
                });
                timer = null;
            }, Number(enterDelay.value));
        }

        function hideFloating() {
            cleanUpTimer();

            isFloated.value = false;

            // + 250ms wait for the fade out animation.
            const delay = noAnimation.value ? 0 : Number(leaveDelay.value) + 250;
            timer = setTimeout(() => {
                disappear();
                timer = null;
            }, delay);
        }

        watch([modelValue, disabled], ([show, isDisabled]) => {
            if (isDisabled) {
                hideFloating();
                return;
            }

            if (show) {
                showFloating();
            } else {
                hideFloating();
            }
        });

        watch(isVisible, (visible) => {
            emit('update:modelValue', visible);
        });

        onBeforeMount(() => {
            appendOverlayDom(document.body, overlayId.value, { zIndex: 10000 });
        });

        onBeforeUnmount(() => {
            cleanUpTimer();
            hideFloating();
        });

        return {
            floatingRef,
            computedPlacement,
            isVisible,
            isFloated,
            animationClass,
            floatingStyle,
        };
    },
});
</script>

<style src="./VsFloating.css" />
