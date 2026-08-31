<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <div class="sandbox">
            <h1>Sandbox</h1>

            <!-- VsGroupedList Virtual Scroll -->
            <section style="margin-top: 2rem;">
                <h2>VsGroupedList — Virtual Scroll</h2>

                <div style="display: flex; gap: 2rem; align-items: flex-start; margin-top: 1rem;">
                    <!-- 일반 렌더링 (item-size 없음) -->
                    <div>
                        <h3>일반 ({{ items.length }}개)</h3>
                        <div style="height: 300px;">
                            <vs-grouped-list :items="items" @click-item="onClickItem" />
                        </div>
                    </div>

                    <!-- Virtual Scroll (100개 이상이면 자동 활성화) -->
                    <div>
                        <h3>Virtual Scroll 자동 ({{ largeItems.length }}개)</h3>
                        <div style="height: 300px;">
                            <vs-grouped-list
                                ref="virtualListRef"
                                :items="largeItems"
                                @click-item="onClickItem"
                            />
                        </div>
                        <div style="margin-top: 0.5rem; display: flex; gap: 0.5rem;">
                            <vs-button @click="scrollToMiddle">중간 아이템으로 이동</vs-button>
                            <vs-button @click="scrollToLast">마지막 아이템으로 이동</vs-button>
                        </div>
                    </div>

                    <!-- Virtual Scroll + 그룹 -->
                    <div>
                        <h3>Virtual Scroll + 그룹 ({{ groupedLargeItems.length }}개)</h3>
                        <div style="height: 300px;">
                            <vs-grouped-list
                                :items="groupedLargeItems"
                                :group-by="(item) => item.category"
                                @click-item="onClickItem"
                            />
                        </div>
                    </div>
                </div>

                <p v-if="lastClicked" style="margin-top: 1rem;">
                    클릭: <strong>{{ lastClicked }}</strong>
                </p>
            </section>

            <!-- VsGroupedList 가변 높이 -->
            <section style="margin-top: 2rem;">
                <h2>VsGroupedList — 가변 높이 아이템 (Virtual Scroll)</h2>
                <p style="margin-bottom: 0.5rem; color: #666; font-size: 0.875rem;">
                    200개 아이템, 5개마다 긴 설명 텍스트 삽입 — measureElement가 실제 DOM 높이를 측정해 스크롤 사이즈를 정확하게 계산합니다.
                </p>
                <div style="height: 300px; width: 480px;">
                    <vs-grouped-list
                        :items="variableItems"
                        :style-set="{ $item: { padding: '0.5rem 1rem', whiteSpace: 'normal', wordBreak: 'break-word' } }"
                        @click-item="onClickItem"
                    />
                </div>
            </section>

            <!-- VsSelect Virtual Scroll -->
            <section style="margin-top: 2rem;">
                <h2>VsSelect — 대량 옵션 (Virtual Scroll 자동)</h2>
                <div style="display: flex; gap: 2rem; align-items: flex-start; margin-top: 1rem; flex-wrap: wrap;">
                    <div style="width: 280px;">
                        <h3>기본 + 검색 ({{ selectOptions.length }}개)</h3>
                        <vs-select
                            v-model="selectedValue"
                            :options="selectOptions"
                            option-label="name"
                            option-value="id"
                            label="아이템 선택"
                            :search="true"
                        />
                        <p v-if="selectedValue != null" style="margin-top: 0.5rem;">선택: {{ selectedValue }}</p>
                    </div>
                    <div style="width: 280px;">
                        <h3>그룹 + 검색 ({{ groupedSelectOptions.length }}개)</h3>
                        <vs-select
                            v-model="selectedGrouped"
                            :options="groupedSelectOptions"
                            option-label="name"
                            option-value="id"
                            label="그룹 선택"
                            :search="true"
                            :group-by="(opt) => opt.category"
                        />
                        <p v-if="selectedGrouped != null" style="margin-top: 0.5rem;">선택: {{ selectedGrouped }}</p>
                    </div>
                    <div style="width: 280px;">
                        <h3>다중 선택 + selectAll</h3>
                        <vs-select
                            v-model="selectedMultiple"
                            :options="selectOptions"
                            option-label="name"
                            option-value="id"
                            label="다중 선택"
                            :multiple="true"
                            :closable-chips="true"
                            :search="true"
                            :select-all="true"
                        />
                        <p v-if="selectedMultiple.length" style="margin-top: 0.5rem;">선택 수: {{ selectedMultiple.length }}</p>
                    </div>
                </div>
            </section>
            <!-- VsTable Virtual Scroll -->
            <section style="margin-top: 2rem;">
                <h2>VsTable — 대량 행 (Virtual Scroll 자동)</h2>
                <p style="margin-bottom: 0.5rem; color: #666; font-size: 0.875rem;">
                    10,000개 행 — items.length ≥ 100이면 가상 스크롤 자동 활성화 (페이지네이션 없는 경우)
                </p>
                <div style="height: 400px;">
                    <vs-table
                        :columns="tableColumns"
                        :items="largeTableItems"
                        :style-set="{ height: '100%' }"
                    />
                </div>
            </section>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref, computed } from 'vue';
import { useOptionList } from '@/composables';
import type { VsGroupedListRef } from '@/components/vs-grouped-list/types';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const lastClicked = ref('');
        const virtualListRef = ref<VsGroupedListRef | null>(null);

        // 소규모 일반 목록
        const rawItems = Array.from({ length: 20 }, (_, i) => ({
            id: i + 1,
            name: `아이템 ${i + 1}`,
        }));
        const { computedOptions: items } = useOptionList(ref(rawItems), ref('name'), ref('id'), ref(false));

        // 대규모 virtual scroll 목록
        const rawLargeItems = Array.from({ length: 10000 }, (_, i) => ({
            id: i + 1,
            name: `아이템 ${(i + 1).toLocaleString()}`,
        }));
        const { computedOptions: largeItems } = useOptionList(
            ref(rawLargeItems),
            ref('name'),
            ref('id'),
            ref(false),
        );

        // 그룹화된 대규모 목록
        const categories = ['알파', '베타', '감마', '델타', '엡실론'];
        const rawGroupedItems = Array.from({ length: 5000 }, (_, i) => ({
            id: i + 1,
            name: `항목 ${(i + 1).toLocaleString()}`,
            category: categories[i % categories.length],
        }));
        const { computedOptions: groupedLargeItems } = useOptionList(
            ref(rawGroupedItems),
            ref('name'),
            ref('id'),
            ref(false),
        );

        const middleId = computed(() => largeItems.value[Math.floor(largeItems.value.length / 2)]?.id ?? '');
        const lastId = computed(() => largeItems.value[largeItems.value.length - 1]?.id ?? '');

        function scrollToMiddle() {
            virtualListRef.value?.scrollToItem(String(middleId.value));
        }
        function scrollToLast() {
            virtualListRef.value?.scrollToItem(String(lastId.value));
        }
        function onClickItem(item: any) {
            lastClicked.value = item.label;
        }

        // 가변 높이 예제: 5개마다 긴 설명 텍스트
        const rawVariableItems = Array.from({ length: 200 }, (_, i) => ({
            id: i + 1,
            name:
                i % 5 === 0
                    ? `[긴 텍스트] 항목 ${i + 1}: 이 항목은 여러 줄에 걸친 설명을 포함하고 있어 DOM 높이가 일반 항목보다 큽니다. measureElement가 실제 크기를 측정하여 정확한 가상 스크롤을 제공합니다.`
                    : `일반 항목 ${i + 1}`,
        }));
        const { computedOptions: variableItems } = useOptionList(ref(rawVariableItems), ref('name'), ref('id'), ref(false));

        // VsSelect 예제
        const selectOptions = Array.from({ length: 10000 }, (_, i) => ({
            id: i + 1,
            name: `옵션 ${(i + 1).toLocaleString()}`,
        }));

        const selectCategories = ['알파', '베타', '감마', '델타', '엡실론'];
        const groupedSelectOptions = Array.from({ length: 5000 }, (_, i) => ({
            id: i + 1,
            name: `항목 ${(i + 1).toLocaleString()}`,
            category: selectCategories[i % selectCategories.length],
        }));

        const selectedValue = ref<number | null>(null);
        const selectedGrouped = ref<number | null>(null);
        const selectedMultiple = ref<number[]>([]);

        // VsTable 예제
        const tableColumns = [
            { key: 'index', label: '#', width: '70px' },
            { key: 'name', label: '이름', sortable: true },
            { key: 'department', label: '부서', sortable: true },
            { key: 'score', label: '점수', sortable: true },
        ];
        const tableDepartments = ['개발', '디자인', '기획', '마케팅', '영업'];
        const largeTableItems = Array.from({ length: 10000 }, (_, i) => ({
            index: i + 1,
            name: `사용자 ${(i + 1).toLocaleString()}`,
            department: tableDepartments[i % tableDepartments.length],
            score: (i * 37 + 13) % 101,
        }));

        return {
            items,
            largeItems,
            groupedLargeItems,
            lastClicked,
            virtualListRef,
            scrollToMiddle,
            scrollToLast,
            onClickItem,
            variableItems,
            selectOptions,
            groupedSelectOptions,
            selectedValue,
            selectedGrouped,
            selectedMultiple,
            tableColumns,
            largeTableItems,
        };
    },
});
</script>
