<template>
    <div :class="['vs-message', colorClass]" :style="{ ...styleSetVariables, ...componentInlineStyle }">
        <component :is="icon" class="vs-message-icon" />
        <span class="vs-message-text">{{ text }}</span>
    </div>
</template>

<script lang="ts">
import { type Component, type PropType, computed, defineComponent, toRefs } from 'vue';
import { VsComponent, type UIState } from '@/declaration';
import { getStyleSetProps } from '@/props';
import { useStyleSet } from '@/composables';
import type { VsMessageStyleSet } from './types';

import { CircleAlertIcon, CircleCheckIcon, InfoIcon, MessageSquareIcon, TriangleAlertIcon } from '@lucide/vue';

const componentName = VsComponent.VsMessage;
export default defineComponent({
    name: componentName,
    props: {
        ...getStyleSetProps<VsMessageStyleSet>(),
        state: {
            type: String as PropType<UIState>,
            default: 'idle',
        },
        text: { type: String, default: '' },
    },
    setup(props) {
        const { state, styleSet } = toRefs(props);

        const colorClass = computed(() => {
            switch (state.value) {
                case 'info':
                    return 'vs-cs-blue';
                case 'success':
                    return 'vs-cs-green';
                case 'warning':
                    return 'vs-cs-amber';
                case 'error':
                    return 'vs-cs-red';
                default:
                    return 'vs-cs-default';
            }
        });

        const { styleSetVariables, componentInlineStyle } = useStyleSet(componentName, styleSet);

        const icon = computed<Component>(() => {
            const iconMap: Record<UIState, Component> = {
                idle: MessageSquareIcon,
                info: InfoIcon,
                success: CircleCheckIcon,
                warning: TriangleAlertIcon,
                error: CircleAlertIcon,
            };

            return iconMap[state.value];
        });

        return { colorClass, icon, styleSetVariables, componentInlineStyle };
    },
});
</script>

<style src="./VsMessage.css" />
