<template>
    <button
        ref="buttonRef"
        :type="type"
        :class="['vs-button', colorSchemeClass, classObj]"
        :style="styleSetVariables"
        :disabled="disabled"
        :tabindex="disabled || loading ? -1 : 0"
        :aria-label="ariaLabel"
    >
        <div v-if="loading" class="vs-button-loading">
            <vs-loading :color-scheme="colorScheme" :style-set="loadingStyleSet" />
        </div>
        <div class="vs-button-content">
            <slot />
        </div>
    </button>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, useTemplateRef, watch, type TemplateRef } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getButtonProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsButtonStyleSet } from './types';

import VsLoading from '@/components/vs-loading/VsLoading.vue';

const name = VsComponent.VsButton;
export default defineComponent({
    name,
    components: { VsLoading },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsButtonStyleSet>(),
        ...getButtonProps(),
    },
    setup(props) {
        const { colorScheme, styleSet, circle, disabled, ghost, large, loading, outline, primary, responsive, small } =
            toRefs(props);

        const buttonRef: TemplateRef<HTMLButtonElement> = useTemplateRef('buttonRef');

        const { colorSchemeClass } = useColorScheme(name, colorScheme);

        const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(name, styleSet);

        const classObj = computed(() => ({
            'vs-focusable': !disabled.value && !loading.value,
            'vs-circle': circle.value,
            'vs-disabled': disabled.value,
            'vs-ghost': ghost.value,
            'vs-large': large.value,
            'vs-loading': loading.value,
            'vs-outline': outline.value,
            'vs-primary': primary.value,
            'vs-responsive': responsive.value,
            'vs-small': small.value,
        }));

        const loadingStyleSet = computed(() => {
            return {
                width: '30%',
                height: '60%',
                ...componentStyleSet.value.loading,
            };
        });

        watch(loading, () => {
            // focus 상태일 때 loading이 true가 되어도 focus가 유지되는 버그 해결
            if (buttonRef.value && loading.value) {
                buttonRef.value.blur();
            }
        });

        return { colorSchemeClass, styleSetVariables, classObj, buttonRef, loadingStyleSet };
    },
});
</script>

<style src="./VsButton.css" />
