<template>
    <vs-toggle
        :model-value="isDarkTheme"
        class="vs-theme-button"
        :color-scheme
        :style-set="componentStyleSet"
        :style="styleSetVariables"
        :aria-label="isDarkTheme ? optionMessages.VS_ARIA_THEME_BUTTON_LIGHT : optionMessages.VS_ARIA_THEME_BUTTON_DARK"
        :disabled="disabled"
        :loading="loading"
        @toggle="changeTheme"
    >
        <SunIcon class="vs-theme-icon vs-theme-light" :class="{ 'vs-on': !isDarkTheme }" fill="currentColor" />
        <MoonIcon class="vs-theme-icon vs-theme-dark" :class="{ 'vs-on': isDarkTheme }" fill="currentColor" />
    </vs-toggle>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { useVlossom } from '@/framework';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps, getButtonProps } from '@/props';
import { useColorScheme, useMessages, useStyleSet } from '@/composables';
import type { VsThemeButtonStyleSet } from './types';

import { MoonIcon, SunIcon } from '@lucide/vue';
import VsToggle from '@/components/vs-toggle/VsToggle.vue';

const componentName = VsComponent.VsThemeButton;
export default defineComponent({
    name: componentName,
    components: { VsToggle, MoonIcon, SunIcon },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsThemeButtonStyleSet>(),
        ...getButtonProps(),
    },
    emits: ['change'],
    setup(props, { emit }) {
        const $vs = useVlossom();
        const { optionMessages } = useMessages();
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsThemeButtonStyleSet>(componentName, styleSet);

        const isDarkTheme = computed(() => $vs.theme === 'dark');

        function changeTheme(isDark: boolean) {
            if (isDarkTheme.value === isDark) {
                return;
            }

            $vs.toggleTheme();
            emit('change', isDark);
        }

        return {
            changeTheme,
            isDarkTheme,
            optionMessages,
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
        };
    },
});
</script>

<style src="./VsThemeButton.css" />
