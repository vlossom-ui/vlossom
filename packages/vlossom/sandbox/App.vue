<template>
    <div>
        <h1>Hello Vlossom</h1>
    </div>
    <vs-file-drop
        placeholder="파일을 드래그하거나 클릭하여 업로드하세요"
        multiple
        class="mx-auto mt-100"
        width="500px"
    />
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    name: 'App',
    setup() {
        return {};
    },
});
</script>
