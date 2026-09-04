<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <div class="sandbox">
            <h1>Sandbox</h1>

            <h2>동적으로 바뀌는 rule과 VsForm.validate()</h2>

            <div class="controls">
                <vs-switch v-model="nameRequired" label="이름 required" />
                <vs-switch v-model="strictNickname" label="닉네임 3자 이상" />
            </div>

            <vs-form ref="formRef" @error="onError">
                <vs-input id="name" v-model="name" label="이름" :required="nameRequired" />
                <vs-input id="nickname" v-model="nickname" label="닉네임" :rules="nicknameRules" />
            </vs-form>

            <div class="controls">
                <vs-button primary @click="validate">validate</vs-button>
                <span>결과: {{ result }}</span>
            </div>

            <p>invalid ids: {{ invalidIds.join(', ') || '-' }}</p>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import type { VsInputValueType } from '@/components/vs-input/types';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const formRef = ref<any>(null);

        const name = ref('');
        const nickname = ref('');

        const nameRequired = ref(false);
        const strictNickname = ref(false);

        // 배열 참조는 그대로 두고 내부에서 반응형 값만 읽는다
        const nicknameRules = [
            (v: VsInputValueType) =>
                !strictNickname.value || String(v ?? '').length >= 3 ? '' : '3자 이상 입력하세요',
        ];

        const result = ref('-');
        const invalidIds = ref<string[]>([]);

        async function validate() {
            invalidIds.value = [];
            result.value = String(await formRef.value.validate());
        }

        function onError(ids: string[]) {
            invalidIds.value = ids;
        }

        return {
            formRef,
            name,
            nickname,
            nameRequired,
            strictNickname,
            nicknameRules,
            result,
            invalidIds,
            validate,
            onError,
        };
    },
});
</script>

<style scoped>
.controls {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin: 1rem 0;
}
</style>
