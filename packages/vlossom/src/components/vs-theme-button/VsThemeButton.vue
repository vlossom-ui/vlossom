<template>
    <vs-toggle
        :v-model="isDarkTheme"
        class="vs-theme-button"
        :style="styleSetVariables"
        :color-scheme="colorScheme"
        :style-set="toggleStyleSet"
        :aria-label="`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`"
        @toggle="changeTheme"
    >
        <i class="vs-theme-icon vs-theme-light" :class="{ 'vs-on': !isDarkTheme }" v-html="themeIcon.light" />
        <i class="vs-theme-icon vs-theme-dark" :class="{ 'vs-on': isDarkTheme }" v-html="themeIcon.dark" />
    </vs-toggle>
</template>

<script lang="ts">
import { defineComponent, toRefs, type Ref, computed } from 'vue';
import { useVlossom } from '@/framework';
import { VsComponent } from '@/declaration';
import { getColorSchemeProps, getStyleSetProps, getButtonProps } from '@/props';
import { useColorScheme, useStyleSet } from '@/composables';
import type { VsThemeButtonStyleSet } from './types';

import VsToggle from '@/components/vs-toggle/VsToggle.vue';

const name = VsComponent.VsThemeButton;

const themeIcon = {
    light: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path
                    fill="currentColor"
                    d="M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z"
                />
            </svg>
    `,
    dark: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
                <path
                    fill="currentColor"
                    d="M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z"
                />
            </svg>
    `,
};

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

        return { changeTheme, isDarkTheme, colorSchemeClass, toggleStyleSet, styleSetVariables, themeIcon };
    },
});
</script>

<style src="./VsThemeButton.css" />
