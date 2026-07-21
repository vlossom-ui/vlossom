<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <div class="sandbox">
            <h1 class="mb-2 text-2xl font-semibold">Sandbox</h1>
            <p class="mb-6 text-sm text-gray-500">
                이슈 #583 재현 (body 대상): scroll-lock이 body를 잠글 때, 문서에 세로 스크롤이 없어도 스크롤바
                폭(8px)만큼 padding-right가 붙어 화면 전체가 왼쪽으로 밀리는 버그입니다.
            </p>

            <!-- 뷰포트 오른쪽 가장자리와 비교하는 기준 바 -->
            <div class="ruler-bar">← 이 바의 오른쪽 끝을 뷰포트 오른쪽 가장자리와 비교하세요 →</div>

            <vs-block class="mb-4">
                <div class="flex flex-wrap items-center gap-4">
                    <vs-switch v-model="scrollable" label="문서(body) 세로 스크롤 발생" no-messages />
                    <vs-button @click="modalOpen = true">scroll-lock 모달 열기 (body)</vs-button>
                </div>
                <p class="mt-2 text-xs text-gray-500">
                    스위치를 끈 상태(스크롤 없음)에서 모달을 열면 body에 padding-right 8px가 붙어 화면이 왼쪽으로
                    밀립니다. 스위치를 켠 상태(스크롤 있음)에서는 스크롤바가 사라진 자리를 8px가 보정합니다.
                </p>
            </vs-block>

            <!-- document.body에서 실시간으로 읽은 지표 -->
            <div class="mb-4 w-full md:w-96">
                <div class="mb-1 text-xs font-semibold text-gray-500">measured (document.body)</div>
                <table class="w-full border-collapse text-sm">
                    <tbody>
                        <tr class="border-b">
                            <td class="py-1 pr-2 text-gray-500">scrollHeight</td>
                            <td class="py-1 text-right font-mono">{{ metrics.scrollHeight }}</td>
                        </tr>
                        <tr class="border-b">
                            <td class="py-1 pr-2 text-gray-500">clientHeight</td>
                            <td class="py-1 text-right font-mono">{{ metrics.clientHeight }}</td>
                        </tr>
                        <tr class="border-b">
                            <td class="py-1 pr-2 text-gray-500">offsetHeight</td>
                            <td class="py-1 text-right font-mono">{{ metrics.offsetHeight }}</td>
                        </tr>
                        <tr class="border-b">
                            <td class="py-1 pr-2 text-gray-500">페이지 스크롤 (documentElement)</td>
                            <td class="py-1 text-right font-mono">{{ metrics.hasPageScroll ? '있음' : '없음' }}</td>
                        </tr>
                        <tr class="border-b">
                            <td class="py-1 pr-2 text-gray-500">body.style.overflow</td>
                            <td class="py-1 text-right font-mono">{{ metrics.overflow }}</td>
                        </tr>
                        <tr>
                            <td class="py-1 pr-2 text-gray-500">body.style.paddingRight</td>
                            <td class="py-1 text-right font-mono" :class="isBuggyPadding ? 'font-bold text-red-500' : ''">
                                {{ metrics.paddingRight }}
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p v-if="isBuggyPadding" class="mt-2 text-xs font-semibold text-red-500">
                    ⚠ 페이지에 스크롤이 없는데 body.paddingRight가 붙었습니다 (이슈 #583).
                </p>
            </div>

            <!-- 문서(body) 스크롤 유발 -->
            <div v-if="scrollable" class="spacer" :style="{ height: '150vh' }">
                <span class="text-xs text-gray-400">spacer (150vh) — 문서 스크롤 유발</span>
            </div>

            <vs-modal v-model="modalOpen" :scroll-lock="true" :size="{ width: '480px', height: 'auto' }">
                <div class="p-8">
                    <h3 class="mb-4 text-lg font-semibold">scroll-lock 모달 (body)</h3>
                    <p class="mb-4 text-sm">
                        이 모달이 열려 있는 동안 body에 scroll-lock이 적용됩니다. 화면 오른쪽 여백과 지표의 paddingRight
                        값을 확인하세요.
                    </p>
                    <vs-button @click="modalOpen = false">닫기</vs-button>
                </div>
            </vs-modal>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref, reactive, computed, onActivated, onDeactivated, onUnmounted } from 'vue';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const modalOpen = ref(false);
        const scrollable = ref(false);

        const metrics = reactive({
            scrollHeight: 0,
            clientHeight: 0,
            offsetHeight: 0,
            paddingRight: '(none)',
            overflow: '(default)',
            hasPageScroll: false,
        });

        // 페이지에 스크롤이 없는데 body에 8px 패딩이 붙은 상태 = 이슈 #583
        const isBuggyPadding = computed(() => metrics.paddingRight === '8px' && !metrics.hasPageScroll);

        // scroll-lock은 인라인 스타일을 동기적으로 바꾸므로 rAF로 폴링해 값을 갱신한다
        let rafId = 0;
        function measure() {
            const body = document.body;
            const doc = document.documentElement;
            if (body) {
                metrics.scrollHeight = body.scrollHeight;
                metrics.clientHeight = body.clientHeight;
                metrics.offsetHeight = body.offsetHeight;
                metrics.paddingRight = body.style.paddingRight || '(none)';
                metrics.overflow = body.style.overflow || '(default)';
            }
            // 실제 페이지 스크롤 유무는 문서(documentElement) 기준으로 판단한다
            metrics.hasPageScroll = doc.scrollHeight > doc.clientHeight;
            rafId = requestAnimationFrame(measure);
        }

        function stop() {
            if (rafId) {
                cancelAnimationFrame(rafId);
                rafId = 0;
            }
        }

        // Sandbox는 keep-alive 탭이므로 활성/비활성 시점에 폴링을 켜고 끈다
        onActivated(() => {
            stop();
            rafId = requestAnimationFrame(measure);
        });
        onDeactivated(stop);
        onUnmounted(stop);

        return {
            modalOpen,
            scrollable,
            metrics,
            isBuggyPadding,
        };
    },
});
</script>

<style scoped>
.ruler-bar {
    width: 100%;
    padding: 4px 8px;
    margin-bottom: 1rem;
    font-size: 12px;
    color: white;
    text-align: center;
    background-color: #60a5fa;
}

.spacer {
    display: flex;
    align-items: flex-start;
    justify-content: center;
    margin-top: 1rem;
    border: 1px dashed #9ca3af;
}
</style>
