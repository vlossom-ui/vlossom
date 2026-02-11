<template>
    <vs-responsive
        :class="['vs-input-wrapper', { 'shake-horizontal': needToShake }]"
        :width
        :grid
        :style="componentStyleSet.component"
    >
        <component :is="groupLabel ? 'fieldset' : 'div'">
            <component
                :is="groupLabel ? 'legend' : 'div'"
                v-if="!noLabel && (!!label || !!$slots.label)"
                class="vs-label"
                :class="{ 'vs-disabled': disabled }"
                :style="componentStyleSet.label"
            >
                <slot name="label">
                    <span>{{ label }}</span>
                </slot>
                <i v-if="required" class="vs-required-star vs-color-scheme-red">*</i>
            </component>

            <slot />
        </component>

        <div
            v-if="(!noMessages && messages.length > 0) || !!$slots.messages"
            :class="['vs-messages', { 'vs-disabled': disabled }]"
            :style="componentStyleSet.messages"
        >
            <slot name="messages">
                <vs-message
                    v-for="({ state, text }, index) in messages"
                    :key="`${text}-${index}`"
                    :state
                    :text
                    :style-set="componentStyleSet.message"
                />
            </slot>
        </div>
    </vs-responsive>
</template>

<script lang="ts">
import { defineComponent, ref, toRefs, watch, type PropType } from 'vue';
import { VsComponent, type StateMessage, type UIState } from '@/declaration';
import { getInputWrapperProps, getResponsiveProps, getStyleSetProps } from '@/props';
import { useStyleSet } from '@/composables';
import type { VsInputWrapperStyleSet } from './types';

import VsResponsive from '@/components/vs-responsive/VsResponsive.vue';
import VsMessage from '@/components/vs-message/VsMessage.vue';

const componentName = VsComponent.VsInputWrapper;
export default defineComponent({
    name: componentName,
    components: { VsResponsive, VsMessage },
    props: {
        ...getResponsiveProps(),
        ...getInputWrapperProps(),
        ...getStyleSetProps<VsInputWrapperStyleSet>(),
        groupLabel: { type: Boolean, default: false },
        messages: {
            type: Array as PropType<StateMessage<UIState>[]>,
            default: () => [],
        },
        shake: { type: Boolean, default: false },
    },
    setup(props) {
        const { shake, styleSet } = toRefs(props);

        const { componentStyleSet } = useStyleSet(componentName, styleSet);

        const needToShake = ref(false);
        watch(shake, () => {
            needToShake.value = true;
            setTimeout(() => {
                needToShake.value = false;
            }, 600);
        });

        return { needToShake, componentStyleSet };
    },
});
</script>

<style src="./VsInputWrapper.css" />
