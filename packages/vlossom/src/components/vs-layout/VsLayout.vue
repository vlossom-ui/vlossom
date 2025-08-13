<template>
    <div class="vs-layout" :style="layoutStyle">
        <slot />
    </div>
</template>

<script lang="ts">
import { computed, defineComponent, provide } from 'vue';
import { LayoutStore } from '@/stores';
import { LAYOUT_STORE_KEY } from '@/declaration';
import { objectUtil } from '@/utils';

export default defineComponent({
    setup() {
        const layoutStore = LayoutStore.getDefaultLayout();
        provide(LAYOUT_STORE_KEY, layoutStore);

        const layoutStyle = computed(() => {
            const { left, top, bottom, right } = layoutStore.drawers.value;

            return objectUtil.shake({
                paddingLeft: left.isOpen && left.responsive ? left.size : undefined,
                paddingTop: top.isOpen && top.responsive ? top.size : undefined,
                paddingBottom: bottom.isOpen && bottom.responsive ? bottom.size : undefined,
                paddingRight: right.isOpen && right.responsive ? right.size : undefined,
            });
        });

        return { layoutStyle };
    },
});
</script>

<style src="./VsLayout.css" />
