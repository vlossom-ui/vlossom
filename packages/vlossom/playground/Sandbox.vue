<template>
    <section class="section">
        <h2 class="section-title">Sandbox</h2>
        <p style="margin-bottom: 1rem; color: var(--vs-font-color-sub)">
            자유롭게 컴포넌트를 테스트해보세요. 아래 영역에서 직접 코드를 작성하거나 컴포넌트를 추가할 수 있습니다.
        </p>
        <div class="sandbox-area">
            <!-- Add your sandbox components here -->
            <vs-grid :grid-size="12" column-gap="1rem" row-gap="1rem">
                <vs-input v-model="sandboxInput" label="Sandbox Input" :grid="6" />
                <vs-button @click="sandboxAction" :grid="6" style="align-self: end">Action</vs-button>
            </vs-grid>

            <vs-divider style="margin: 1rem 0" />

            <vs-message v-if="sandboxMessage" :state="sandboxMessageState" :text="sandboxMessage" />
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import type { UIState } from '@/declaration';

export default defineComponent({
    name: 'SandboxArea',
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

<style scoped>
.section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--vs-line-color);
}

.sandbox-area {
    padding: 1.5rem;
    background: var(--vs-area-bg);
    border-radius: 8px;
    min-height: 200px;
}
</style>
