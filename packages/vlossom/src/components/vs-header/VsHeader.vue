<template>
    <vs-bar ref="headerRef" :tag :class="['vs-header', colorSchemeClass, classObj]" :style-set="componentStyleSet">
        <slot />
    </vs-bar>
</template>

<script lang="ts">
import {
    computed,
    defineComponent,
    toRefs,
    type ComputedRef,
    getCurrentInstance,
    inject,
    watchEffect,
    useTemplateRef,
    onMounted,
} from 'vue';
import { useColorScheme, useStyleSet } from '@/composables';
import { VsComponent, LAYOUT_STORE_KEY, type BarLayout } from '@/declaration';
import { getColorSchemeProps, getPositionProps, getStyleSetProps } from '@/props';
import { objectUtil } from '@/utils';
import { LayoutStore } from '@/stores';
import type { VsHeaderStyleSet } from './types';

import VsBar from '@/components/vs-bar/VsBar.vue';

const name = VsComponent.VsHeader;
export default defineComponent({
    name,
    components: { VsBar },
    props: {
        ...getColorSchemeProps(),
        ...getStyleSetProps<VsHeaderStyleSet>(),
        ...getPositionProps(),
        primary: { type: Boolean, default: false },
        tag: { type: String, default: 'header' },
    },
    setup(props) {
        const { colorScheme, styleSet, primary, position } = toRefs(props);

        const headerRef = useTemplateRef<typeof VsBar>('headerRef');
        const { colorSchemeClass } = useColorScheme(name, colorScheme);
        const additionalStyleSet: ComputedRef<Partial<VsHeaderStyleSet>> = computed(() => {
            return objectUtil.shake({
                position: position.value ? position.value : undefined,
            });
        });
        const { componentStyleSet } = useStyleSet<VsHeaderStyleSet>(name, styleSet, additionalStyleSet);

        const classObj = computed(() => ({
            'vs-primary': primary.value,
        }));

        // only for vs-layout children
        const isLayoutChild = computed(() => getCurrentInstance()?.parent?.type.name === VsComponent.VsLayout);
        const layoutStore = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());

        watchEffect(() => {
            if (isLayoutChild.value) {
                const headerLayout: BarLayout = {
                    position: position.value || 'relative',
                    height: '',
                };
                layoutStore.setHeader(headerLayout);
            }
        });

        onMounted(() => {
            console.log(headerRef.value);
            console.log(isLayoutChild.value);
        });

        return { colorSchemeClass, componentStyleSet, classObj, headerRef, isLayoutChild };
    },
});
</script>
