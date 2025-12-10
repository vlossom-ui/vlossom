<template>
    <component :is="tag" class="vs-container" :style="layoutStyles">
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject } from 'vue';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
import { LayoutStore } from '@/stores';
import { objectUtil } from '@/utils';

const componentName = VsComponent.VsContainer;
export default defineComponent({
    name: componentName,
    props: {
        tag: { type: String, default: 'div' },
    },
    setup() {
        // only for vs-layout children
        const isLayoutChild = computed(() => getCurrentInstance()?.parent?.type.name === VsComponent.VsLayout);

        const { header, footer, drawers } = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());
        const layoutStyles = computed(() => {
            if (!isLayoutChild.value) {
                return {};
            }

            const needPadding = ['absolute', 'fixed', 'sticky'];
            const { position: headerPosition, height: headerHeight } = header.value;
            const headerStyles = objectUtil.shake({
                paddingTop: needPadding.includes(headerPosition) && headerHeight ? headerHeight : undefined,
            });

            const { position: footerPosition, height: footerHeight } = footer.value;
            const footerStyles = objectUtil.shake({
                paddingBottom: needPadding.includes(footerPosition) && footerHeight ? footerHeight : undefined,
            });

            const { left, top, bottom, right } = drawers.value;
            const drawerStyles = objectUtil.shake({
                paddingLeft: left.isOpen && left.responsive && left.size ? left.size : undefined,
                paddingTop: top.isOpen && top.responsive && top.size ? top.size : undefined,
                paddingBottom: bottom.isOpen && bottom.responsive && bottom.size ? bottom.size : undefined,
                paddingRight: right.isOpen && right.responsive && right.size ? right.size : undefined,
            });

            return {
                ...headerStyles,
                ...footerStyles,
                ...drawerStyles,
            };
        });

        return { layoutStyles };
    },
});
</script>

<style src="./VsContainer.css" />
