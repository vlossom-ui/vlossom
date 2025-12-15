<template>
    <div>
        <h2>Modal Title</h2>
        <p>Modal Content</p>
        <vs-input ref="inputRef" />
        <vs-input />
        <vs-input />
        <vs-input />
        <vs-input />
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, useTemplateRef } from 'vue';
import type { VsInputRef } from '@/components';
export default defineComponent({
    setup() {
        const inputRef = useTemplateRef<VsInputRef>('inputRef');

        onMounted(() => {
            console.log('onMounted ModalContent');
            inputRef.value?.focus();
        });

        return {
            inputRef,
        };
    },
});
</script>
