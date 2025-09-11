<template>
    <vs-toggle
        :v-model="isDarkTheme"
        class="vs-theme-button"
        :style="styleSetVariables"
        :color-scheme="colorScheme"
        :style-set="componentStyleSet"
        :aria-label="`Switch to ${isDarkTheme ? 'light' : 'dark'} mode`"
        @toggle="changeTheme"
    >
        <i class="vs-theme-icon vs-theme-light" :class="{ 'vs-on': !isDarkTheme }" v-html="themeLightIcon" />
        <i class="vs-theme-icon vs-theme-dark" :class="{ 'vs-on': isDarkTheme }" v-html="themeDarkIcon" />
    </vs-toggle>
</template>

<script lang="ts">
import { defineComponent, toRefs, type Ref, computed } from 'vue';
import { useVlossom } from '@/framework';
import { VsComponent, themeDarkIcon, themeLightIcon } from '@/declaration';
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
        const $vs = useVlossom();

        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsThemeButtonStyleSet>(name, styleSet);

        const isDarkTheme: Ref<boolean> = computed(() => $vs.theme === 'dark');

        function changeTheme(isDark: boolean) {
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
