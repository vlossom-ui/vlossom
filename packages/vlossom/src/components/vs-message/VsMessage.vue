<template>
    <div :class="['vs-message', colorClass]" :style="{ ...componentStyleSet.component, ...styleSetVariables }">
        <i class="vs-message-icon">
            <vs-render :content="icon" />
        </i>
        <span class="vs-message-text">{{ text }}</span>
    </div>
</template>

<script lang="ts">
import { type PropType, computed, defineComponent, toRefs } from 'vue';
import { VsComponent, type UIState } from '@/declaration';
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

        const { componentStyleSet, styleSetVariables } = useStyleSet(componentName, styleSet);

        const icon = computed(() => {
            return messageIcons[state.value];
        });

        return { colorClass, icon, componentStyleSet, styleSetVariables };
    },
});
</script>

<style src="./VsMessage.css" />
