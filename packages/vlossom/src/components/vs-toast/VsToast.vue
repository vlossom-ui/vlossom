<template>
    <div
        :class="['vs-toast', colorSchemeClass, { 'vs-toast-primary': primary }]"
        :style="styleSetVariables"
        @mouseenter="onMouseEnter"
        @mouseleave="onMouseLeave"
    >
        <slot />
        <vs-button class="vs-toast-close" :color-scheme="computedColorScheme" ghost @click="$emit('close')">
            <vs-render :content="'X'" />
        </vs-button>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref, toRefs } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsToastStyleSet } from './types';

import VsRender from '@/components/vs-render/VsRender.vue';
import VsButton from '@/components/vs-button/VsButton.vue';

const name = VsComponent.VsToast;
export default defineComponent({
    name,
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

        const { computedColorScheme, colorSchemeClass } = useColorScheme(name, colorScheme);

        const { styleSetVariables } = useStyleSet<VsToastStyleSet>(name, styleSet);

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
            styleSetVariables,
            onMouseEnter,
            onMouseLeave,
            holdToClose,
        };
    },
});
</script>

<style src="./VsToast.css" />
