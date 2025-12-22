<template>
    <vs-divider :style-set="dividerStyleSet" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { VsDividerStyleSet } from '@/components/vs-divider/types';

export default defineComponent({
    name: 'Divider',
    setup() {
        const dividerStyleSet: VsDividerStyleSet = {
            horizontal: {
                margin: '1.5rem 0',
            },
        };

        return {
            dividerStyleSet,
        };
    },
});
</script>
