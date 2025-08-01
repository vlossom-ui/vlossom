<template>
    <button :type :class="['vs-button', colorSchemeClass]">
        <slot />
    </button>
</template>

<script lang="ts">
import { defineComponent, toRefs, type PropType } from 'vue';
import { VsComponent } from '@/declaration';
import { getStyleProps } from '@/props';
import { useColorScheme } from '@/composables';

const name = VsComponent.VsButton;

export default defineComponent({
    name,
    props: {
        ...getStyleProps(),
        type: {
            type: String as PropType<'button' | 'submit' | 'reset'>,
            default: 'button',
        },
    },
    setup(props) {
        const { colorScheme } = toRefs(props);
        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        return { colorSchemeClass };
    },
});
</script>

<style src="./VsButton.css" />
