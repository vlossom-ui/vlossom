<template>
    <div class="app">
        <h1>VsInfiniteScroll Example</h1>

        <!-- vs-infinite-scroll 자체에 높이 지정 예시 -->
        <section class="example-section">
            <h2>컴포넌트 자체에 높이 지정 (300px)</h2>
            <div class="controls">
                <vs-button @click="toggleDisabledComponent">
                    {{ disabledComponent ? 'Enable' : 'Disable' }} Infinite Scroll
                </vs-button>
            </div>
            <vs-infinite-scroll
                :disabled="disabledComponent"
                :height="300"
                root-margin="0px"
                :threshold="0.5"
                class="fixed-height-component"
            >
                <InfiniteScrollItem v-for="item in itemsComponent" :key="`component-${item}`" :number="item" />
            </vs-infinite-scroll>
        </section>

        <!-- items 배열 변경 예시 -->
        <section class="example-section">
            <h2>Items 배열 변경 예시</h2>
            <div class="controls">
                <vs-button @click="toggleDisabledDynamic">
                    {{ disabledDynamic ? 'Enable' : 'Disable' }} Infinite Scroll
                </vs-button>
                <vs-button @click="changeItems" class="ml-2"> Change Items (현재: {{ currentItemSet }}) </vs-button>
            </div>
            <vs-infinite-scroll
                :disabled="disabledDynamic"
                :height="300"
                root-margin="0px"
                :threshold="0.5"
                class="fixed-height-component"
            >
                <InfiniteScrollItem v-for="item in itemsDynamic" :key="`dynamic-${item}`" :number="item" />
            </vs-infinite-scroll>
        </section>

        <!-- 일부 아이템만 변경 예시 -->
        <section class="example-section">
            <h2>일부 아이템만 변경 예시</h2>
            <div class="controls">
                <vs-button @click="toggleDisabledPartial">
                    {{ disabledPartial ? 'Enable' : 'Disable' }} Infinite Scroll
                </vs-button>
                <vs-button @click="addItems"> 앞에 10개 추가 </vs-button>
                <vs-button @click="removeItems"> 앞에서 10개 제거 </vs-button>
                <vs-button @click="insertItems"> 중간에 5개 삽입 </vs-button>
                <vs-button @click="resetPartialItems"> 초기화 </vs-button>
            </div>
            <div class="info-text">현재 아이템 수: {{ itemsPartial.length }}</div>
            <vs-infinite-scroll
                :disabled="disabledPartial"
                :height="300"
                root-margin="0px"
                :threshold="0.5"
                class="fixed-height-component"
            >
                <InfiniteScrollItem v-for="item in itemsPartial" :key="`partial-${item}`" :number="item" />
            </vs-infinite-scroll>
        </section>

        <!-- 기본 예시 (전체 페이지 스크롤) -->
        <section class="example-section">
            <h2>기본 예시 (전체 페이지 스크롤)</h2>
            <div class="controls">
                <vs-button @click="toggleDisabled"> {{ disabled ? 'Enable' : 'Disable' }} Infinite Scroll </vs-button>
            </div>
            <vs-infinite-scroll :disabled="disabled" root-margin="0px" :threshold="0.5">
                <InfiniteScrollItem v-for="item in items" :key="item" :number="item" />
            </vs-infinite-scroll>
        </section>
    </div>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from 'vue';
import InfiniteScrollItem from './InfiniteScrollItem.vue';

export default defineComponent({
    name: 'App',
    components: {
        InfiniteScrollItem,
    },
    setup() {
        const disabled = ref(false);
        const disabledWrapper = ref(false);
        const disabledComponent = ref(false);
        const disabledDynamic = ref(false);
        const disabledPartial = ref(false);
        const items = reactive(Array.from({ length: 5000 }, (_, i) => i + 1));
        const itemsComponent = Array.from({ length: 20000 }, (_, i) => i + 1);

        // 동적 items 배열 변경을 위한 데이터
        const currentItemSet = ref(1);
        const itemsDynamic = ref(Array.from({ length: 1000 }, (_, i) => i + 1));

        // 일부 아이템만 변경 테스트용
        const itemsPartial = ref(Array.from({ length: 100 }, (_, i) => i + 1));
        let partialCounter = 100;

        // 여러 가지 다른 배열 세트 정의
        const itemSets = [
            Array.from({ length: 1000 }, (_, i) => i + 1), // 1-1000
            Array.from({ length: 500 }, (_, i) => (i + 1) * 2), // 2, 4, 6, ..., 1000
            Array.from({ length: 2000 }, (_, i) => i + 100), // 100-2099
            Array.from({ length: 800 }, (_, i) => (i + 1) * 5), // 5, 10, 15, ..., 4000
            Array.from({ length: 1500 }, (_, i) => 10000 + i + 1), // 10001-11500
        ];

        function toggleDisabled() {
            disabled.value = !disabled.value;
        }

        function toggleDisabledWrapper() {
            disabledWrapper.value = !disabledWrapper.value;
        }

        function toggleDisabledComponent() {
            disabledComponent.value = !disabledComponent.value;
        }

        function toggleDisabledDynamic() {
            disabledDynamic.value = !disabledDynamic.value;
        }

        function changeItems() {
            currentItemSet.value = (currentItemSet.value % itemSets.length) + 1;
            itemsDynamic.value = [...itemSets[currentItemSet.value - 1]];
        }

        function toggleDisabledPartial() {
            disabledPartial.value = !disabledPartial.value;
        }

        function addItems() {
            // 앞에 10개 추가
            const newItems = Array.from({ length: 10 }, (_, i) => partialCounter + i + 1);
            partialCounter += 10;
            itemsPartial.value = [...newItems, ...itemsPartial.value];
        }

        function removeItems() {
            // 앞에서 10개 제거
            if (itemsPartial.value.length > 10) {
                itemsPartial.value = itemsPartial.value.slice(10);
            } else {
                itemsPartial.value = [];
            }
        }

        function insertItems() {
            // 중간(인덱스 50)에 5개 삽입
            const newItems = Array.from({ length: 5 }, (_, i) => partialCounter + i + 1);
            partialCounter += 5;
            const insertIndex = Math.min(50, Math.floor(itemsPartial.value.length / 2));
            itemsPartial.value = [
                ...itemsPartial.value.slice(0, insertIndex),
                ...newItems,
                ...itemsPartial.value.slice(insertIndex),
            ];
        }

        function resetPartialItems() {
            partialCounter = 100;
            itemsPartial.value = Array.from({ length: 100 }, (_, i) => i + 1);
        }

        return {
            disabled,
            disabledWrapper,
            disabledComponent,
            disabledDynamic,
            disabledPartial,
            items,
            itemsComponent,
            itemsDynamic,
            itemsPartial,
            currentItemSet,
            toggleDisabled,
            toggleDisabledWrapper,
            toggleDisabledComponent,
            toggleDisabledDynamic,
            toggleDisabledPartial,
            changeItems,
            addItems,
            removeItems,
            insertItems,
            resetPartialItems,
        };
    },
});
</script>

<style scoped>
@reference 'tailwindcss';
.app {
    @apply mx-auto w-full max-w-4xl p-8;
}

.example-section {
    @apply mb-12;
}

.example-section h2 {
    @apply mb-4 text-xl font-bold;
}

.controls {
    @apply mb-4 flex flex-wrap gap-2;
}

.info-text {
    @apply mb-2 text-sm text-gray-600;
}
.fixed-height-component {
    border: 2px solid #3b82f6;
    border-radius: 8px;
    padding: 16px;
    background-color: #eff6ff;
}
</style>
