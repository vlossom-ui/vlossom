<template>
    <vs-bar :tag :class="['vs-footer', colorSchemeClass, classObj]" :style-set="componentStyleSet" :position>
        <slot />
    </vs-bar>
</template>

<script lang="ts">
import { computed, defineComponent, toRefs, type ComputedRef, inject, watchEffect } from 'vue';
import { useColorScheme, useLayoutChild, useStyleSet } from '@/composables';
import { VsComponent, LAYOUT_STORE_KEY, type BarLayout } from '@/declaration';
import { getColorSchemeProps, getLayoutProps, getPositionProps, getStyleSetProps } from '@/props';
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
        ...getLayoutProps(),
        height: { type: String },
        primary: { type: Boolean, default: false },
        tag: { type: String, default: 'footer' },
    },
    setup(props) {
        const { colorScheme, styleSet, primary, position, height, layout } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);

        const isPositioned = computed(() => position.value && ['absolute', 'fixed', 'sticky'].includes(position.value));

        const baseStyleSet: ComputedRef<VsFooterStyleSet> = computed(() => ({
            component: {
                height: '3rem',
                zIndex: 'var(--vs-bar-z-index)',
                bottom: 0,
                left: 0,
            },
        }));
        const additionalStyleSet: ComputedRef<Partial<VsFooterStyleSet>> = computed(() => {
            return objectUtil.shake({
                component: objectUtil.shake({
                    height: height.value || undefined,
                    position: position.value || undefined,
                    ...(isPositioned.value ? {} : { bottom: 0, left: 0 }),
                }),
            });
        });
        const { componentStyleSet } = useStyleSet<VsFooterStyleSet>(
            componentName,
            styleSet,
            baseStyleSet,
            additionalStyleSet,
        );

        const classObj = computed(() => ({
            'vs-primary': primary.value,
        }));

        const { isLayoutChild } = useLayoutChild(layout);

        const layoutStore = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());
        watchEffect(() => {
            if (!isLayoutChild.value) {
                return;
            }
            const footerLayout: BarLayout = {
                position: position.value || 'relative',
                height: (componentStyleSet.value.component?.height as string) || '3rem',
            };
            layoutStore.setFooter(footerLayout);
        });

        return { colorSchemeClass, componentStyleSet, classObj, isLayoutChild, position };
    },
});
</script>
