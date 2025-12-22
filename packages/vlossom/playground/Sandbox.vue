<template>
    <section class="mb-8">
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Sandbox</h2>
        <p class="mb-4 text-[var(--vs-font-color-sub)]">
            자유롭게 컴포넌트를 테스트해보세요. 아래 영역에서 직접 코드를 작성하거나 컴포넌트를 추가할 수 있습니다.
        </p>
        <div class="min-h-[200px] rounded-lg bg-[var(--vs-area-bg)] p-6">
            <vs-grid :grid-size="12" column-gap="1rem" row-gap="1rem">
                <vs-input v-model="sandboxInput" label="Sandbox Input" :grid="6" />
                <vs-button @click="sandboxAction" :grid="6" class="self-end">Action</vs-button>
            </vs-grid>

            <vs-divider class="my-4" />

            <vs-message v-if="sandboxMessage" :state="sandboxMessageState" :text="sandboxMessage" />
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import type { UIState } from '@/declaration';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const sandboxInput = ref('');
        const sandboxMessage = ref('');
        const sandboxMessageState: Ref<UIState> = ref('info');

        function sandboxAction() {
            if (sandboxInput.value.trim()) {
                sandboxMessage.value = `Input: "${sandboxInput.value}"`;
                sandboxMessageState.value = 'success';
            } else {
                sandboxMessage.value = 'Please enter something in the input field';
                sandboxMessageState.value = 'warning';
            }
        }

        return {
            sandboxInput,
            sandboxMessage,
            sandboxMessageState,
            sandboxAction,
        };
    },
});
</script>
