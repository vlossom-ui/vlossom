<template>
    <div
        :class="['vs-toast', colorSchemeClass, { 'vs-toast-primary': primary }]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <slot />
        <vs-button
            class="vs-toast-close"
            :color-scheme="computedColorScheme"
            :primary
            :style-set="componentStyleSet.closeButton"
            ghost
            @click="$emit('close')"
        >
            <vs-render :content="closeIcon" class="size-5" />
        </vs-button>
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, onMounted, ref, toRefs, type ComputedRef } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { closeIcon } from '@/icons';
import type { VsToastStyleSet } from './types';

import VsRender from '@/components/vs-render/VsRender.vue';
import VsButton from '@/components/vs-button/VsButton.vue';

const componentName = VsComponent.VsToast;
export default defineComponent({
    name: componentName,
    components: { VsRender, VsButton },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsToastStyleSet>(),
        autoClose: { type: Boolean, default: true },
        primary: { type: Boolean, default: true },
        timeout: { type: Number, default: 5000 },
    },
    emits: ['close'],
    setup(props, { emit }) {
        const { colorScheme, styleSet, autoClose, timeout } = toRefs(props);

        const { computedColorScheme, colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<VsToastStyleSet> = computed(() => {
            return {
                closeButton: {
                    variables: {
                        padding: '0',
                    },
                },
            };
        });

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsToastStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        const holdToClose = ref(false);
        let timer: any = null;

        onMounted(() => {
            if (autoClose.value && timeout.value) {
                timer = setTimeout(() => {
                    if (!holdToClose.value) {
                        emitClose();
                    }
                    clearTimeout(timer);
                    timer = null;
                }, timeout.value);
            }
        });

        function onMouseEnter() {
            if (autoClose.value) {
                holdToClose.value = true;
            }
        }

        function onMouseLeave() {
            if (holdToClose.value && timer === null) {
                emitClose();
            }
            holdToClose.value = false;
        }

        function emitClose() {
            emit('close');
            holdToClose.value = false;
        }

        return {
            computedColorScheme,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            onMouseEnter,
            onMouseLeave,
            holdToClose,
            closeIcon,
        };
    },
});
</script>

<style src="./VsToast.css" />
