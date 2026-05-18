<template>
    <vs-page class="mb-8" :style-set="{ padding: '1.5rem' }">
        <div class="sandbox">
            <h1 class="mb-6 text-2xl font-bold">VsTooltip Sandbox</h1>

            <!-- 1. Slot mode: 기본 (target 없음, default slot에 trigger 감싸기) -->
            <section class="mb-12">
                <h2 class="mb-4 text-lg font-semibold">1. Slot mode (target 없음)</h2>
                <p class="mb-3 text-sm text-gray-500">
                    target 없이 default slot으로 trigger를 감싸는 모드. 다양한 placement 조합.
                </p>
                <div class="flex flex-wrap items-center gap-4">
                    <vs-tooltip placement="top">
                        <vs-button>top</vs-button>
                        <template #tooltip>Top placement</template>
                    </vs-tooltip>

                    <vs-tooltip placement="bottom">
                        <vs-button>bottom</vs-button>
                        <template #tooltip>Bottom placement</template>
                    </vs-tooltip>

                    <vs-tooltip placement="left">
                        <vs-button>left</vs-button>
                        <template #tooltip>Left placement</template>
                    </vs-tooltip>

                    <vs-tooltip placement="right">
                        <vs-button>right</vs-button>
                        <template #tooltip>Right placement</template>
                    </vs-tooltip>
                </div>
            </section>

            <!-- 2. Slot mode: align 조합 -->
            <section class="mb-12">
                <h2 class="mb-4 text-lg font-semibold">2. Align variations</h2>
                <p class="mb-3 text-sm text-gray-500">placement=top + align: start / center / end</p>
                <div class="flex flex-wrap items-center gap-4">
                    <vs-tooltip placement="top" align="start">
                        <vs-button style-set="{ width: '14rem' }">top + start</vs-button>
                        <template #tooltip>start aligned</template>
                    </vs-tooltip>

                    <vs-tooltip placement="top" align="center">
                        <vs-button style-set="{ width: '14rem' }">top + center</vs-button>
                        <template #tooltip>center aligned</template>
                    </vs-tooltip>

                    <vs-tooltip placement="top" align="end">
                        <vs-button style-set="{ width: '14rem' }">top + end</vs-button>
                        <template #tooltip>end aligned</template>
                    </vs-tooltip>
                </div>

                <p class="mt-6 mb-3 text-sm text-gray-500">placement=right + align: start / center / end</p>
                <div class="flex flex-col items-start gap-2">
                    <vs-tooltip placement="right" align="start">
                        <vs-button>right + start</vs-button>
                        <template #tooltip>start aligned</template>
                    </vs-tooltip>

                    <vs-tooltip placement="right" align="center">
                        <vs-button>right + center</vs-button>
                        <template #tooltip>center aligned</template>
                    </vs-tooltip>

                    <vs-tooltip placement="right" align="end">
                        <vs-button>right + end</vs-button>
                        <template #tooltip>end aligned</template>
                    </vs-tooltip>
                </div>
            </section>

            <!-- 3. Target mode -->
            <section class="mb-12">
                <h2 class="mb-4 text-lg font-semibold">3. Target mode (외부 selector 지정)</h2>
                <p class="mb-3 text-sm text-gray-500">target prop으로 selector를 지정하면 해당 요소에 붙음.</p>
                <div class="flex flex-wrap items-center gap-4">
                    <button id="external-target-1" class="rounded border px-3 py-2">#external-target-1</button>
                    <button id="external-target-2" class="rounded border px-3 py-2">#external-target-2</button>
                </div>

                <vs-tooltip target="#external-target-1" placement="bottom" align="start">
                    <template #tooltip>외부 버튼에 attached (bottom + start)</template>
                </vs-tooltip>

                <vs-tooltip target="#external-target-2" placement="right" align="center">
                    <template #tooltip>외부 버튼에 attached (right + center)</template>
                </vs-tooltip>
            </section>

            <!-- 4. Tag prop variation -->
            <section class="mb-12">
                <h2 class="mb-4 text-lg font-semibold">4. Wrapper tag 변경</h2>
                <p class="mb-3 text-sm text-gray-500">tag prop으로 wrapper 엘리먼트 변경 (기본 span).</p>
                <div class="flex flex-wrap items-center gap-4">
                    <vs-tooltip placement="top" tag="span">
                        <span class="underline decoration-dotted">span wrapper (inline)</span>
                        <template #tooltip>span으로 감쌈</template>
                    </vs-tooltip>

                    <vs-tooltip placement="bottom" tag="div">
                        <div class="rounded bg-gray-100 px-3 py-2 dark:bg-gray-700">div wrapper (block)</div>
                        <template #tooltip>div로 감쌈</template>
                    </vs-tooltip>
                </div>
            </section>

            <!-- 5. Behavior options -->
            <section class="mb-12">
                <h2 class="mb-4 text-lg font-semibold">5. Behavior options</h2>
                <div class="flex flex-wrap items-center gap-4">
                    <vs-tooltip placement="top" clickable>
                        <vs-button>clickable</vs-button>
                        <template #tooltip>클릭해서 토글</template>
                    </vs-tooltip>

                    <vs-tooltip placement="top" contents-hover>
                        <vs-button>contentsHover</vs-button>
                        <template #tooltip>
                            <span>툴팁 위에 마우스 올려도 유지됨</span>
                        </template>
                    </vs-tooltip>

                    <vs-tooltip placement="top" :enter-delay="500" :leave-delay="300">
                        <vs-button>delay (500ms / 300ms)</vs-button>
                        <template #tooltip>enter/leave delay 적용</template>
                    </vs-tooltip>
                </div>
            </section>

            <!-- 6. Grid showcase: 4 placements × 3 aligns = 12 -->
            <section class="mb-12">
                <h2 class="mb-4 text-lg font-semibold">6. 전체 조합 (4 placements × 3 aligns)</h2>
                <div class="grid grid-cols-3 gap-6">
                    <template v-for="placement in placements" :key="placement">
                        <vs-tooltip
                            v-for="align in alignments"
                            :key="`${placement}-${align}`"
                            :placement
                            :align
                        >
                            <vs-button style-set="{ width: '12rem' }">
                                {{ placement }} / {{ align }}
                            </vs-button>
                            <template #tooltip>{{ placement }} + {{ align }}</template>
                        </vs-tooltip>
                    </template>
                </div>
            </section>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import type { Placement, Alignment } from '@/declaration';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const placements: Exclude<Placement, 'middle'>[] = ['top', 'bottom', 'left', 'right'];
        const alignments: Alignment[] = ['start', 'center', 'end'];

        return {
            placements,
            alignments,
        };
    },
});
</script>
