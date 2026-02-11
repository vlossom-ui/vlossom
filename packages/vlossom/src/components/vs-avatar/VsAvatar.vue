<template>
    <div :class="['vs-avatar', colorSchemeClass]" :style="{ ...styleSetVariables, ...componentStyleSet.component }">
        <slot />
    </div>
</template>

<script lang="ts">
import { defineComponent, toRefs } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps } from '@/props';
import { type VsAvatarStyleSet } from './types';

const componentName = VsComponent.VsAvatar;
export default defineComponent({
    name: componentName,
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsAvatarStyleSet>(),
    },
    setup(props) {
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsAvatarStyleSet>(componentName, styleSet);

        return {
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsAvatar.css" />
