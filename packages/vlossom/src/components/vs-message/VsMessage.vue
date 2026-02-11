<template>
    <div :class="['vs-message', colorClass, sizeClass]">
        <i class="vs-message-icon">
            <vs-render :content="icon" />
        </i>
        <span class="vs-message-text">{{ text }}</span>
    </div>
</template>

<script lang="ts">
import { type PropType, computed, defineComponent, toRefs } from 'vue';
import { VsComponent, type UIState, type Size } from '@/declaration';
import { messageIcons } from './icons';
import { getStyleSetProps } from '@/props';
import { useStyleSet } from '@/composables';
import type { VsMessageStyleSet } from './types';

import VsRender from '@/components/vs-render/VsRender.vue';

const componentName = VsComponent.VsMessage;
export default defineComponent({
    name: componentName,
    components: { VsRender },
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
                    return 'vs-color-scheme-blue';
                case 'success':
                    return 'vs-color-scheme-green';
                case 'warning':
                    return 'vs-color-scheme-amber';
                case 'error':
                    return 'vs-color-scheme-red';
                default:
                    return 'vs-color-scheme-default';
            }
        });

        const { componentStyleSet } = useStyleSet(componentName, styleSet);

        const messageSize = computed((): Size => {
            if (componentStyleSet.value?.size) {
                return componentStyleSet.value.size;
            }

            return 'sm';
        });

        const sizeClass = computed(() => (messageSize.value ? `vs-${messageSize.value}` : ''));

        const icon = computed(() => {
            return messageIcons[state.value];
        });

        return { colorClass, icon, sizeClass };
    },
});
</script>

<style src="./VsMessage.css" />
