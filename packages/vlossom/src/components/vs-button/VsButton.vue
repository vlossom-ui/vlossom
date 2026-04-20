<template>
    <button
        ref="buttonRef"
        :type="type"
        :class="['vs-button', colorSchemeClass, classObj]"
        :style="{ ...styleSetVariables, ...componentStyleSet.component }"
        :disabled
        :tabindex="disabled || loading ? -1 : 0"
    >
        <div v-if="loading" class="vs-button-loading">
            <vs-loading :color-scheme :style-set="componentStyleSet.loading" />
        </div>
        <div class="vs-button-content">
            <slot />
        </div>
    </button>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, useTemplateRef, watch, type ComputedRef, type TemplateRef } from 'vue';
import { VsComponent } from '@/declaration';
import { useColorScheme, useStyleSet } from '@/composables';
import { getButtonProps, getColorSchemeProps, getStyleSetProps } from '@/props';
import type { VsButtonStyleSet } from './types';

import VsLoading from '@/components/vs-loading/VsLoading.vue';

const componentName = VsComponent.VsButton;
export default defineComponent({
    name: componentName,
    components: { VsLoading },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsButtonStyleSet>(),
        ...getButtonProps(),
    },
    setup(props) {
        const { colorScheme, styleSet, circle, disabled, ghost, loading, outline, primary, responsive, size } =
            toRefs(props);

        const buttonRef: TemplateRef<HTMLButtonElement> = useTemplateRef('buttonRef');

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const baseStyleSet: ComputedRef<VsButtonStyleSet> = computed(() => {
            return {
                loading: {
                    variables: {
                        color: primary.value ? 'var(--vs-cs-font-primary)' : undefined,
                    },
                    component: {
                        width: '30%',
                        height: '60%',
                    },
                },
            };
        });
        const { componentStyleSet, styleSetVariables } = useStyleSet<VsButtonStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
        );

        const sizeClass = computed(() => `vs-${size.value}`);

        const classObj = computed(() => ({
            'vs-focus-visible': !disabled.value && !loading.value,
            'vs-circle': circle.value,
            'vs-disabled': disabled.value,
            'vs-ghost': ghost.value,
            'vs-loading-state': loading.value,
            'vs-outline': outline.value,
            'vs-primary': primary.value,
            'vs-responsive': responsive.value,
            [sizeClass.value]: !!sizeClass.value,
        }));

        watch(loading, () => {
            // focus 상태일 때 loading이 true가 되어도 focus가 유지되는 버그 해결
            if (buttonRef.value && loading.value) {
                buttonRef.value.blur();
            }
        });

        return { colorSchemeClass, styleSetVariables, classObj, buttonRef, componentStyleSet };
    },
});
</script>

<style src="./VsButton.css" />
