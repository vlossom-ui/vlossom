<template>
    <component :is="tag" class="vs-container" :style="layoutStyles">
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, inject, toRefs } from 'vue';
import { useLayoutChild } from '@/composables';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
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

        function getDrawerPadding(drawerSize: string, isOpen: boolean, pushContainer: boolean, barPadding?: string) {
            if (!pushContainer || !isOpen || !drawerSize) {
                return undefined;
            }
            return barPadding ? `calc(${barPadding} + ${drawerSize})` : drawerSize;
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
                paddingTop:
                    getDrawerPadding(top.size, top.isOpen, top.pushContainer, headerPaddingTop) ?? headerPaddingTop,
                paddingBottom:
                    getDrawerPadding(bottom.size, bottom.isOpen, bottom.pushContainer, footerPaddingBottom) ??
                    footerPaddingBottom,
                paddingLeft: getDrawerPadding(left.size, left.isOpen, left.pushContainer),
                paddingRight: getDrawerPadding(right.size, right.isOpen, right.pushContainer),
            });
        });

        return { layoutStyles };
    },
});
</script>

<style src="./VsContainer.css" />
