<template>
    <component :is="tag" class="vs-container" :style="layoutStyles">
        <slot />
    </component>
</template>

<script lang="ts">
import { computed, defineComponent, getCurrentInstance, inject } from 'vue';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
import { LayoutStore } from '@/stores';

const name = VsComponent.VsContainer;
export default defineComponent({
    name,
    props: {
        tag: { type: String, default: 'div' },
    },
    setup() {
        // only for vs-layout children
        const isLayoutChild = computed(() => getCurrentInstance()?.parent?.type.name === VsComponent.VsLayout);

        const { header, footer } = inject(LAYOUT_STORE_KEY, LayoutStore.getDefaultLayoutStore());
        const layoutStyles = computed(() => {
            if (!isLayoutChild.value) {
                return {};
            }

            const styles: { [key: string]: string } = {};
            const needPadding = ['absolute', 'fixed', 'sticky'];

            const { position: headerPosition, height: headerHeight } = header.value;
            if (needPadding.includes(headerPosition) && headerHeight) {
                styles.paddingTop = headerHeight;
            }

            const { position: footerPosition, height: footerHeight } = footer.value;
            if (needPadding.includes(footerPosition) && footerHeight) {
                styles.paddingBottom = footerHeight;
            }

            return styles;
        });

        return { layoutStyles };
    },
});
</script>

<style src="./VsContainer.css" />
