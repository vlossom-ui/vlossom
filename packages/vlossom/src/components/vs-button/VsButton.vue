<template>
    <button :type :class="['vs-button', colorSchemeClass]" :style="styleSetVariables">
        <slot />
    </button>
</template>

<script lang="ts">
import { defineComponent, toRefs, type PropType } from 'vue';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsButtonStyleSet } from './types';

const name = VsComponent.VsButton;

export default defineComponent({
    name,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsButtonStyleSet>(),
        type: {
            type: String as PropType<'button' | 'submit' | 'reset'>,
            default: 'button',
        },
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { styleSetVariables } = useStyleSet(name, styleSet);

        return { colorSchemeClass, styleSetVariables };
    },
});
</script>

<style src="./VsButton.css" />
