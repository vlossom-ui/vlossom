<template>
    <vs-bar :tag :class="['vs-footer', colorSchemeClass, classObj]" :style-set="computedStyleSet" :position>
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

const componentName = VsComponent.VsFooter;
export default defineComponent({
    name: componentName,
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

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
        const additionalStyleSet: ComputedRef<Partial<VsFooterStyleSet>> = computed(() => {
            return objectUtil.shake({
                component: objectUtil.shake({
                    height: height.value || undefined,
                }),
            });
        });
        const { componentStyleSet } = useStyleSet<VsFooterStyleSet>(componentName, styleSet, additionalStyleSet);

        const isPositioned = computed(() => position.value && ['absolute', 'fixed', 'sticky'].includes(position.value));

        const computedStyleSet: ComputedRef<VsFooterStyleSet> = computed(() => {
            return {
                component: objectUtil.shake({
                    ...componentStyleSet.value.component,
                    position: position.value || undefined,
                    bottom: (isPositioned.value && componentStyleSet.value.component?.bottom) || 0,
                    left: (isPositioned.value && componentStyleSet.value.component?.left) || 0,
                    height: componentStyleSet.value.component?.height || '3rem',
                    zIndex: componentStyleSet.value.component?.zIndex || 'var(--vs-bar-z-index)',
                }),
            };
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
                position: position.value || 'relative',
                height: (computedStyleSet.value.component?.height as string) || '3rem',
            };
            layoutStore.setFooter(footerLayout);
        });

        return { colorSchemeClass, computedStyleSet, classObj, isLayoutChild, position };
    },
});
</script>
