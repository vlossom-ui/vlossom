<template>
    <vs-bar :tag :class="['vs-header', colorSchemeClass, classObj]" :style-set="computedStyleSet" :position>
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
import type { VsHeaderStyleSet } from './types';

import VsBar from '@/components/vs-bar/VsBar.vue';

const componentName = VsComponent.VsHeader;
export default defineComponent({
    name: componentName,
    components: { VsBar },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsHeaderStyleSet>(),
        ...getPositionProps(),
        height: { type: String },
        primary: { type: Boolean, default: false },
        tag: { type: String, default: 'header' },
    },
    setup(props) {
        const { colorScheme, styleSet, primary, position, height } = toRefs(props);

        const { colorSchemeClass } = useColorScheme(componentName, colorScheme);
        const additionalStyleSet: ComputedRef<Partial<VsHeaderStyleSet>> = computed(() => {
            return objectUtil.shake({
                component: objectUtil.shake({
                    height: height.value || undefined,
                }),
            });
        });
        const { componentStyleSet } = useStyleSet<VsHeaderStyleSet>(componentName, styleSet, additionalStyleSet);

        const isPositioned = computed(() => position.value && ['absolute', 'fixed', 'sticky'].includes(position.value));

        const computedStyleSet: ComputedRef<VsHeaderStyleSet> = computed(() => {
            return {
                component: objectUtil.shake({
                    ...componentStyleSet.value.component,
                    position: position.value || undefined,
                    top: (isPositioned.value && componentStyleSet.value.component?.top) || 0,
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
            const headerLayout: BarLayout = {
                position: position.value || 'relative',
                height: (computedStyleSet.value.component?.height as string) || '3rem',
            };
            layoutStore.setHeader(headerLayout);
        });

        return { colorSchemeClass, computedStyleSet, classObj, isLayoutChild, position };
    },
});
</script>
