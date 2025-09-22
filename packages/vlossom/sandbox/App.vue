<template>
    <div class="min-h-screen space-y-6 bg-gray-50 p-8 dark:bg-gray-900">
        <h1 class="mb-8 text-3xl font-bold text-gray-900 dark:text-white">VsLabelValue with Tailwind CSS</h1>

        <!-- 기본 예제 -->
        <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">기본 스타일</h2>
            <vs-label-value>
                <template #label>이름</template>
                홍길동
            </vs-label-value>
        </div>

        <!-- Primary 스타일 -->
        <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Primary 스타일</h2>
            <vs-label-value :primary="true">
                <template #label>중요한 정보</template>
                이것은 중요한 값입니다
            </vs-label-value>
        </div>

        <!-- Dense 스타일 -->
        <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Dense 스타일</h2>
            <vs-label-value :dense="true">
                <template #label>압축된 레이블</template>
                작은 크기의 값
            </vs-label-value>
        </div>

        <!-- Inline 스타일 -->
        <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">Inline 스타일</h2>
            <div class="flex items-center gap-4">
                <vs-label-value :inline="true">
                    <template #label>상태</template>
                    활성
                </vs-label-value>
                <vs-label-value :inline="true" :primary="true">
                    <template #label>우선순위</template>
                    높음
                </vs-label-value>
            </div>
        </div>

        <!-- 조합 스타일 -->
        <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">조합 스타일</h2>
            <vs-label-value :primary="true" :dense="true">
                <template #label>중요하고 압축된</template>
                값
            </vs-label-value>
        </div>

        <!-- 반응형 테스트를 위한 넓은 컨테이너 -->
        <div class="space-y-4">
            <h2 class="text-xl font-semibold text-gray-800 dark:text-gray-200">반응형 테스트 (창 크기 조정해보세요)</h2>
            <div class="max-w-md">
                <vs-label-value>
                    <template #label>긴 레이블 텍스트</template>
                    이것은 반응형 동작을 테스트하기 위한 긴 값입니다. 화면 크기가 작아지면 세로로 배치됩니다.
                </vs-label-value>
            </div>
        </div>
    </div>
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
