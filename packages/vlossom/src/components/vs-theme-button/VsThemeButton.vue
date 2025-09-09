<template>
    <vs-toggle
        :model-value="isDarkTheme"
        class="vs-theme-button"
        :style="styleSetVariables"
        :color-scheme="colorScheme"
        :style-set="toggleStyleSet"
        :aria-label="`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`"
        @toggle="changeTheme"
    >
        <i class="vs-theme-icon vs-theme-light" :class="{ 'vs-on': !isDarkTheme }" v-html="iconSvgs.themeLight" />
        <i class="vs-theme-icon vs-theme-dark" :class="{ 'vs-on': isDarkTheme }" v-html="iconSvgs.themeDark" />
    </vs-toggle>
</template>

<script lang="ts">
import { defineComponent, toRefs, type Ref, computed } from 'vue';
import { useVlossom } from '@/framework';
import { VsComponent, iconSvgs } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps, getButtonProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsThemeButtonStyleSet } from './types';

import VsToggle from '@/components/vs-toggle/VsToggle.vue';

const name = VsComponent.VsThemeButton;

export default defineComponent({
    name,
    components: { VsToggle },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsThemeButtonStyleSet>(),
        ...getButtonProps(),
    },
    emits: ['change'],
    setup(props, { emit }) {
        const vlossom = useVlossom();

        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsThemeButtonStyleSet>(name, styleSet);

        const toggleStyleSet = computed(() => ({
            ...componentStyleSet.value.toggle,
            borderRadius: '50%',
            height: '3rem',
            width: '3rem',
        }));

        const isDarkTheme: Ref<boolean> = computed(() => vlossom.theme === 'dark');

        function changeTheme(isDark: boolean) {
            vlossom.toggleTheme();
            emit('change', isDark);
        }

        return { changeTheme, isDarkTheme, colorSchemeClass, toggleStyleSet, styleSetVariables, iconSvgs };
    },
});
</script>

<style src="./VsThemeButton.css" />
