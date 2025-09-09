<template>
    <vs-toggle
        v-model="isDarkTheme"
        :circle="true"
        :disabled="disabled"
        :ghost="ghost"
        :large="large"
        :outline="outline"
        :primary="primary"
        :responsive="responsive"
        :small="small"
        :color-scheme="colorScheme"
        :style-set="componentStyleSet"
        @toggle="changeTheme"
    >
        {{ isDarkTheme }}
    </vs-toggle>
</template>

<script lang="ts">
import { defineComponent, toRefs, ref, type Ref } from 'vue';
import { useVlossom } from '@/framework';
import { VsComponent } from '@/declaration';
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
        const { colorScheme, styleSet } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsThemeButtonStyleSet>(name, styleSet);

        const vlossom = useVlossom();

        const isDarkTheme: Ref<boolean> = ref(vlossom.theme === 'dark');

        function changeTheme(event: MouseEvent) {
            vlossom.toggleTheme();
            emit('change', event);
        }

        return { changeTheme, isDarkTheme, colorSchemeClass, componentStyleSet, styleSetVariables };
    },
});
</script>

<style src="./VsThemeButton.css" />

<!-- 다른 버튼에 대해서 갱신이 안되고 있음, vsToggle을 사용하여야 하는가 의문이 들기 시작 -->
<!-- 아이콘이 크기별로 노출이 안됨 -->
<!-- 어떤 스타일까지 허용하는 컴퍼넌트가 되어야 할지 잘모르겠음 -->
<!-- 다크모드에서 폰트 색상 변경 필요함 -->
