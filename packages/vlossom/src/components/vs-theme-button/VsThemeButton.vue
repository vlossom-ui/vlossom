<template>
    <vs-toggle
        :model-value="isDarkTheme"
        class="vs-theme-button"
        :color-scheme="colorScheme"
        :style="styleSetVariables"
        :style-set="componentStyleSet"
        :aria-label="`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`"
        :disabled="disabled"
        :loading="loading"
        @toggle="changeTheme"
    >
        <i class="vs-theme-icon vs-theme-light" :class="{ 'vs-on': !isDarkTheme }" v-html="themeLightIcon" />
        <i class="vs-theme-icon vs-theme-dark" :class="{ 'vs-on': isDarkTheme }" v-html="themeDarkIcon" />
    </vs-toggle>
</template>

<script lang="ts">
import { defineComponent, toRefs, type Ref, computed } from 'vue';
import { useVlossom } from '@/framework';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps, getButtonProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsThemeButtonStyleSet } from './types';
import { themeDarkIcon, themeLightIcon } from './icons';

import VsToggle from '@/components/vs-toggle/VsToggle.vue';

const componentName = VsComponent.VsThemeButton;
export default defineComponent({
    name: componentName,
    components: { VsToggle },
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
        const isDarkTheme: Ref<boolean> = computed(() => $vs.theme === 'dark');

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
            themeDarkIcon,
            themeLightIcon,
        };
    },
});
</script>

<style src="./VsThemeButton.css" />
