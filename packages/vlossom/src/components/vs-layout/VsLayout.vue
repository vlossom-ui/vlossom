<template>
    <div class="vs-layout" :style="layoutStyle">
        <slot />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_STORE_KEY, VsComponent } from '@/declaration';
import { objectUtil } from '@/utils';

const name = VsComponent.VsLayout;
export default defineComponent({
    name,
    setup() {
        const layoutStore = LayoutStore.getDefaultLayoutStore();
        provide(LAYOUT_STORE_KEY, layoutStore);

        const layoutStyle = computed(() => {
            const { left, top, bottom, right } = layoutStore.drawers.value;

            return objectUtil.shake({
                paddingLeft: left.isOpen && left.responsive && left.size ? left.size : undefined,
                paddingTop: top.isOpen && top.responsive && top.size ? top.size : undefined,
                paddingBottom: bottom.isOpen && bottom.responsive && bottom.size ? bottom.size : undefined,
                paddingRight: right.isOpen && right.responsive && right.size ? right.size : undefined,
            });
        });

        return { layoutStyle };
    },
});
</script>

<style src="./VsLayout.css" />
