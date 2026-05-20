<template>
    <vs-toggle
        :model-value="isDarkTheme"
        class="vs-theme-button"
        :color-scheme
        :style-set="componentStyleSet"
        :style="styleSetVariables"
        :aria-label="`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`"
        :disabled="disabled"
        :loading="loading"
        @toggle="changeTheme"
    >
        <i class="vs-theme-icon vs-theme-light" :class="{ 'vs-on': !isDarkTheme }">
            <vs-render :content="SunIcon" :size="20" fill="currentColor" />
        </i>
        <i class="vs-theme-icon vs-theme-dark" :class="{ 'vs-on': isDarkTheme }">
            <vs-render :content="MoonIcon" :size="20" fill="currentColor" />
        </i>
    </vs-toggle>
</template>

<script lang="ts">
import { defineComponent, toRefs, computed } from 'vue';
import { useVlossom } from '@/framework';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps, getButtonProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsThemeButtonStyleSet } from './types';

import { MoonIcon, SunIcon } from '@lucide/vue';
import VsRender from '@/components/vs-render/VsRender.vue';
import VsToggle from '@/components/vs-toggle/VsToggle.vue';

const componentName = VsComponent.VsThemeButton;
export default defineComponent({
    name: componentName,
    components: { VsToggle, VsRender },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsThemeButtonStyleSet>(),
        ...getButtonProps(),
    },
    emits: ['change'],
    setup(props, { emit }) {
        const $vs = useVlossom();
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
            colorSchemeClass,
            componentStyleSet,
            styleSetVariables,
            SunIcon,
            MoonIcon,
        };
    },
});
</script>

<style src="./VsThemeButton.css" />
