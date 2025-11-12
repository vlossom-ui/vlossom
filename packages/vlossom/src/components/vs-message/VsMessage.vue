<template>
    <div :class="['vs-message', colorClass]">
        <i :style="{ width: sizeValue, height: sizeValue, 'flex-shrink': 0 }">
            <vs-render :content="icon" />
        </i>
        <span class="vs-message-text" :style="{ fontSize: sizeValue }">{{ text }}</span>
    </div>
</template>

<script lang="ts">
import { type PropType, computed, defineComponent, toRefs } from 'vue';
import { VsComponent, type UIState } from '@/declaration';
import { stringUtil } from '@/utils';
import { messageIcons } from './icons';

import VsRender from '@/components/vs-render/VsRender.vue';

const name = VsComponent.VsMessage;
export default defineComponent({
    name,
    components: { VsRender },
    props: {
        size: { type: [String, Number], default: '1rem' },
        state: {
            type: String as PropType<UIState>,
            default: 'idle',
        },
        text: { type: String, default: '' },
    },
    setup(props) {
        const { state, size } = toRefs(props);

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

        const sizeValue = computed(() => {
            return stringUtil.toStringSize(size.value);
        });

        const icon = computed(() => {
            return messageIcons[state.value];
        });

        return { colorClass, icon, sizeValue };
    },
});
</script>

<style src="./VsMessage.css" />
