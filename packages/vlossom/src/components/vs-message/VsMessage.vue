<template>
    <div :class="['vs-message', colorClass]">
        <i :style="{ width: size, height: size }">
            <vs-render :content="icon" />
        </i>
        <span class="vs-message-text" :style="{ fontSize: size }">{{ text }}</span>
    </div>
</template>

<script lang="ts">
import { type PropType, computed, defineComponent, toRefs } from 'vue';
import { VsComponent, type UIState } from '@/declaration';
import { stringUtil } from '@/utils';
import VsRender from '@/components/vs-render/VsRender.vue';
import { messageIcons } from './icons';

const name = VsComponent.VsMessage;

export default defineComponent({
    name,
    components: { VsRender },
    props: {
        fontSize: { type: [String, Number], default: '1rem' },
        state: {
            type: String as PropType<Exclude<UIState, 'selected'>>,
            default: 'idle',
        },
        text: { type: String, default: '' },
    },
    setup(props) {
        const { state, fontSize } = toRefs(props);

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

        const size = computed(() => {
            return stringUtil.toStringSize(fontSize.value);
        });

        const icon = computed(() => {
            return messageIcons[state.value] || messageIcons.idle;
        });

        return { colorClass, icon, size };
    },
});
</script>

<style lang="scss" src="./VsMessage.css" />
