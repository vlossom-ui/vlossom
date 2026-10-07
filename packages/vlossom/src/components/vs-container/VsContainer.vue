<template>
    <component :is="tag" :class="['vs-container', layoutClasses]" :style="layoutStyles">
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, inject, toRefs } from 'vue';
import { useLayoutChild } from '@/composables';
import { LAYOUT_STORE_KEY, VsComponent, type DrawerLayout } from '@/declaration';
import { getLayoutProps } from '@/props';
import { LayoutStore } from '@/stores';
import { objectUtil } from '@/utils';

const componentName = VsComponent.VsContainer;
export default defineComponent({
    name: componentName,
    props: {
        ...getLayoutProps(),
        tag: { type: String, default: 'div' },
    },
    setup(props) {
        const { layout } = toRefs(props);

        const { isLayoutChild } = useLayoutChild(layout);

        const { header, footer, drawers } = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());

        function isPushing({ size, isOpen, pushContainer }: DrawerLayout) {
            return pushContainer && isOpen && !!size;
        }

        function getDrawerPadding(drawer: DrawerLayout, barPadding?: string) {
            if (!isPushing(drawer)) {
                return undefined;
            }
            return barPadding ? `calc(${barPadding} + ${drawer.size})` : drawer.size;
        }

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

            return objectUtil.shake({
                paddingTop: getDrawerPadding(top, headerPaddingTop) ?? headerPaddingTop,
                paddingBottom: getDrawerPadding(bottom, footerPaddingBottom) ?? footerPaddingBottom,
                '--vs-container-push-left': isPushing(left) ? left.size : undefined,
                '--vs-container-push-right': isPushing(right) ? right.size : undefined,
            });
        });

        const layoutClasses = computed(() => {
            if (!isLayoutChild.value) {
                return {};
            }

            const { left, right } = drawers.value;
            return {
                'vs-container-push-left': isPushing(left),
                'vs-container-push-right': isPushing(right),
            };
        });

        return { layoutStyles, layoutClasses };
    },
});
</script>

<style src="./VsContainer.css" />
