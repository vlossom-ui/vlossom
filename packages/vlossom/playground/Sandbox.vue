<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <div class="sandbox flex flex-col gap-8 p-8">
            <h1>Sandbox</h1>

            <section class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold">1. 기본 inline style (CSSProperties extends)</h2>
                <p class="text-sm text-gray-500">
                    StyleSet 루트의 CSS 속성이 컴포넌트 루트 요소에 inline style로 적용됩니다.
                </p>
                <vs-select
                    v-model="value1"
                    :options="fruits"
                    :style-set="{
                        width: '300px',
                        backgroundColor: '#fff7ed',
                        borderRadius: '12px',
                    }"
                />
            </section>

            <section class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold">2. CSS 변수($height) 사용</h2>
                <p class="text-sm text-gray-500">
                    `$`-prefix가 붙은 primitive 값은 CSS 변수(--vs-select-height)로 emit됩니다.
                </p>
                <vs-select v-model="value2" :options="fruits" :style-set="{ $height: '3.5rem', width: '300px' }" />
            </section>

            <section class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold">3. $focused / $option / $selectedOption 슬롯 스타일</h2>
                <p class="text-sm text-gray-500">
                    상태/요소별로 슬롯을 구분해서 스타일링할 수 있습니다.
                </p>
                <vs-select
                    v-model="value3"
                    :options="fruits"
                    :style-set="{
                        width: '300px',
                        $focused: {
                            border: '2px solid #2563eb',
                            backgroundColor: '#eff6ff',
                        },
                        $option: {
                            padding: '0.75rem 1rem',
                        },
                        $selectedOption: {
                            backgroundColor: '#dbeafe',
                            fontWeight: 600,
                        },
                    }"
                />
            </section>

            <section class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold">4. multiple + $chip 하위 컴포넌트 스타일</h2>
                <p class="text-sm text-gray-500">
                    선택된 항목의 chip에 별도 StyleSet을 전달합니다.
                </p>
                <vs-select
                    v-model="value4"
                    multiple
                    :options="fruits"
                    :style-set="{
                        width: '400px',
                        $chip: {
                            $height: '1.6rem',
                            backgroundColor: '#fef3c7',
                            color: '#92400e',
                        },
                    }"
                />
            </section>

            <section class="flex flex-col gap-3">
                <h2 class="text-lg font-semibold">5. $wrapper(VsInputWrapper)에 라벨/메시지 스타일</h2>
                <p class="text-sm text-gray-500">
                    $wrapper로 라벨/메시지 영역까지 함께 스타일링합니다.
                </p>
                <vs-select
                    v-model="value5"
                    label="과일 선택"
                    :options="fruits"
                    :messages="[{ state: 'info', text: '하나를 골라주세요.' }]"
                    :style-set="{
                        width: '320px',
                        $wrapper: {
                            $label: {
                                color: '#0f766e',
                                fontWeight: 600,
                            },
                            $messages: {
                                marginTop: '0.5rem',
                            },
                        },
                    }"
                />
            </section>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const fruits = ['apple', 'banana', 'cherry', 'durian', 'elderberry'];

        return {
            fruits,
            value1: ref('apple'),
            value2: ref('banana'),
            value3: ref('cherry'),
            value4: ref(['apple', 'banana']),
            value5: ref(null),
        };
    },
});
</script>
