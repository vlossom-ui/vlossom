<template>
    <vs-bar :tag :class="['vs-footer', colorSchemeClass, classObj]" :style-set="computedStyleSet">
        <slot />
    </vs-bar>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef, getCurrentInstance, inject, watchEffect } from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { VsComponent, LAYOUT_STORE_KEY, type BarLayout } from '@/declaration';
import { getColorSchemeProps, getPositionProps, getStyleSetProps } from '@/props';
import { objectUtil } from '@/utils';
import { LayoutStore } from '@/stores';
import type { VsFooterStyleSet } from './types';

import VsBar from '@/components/vs-bar/VsBar.vue';

const name = VsComponent.VsFooter;
export default defineComponent({
    name,
    components: { VsBar },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsFooterStyleSet>(),
        ...getPositionProps(),
        height: { type: String },
        primary: { type: Boolean, default: false },
        tag: { type: String, default: 'footer' },
    },
    setup(props) {
        const { colorScheme, styleSet, primary, position, height } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const additionalStyleSet: ComputedRef<Partial<VsFooterStyleSet>> = computed(() => {
            return objectUtil.shake({
                position: position.value ? position.value : undefined,
                height: height.value ? height.value : undefined,
            });
        });
        const { componentStyleSet } = useStyleSet<VsFooterStyleSet>(name, styleSet, additionalStyleSet);
        const computedStyleSet: ComputedRef<VsFooterStyleSet> = computed(() => {
            const isPositioned = position.value && ['absolute', 'fixed', 'sticky'].includes(position.value);
            return objectUtil.shake({
                ...componentStyleSet.value,
                bottom: (isPositioned && componentStyleSet.value.bottom) || 0,
                left: (isPositioned && componentStyleSet.value.left) || 0,
                height: componentStyleSet.value.height || '3rem',
                zIndex: componentStyleSet.value.zIndex || 'var(--vs-bar-z-index)',
            });
        });

        const classObj = computed(() => ({
            'vs-primary': primary.value,
        }));

        // only for vs-layout children
        const isLayoutChild = computed(() => getCurrentInstance()?.parent?.type.name === VsComponent.VsLayout);

        const layoutStore = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());
        watchEffect(() => {
            if (!isLayoutChild.value) {
                return;
            }
            const footerLayout: BarLayout = {
                position: computedStyleSet.value.position || 'relative',
                height: computedStyleSet.value.height || '3rem',
            };
            layoutStore.setFooter(footerLayout);
        });

        return { colorSchemeClass, computedStyleSet, classObj, isLayoutChild };
    },
});
</script>
