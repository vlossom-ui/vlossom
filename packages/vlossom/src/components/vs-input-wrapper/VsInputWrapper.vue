<template>
    <vs-responsive :class="['vs-input-wrapper', { 'shake-horizontal': needToShake, 'vs-small': small }]" :width :grid>
        <component :is="groupLabel ? 'fieldset' : 'div'" v-if="!noLabel">
            <component :is="groupLabel ? 'legend' : 'div'" class="vs-label">
                <slot name="label">
                    <span :class="{ 'vs-disabled': disabled }">{{ label }}</span>
                </slot>
                <i v-if="required" :class="['vs-required-star', 'vs-color-scheme-red', { 'vs-disabled': disabled }]">
                    *
                </i>
            </component>

            <slot />
        </component>

        <div class="vs-messages" v-if="!noMessages && messages.length > 0">
            <slot name="messages">
                <vs-message
                    v-for="({ state, text }, index) in messages"
                    :key="`${text}-${index}`"
                    :state
                    :text
                    :size="small ? '0.8rem' : '0.9rem'"
                />
            </slot>
        </div>
    </vs-responsive>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, type PropType } from 'vue';
import { VsComponent, type StateMessage, type UIState } from '@/declaration';
import { getInputWrapperProps, getResponsiveProps } from '@/props';
import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';
import VsMessage from '@/components/vs-message/VsMessage.vue';

const name = VsComponent.VsInputWrapper;

export default defineComponent({
    name,
    components: { VsResponsive, VsMessage },
    props: {
        ...getResponsiveProps(),
        ...getInputWrapperProps(),
        groupLabel: { type: Boolean, default: false },
        messages: {
            type: Array as PropType<StateMessage<Exclude<UIState, 'selected'>>[]>,
            default: () => [],
        },
        shake: { type: Boolean, default: false },
    },
    setup(props) {
        const { shake } = toRefs(props);

        const needToShake = ref(false);
        watch(shake, () => {
            needToShake.value = true;
            setTimeout(() => {
                needToShake.value = false;
            }, 600);
        });

        return { needToShake };
    },
});
</script>

<style src="./VsInputWrapper.css" />
