<template>
    <component :is="tag" class="vs-container" :style="layoutStyles">
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject, toRefs } from 'vue';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
import { LayoutStore } from '@/stores';
import { objectUtil } from '@/utils';

const componentName = VsComponent.VsContainer;
export default defineComponent({
    name: componentName,
    props: {
        drawerResponsive: { type: Boolean, default: false },
        tag: { type: String, default: 'div' },
    },
    setup(props) {
        const { drawerResponsive } = toRefs(props);

        // only for vs-layout children
        const isLayoutChild = computed(() => getCurrentInstance()?.parent?.type.name === VsComponent.VsLayout);

        const { header, footer, drawers } = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());
        const layoutStyles = computed(() => {
            if (!isLayoutChild.value) {
                return {};
            }

            const NEEDS_PADDING_POSITIONS = ['absolute', 'fixed', 'sticky'];
            const { position: headerPosition, height: headerHeight } = header.value;
            const headerPaddingTop =
                NEEDS_PADDING_POSITIONS.includes(headerPosition) && headerHeight ? headerHeight : undefined;

            const { position: footerPosition, height: footerHeight } = footer.value;
            const footerPaddingBottom =
                NEEDS_PADDING_POSITIONS.includes(footerPosition) && footerHeight ? footerHeight : undefined;

            const { left, top, bottom, right } = drawers.value;

            const topDrawerPadding = (() => {
                if (!drawerResponsive.value || !top.isOpen || !top.size) {
                    return undefined;
                }
                if (headerPaddingTop) {
                    return `calc(${headerPaddingTop} + ${top.size})`;
                }
                return top.size;
            })();

            const bottomDrawerPadding = (() => {
                if (!drawerResponsive.value || !bottom.isOpen || !bottom.size) {
                    return undefined;
                }
                if (footerPaddingBottom) {
                    return `calc(${footerPaddingBottom} + ${bottom.size})`;
                }
                return bottom.size;
            })();

            return objectUtil.shake({
                paddingTop: topDrawerPadding ?? headerPaddingTop,
                paddingBottom: bottomDrawerPadding ?? footerPaddingBottom,
                paddingLeft: drawerResponsive.value && left.isOpen && left.size ? left.size : undefined,
                paddingRight: drawerResponsive.value && right.isOpen && right.size ? right.size : undefined,
            });
        });

        return { layoutStyles };
    },
});
</script>

<style src="./VsContainer.css" />
