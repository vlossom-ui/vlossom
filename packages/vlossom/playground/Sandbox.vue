<template>
    <div class="sandbox-container">
        <h1>VsModal fit-content 속성 테스트</h1>

        <section class="test-section">
            <h2>1. VsModalNode: width fit-content 테스트</h2>
            <p class="description">width만 fit-content로 설정하여 콘텐츠 너비에 맞춰 조절됩니다.</p>
            <div class="test-row">
                <div class="modal-wrapper">
                    <vs-modal-node :size="{ width: 'fit-content', height: '200px' }" :dimmed="false">
                        <div class="modal-content">
                            <h3>짧은 제목</h3>
                            <p>짧은 텍스트</p>
                        </div>
                    </vs-modal-node>
                </div>
                <div class="modal-wrapper">
                    <vs-modal-node :size="{ width: 'fit-content', height: '200px' }" :dimmed="false">
                        <div class="modal-content">
                            <h3>중간 길이 제목</h3>
                            <p>이것은 조금 더 긴 텍스트입니다. 모달이 콘텐츠에 맞춰 늘어나야 합니다.</p>
                        </div>
                    </vs-modal-node>
                </div>
                <div class="modal-wrapper">
                    <vs-modal-node :size="{ width: 'fit-content', height: '200px' }" :dimmed="false">
                        <div class="modal-content">
                            <h3>매우 긴 제목이 있는 모달</h3>
                            <p>
                                매우 긴 텍스트입니다. Lorem ipsum dolor sit amet, consectetur adipiscing
                                elit. 모달의 너비가 콘텐츠에 맞춰 확장됩니다.
                            </p>
                        </div>
                    </vs-modal-node>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>2. VsModalNode: height fit-content 테스트</h2>
            <p class="description">height만 fit-content로 설정하여 콘텐츠 높이에 맞춰 조절됩니다.</p>
            <div class="test-row">
                <div class="modal-wrapper">
                    <vs-modal-node :size="{ width: '300px', height: 'fit-content' }" :dimmed="false">
                        <div class="modal-content">
                            <h3>한 줄</h3>
                            <p>짧은 콘텐츠</p>
                        </div>
                    </vs-modal-node>
                </div>
                <div class="modal-wrapper">
                    <vs-modal-node :size="{ width: '300px', height: 'fit-content' }" :dimmed="false">
                        <div class="modal-content">
                            <h3>여러 줄</h3>
                            <p>여러 줄의 텍스트가 있습니다.</p>
                            <p>두 번째 단락입니다.</p>
                            <p>세 번째 단락입니다.</p>
                        </div>
                    </vs-modal-node>
                </div>
                <div class="modal-wrapper">
                    <vs-modal-node :size="{ width: '300px', height: 'fit-content' }" :dimmed="false">
                        <div class="modal-content">
                            <h3>많은 콘텐츠</h3>
                            <p>더 많은 콘텐츠가 있습니다.</p>
                            <p>두 번째 줄</p>
                            <p>세 번째 줄</p>
                            <p>네 번째 줄</p>
                            <p>다섯 번째 줄</p>
                        </div>
                    </vs-modal-node>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>3. VsModalNode: width + height 모두 fit-content 테스트</h2>
            <p class="description">width와 height 모두 fit-content로 설정하여 콘텐츠에 완전히 맞춰집니다.</p>
            <div class="test-row">
                <div class="modal-wrapper">
                    <vs-modal-node :size="{ width: 'fit-content', height: 'fit-content' }" :dimmed="false">
                        <div class="modal-content">
                            <h3>작은 모달</h3>
                            <p>짧은 콘텐츠</p>
                        </div>
                    </vs-modal-node>
                </div>
                <div class="modal-wrapper">
                    <vs-modal-node :size="{ width: 'fit-content', height: 'fit-content' }" :dimmed="false">
                        <div class="modal-content">
                            <h3>중간 모달</h3>
                            <p>조금 더 긴 콘텐츠입니다.</p>
                            <p>두 번째 줄이 있습니다.</p>
                            <button>버튼 1</button>
                            <button>버튼 2</button>
                        </div>
                    </vs-modal-node>
                </div>
                <div class="modal-wrapper">
                    <vs-modal-node :size="{ width: 'fit-content', height: 'fit-content' }" :dimmed="false">
                        <div class="modal-content">
                            <h3>큰 모달</h3>
                            <p>더 많은 콘텐츠를 포함합니다.</p>
                            <button>버튼</button>
                            <input type="text" placeholder="입력 필드" />
                            <ul>
                                <li>항목 1</li>
                                <li>항목 2</li>
                                <li>항목 3</li>
                            </ul>
                        </div>
                    </vs-modal-node>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>4. VsModalNode: StyleSet을 통한 fit-content 테스트</h2>
            <p class="description">styleSet prop을 사용하여 fit-content를 직접 설정합니다.</p>
            <div class="test-row">
                <div class="modal-wrapper">
                    <vs-modal-node :style-set="fitContentStyleSet" :dimmed="false">
                        <div class="modal-content">
                            <h3>StyleSet 사용</h3>
                            <p>styleSet prop으로 fit-content 설정</p>
                        </div>
                    </vs-modal-node>
                </div>
                <div class="modal-wrapper">
                    <vs-modal-node :style-set="fitContentStyleSet" :dimmed="false">
                        <div class="modal-content">
                            <h3>더 긴 콘텐츠</h3>
                            <p>여러 줄의 텍스트가 있습니다.</p>
                            <p>두 번째 단락입니다.</p>
                            <button>확인</button>
                            <button>취소</button>
                        </div>
                    </vs-modal-node>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>5. VsModalNode: 비교 (fit-content vs 고정 크기 vs 반응형 크기)</h2>
            <p class="description">다양한 크기 설정 방식을 비교합니다.</p>
            <div class="test-comparison">
                <div class="comparison-item">
                    <h4>fit-content</h4>
                    <div class="modal-wrapper">
                        <vs-modal-node :size="{ width: 'fit-content', height: 'fit-content' }" :dimmed="false">
                            <div class="modal-content">
                                <h3>동적 크기</h3>
                                <p>콘텐츠에 맞춰 크기 조절</p>
                            </div>
                        </vs-modal-node>
                    </div>
                </div>
                <div class="comparison-item">
                    <h4>고정 크기 (300px × 200px)</h4>
                    <div class="modal-wrapper">
                        <vs-modal-node :size="{ width: '300px', height: '200px' }" :dimmed="false">
                            <div class="modal-content">
                                <h3>고정 크기</h3>
                                <p>300px × 200px 고정</p>
                            </div>
                        </vs-modal-node>
                    </div>
                </div>
                <div class="comparison-item">
                    <h4>반응형 크기 (md)</h4>
                    <div class="modal-wrapper">
                        <vs-modal-node :size="'md'" :dimmed="false">
                            <div class="modal-content">
                                <h3>반응형 크기</h3>
                                <p>md 사이즈 (45% × 50%)</p>
                            </div>
                        </vs-modal-node>
                    </div>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>6. 브라우저 정보 및 CSS 지원 확인</h2>
            <div class="browser-info">
                <p><strong>User Agent:</strong> {{ userAgent }}</p>
                <p><strong>CSS 지원 테스트:</strong></p>
                <ul>
                    <li>fit-content: {{ supportsFeature('fit-content') }}</li>
                    <li>max-content: {{ supportsFeature('max-content') }}</li>
                    <li>min-content: {{ supportsFeature('min-content') }}</li>
                </ul>
            </div>
        </section>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import VsModalNode from '@/components/vs-modal/VsModalNode.vue';
import type { VsModalNodeStyleSet } from '@/components/vs-modal/types';

export default defineComponent({
    name: 'Sandbox',
    components: {
        VsModalNode,
    },
    setup() {
        const userAgent = ref('');

        onMounted(() => {
            userAgent.value = navigator.userAgent;
        });

        const supportsFeature = (value: string) => {
            if (typeof CSS === 'undefined' || !CSS.supports) {
                return '❓ (CSS.supports 미지원)';
            }

            const supported = CSS.supports('width', value) || CSS.supports('width', `-webkit-${value}`);
            return supported ? '✅ 지원됨' : '❌ 미지원';
        };

        const fitContentStyleSet: VsModalNodeStyleSet = {
            width: 'fit-content',
            height: 'fit-content',
            backgroundColor: '#ffffff',
            border: '2px solid #4caf50',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
            padding: '1.5rem',
        };

        return {
            userAgent,
            supportsFeature,
            fitContentStyleSet,
        };
    },
});
</script>

<style scoped>
.sandbox-container {
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
    background-color: #fafafa;
    min-height: 100vh;
}

h1 {
    margin-bottom: 2rem;
    color: #333;
    font-size: 2rem;
    text-align: center;
}

h2 {
    margin-top: 2rem;
    margin-bottom: 0.5rem;
    color: #555;
    border-bottom: 2px solid #ddd;
    padding-bottom: 0.5rem;
    font-size: 1.5rem;
}

.description {
    color: #666;
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    font-size: 0.95rem;
}

.test-section {
    margin-bottom: 4rem;
    background-color: white;
    padding: 2rem;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.test-row {
    display: flex;
    gap: 1.5rem;
    flex-wrap: wrap;
    margin-top: 1.5rem;
}

.modal-wrapper {
    position: relative;
    min-height: 250px;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #f5f5f5;
    border: 2px dashed #ccc;
    border-radius: 8px;
    padding: 1rem;
}

.modal-content {
    padding: 1rem;
}

.modal-content h3 {
    margin-top: 0;
    margin-bottom: 0.75rem;
    color: #333;
    font-size: 1.1rem;
}

.modal-content p {
    margin: 0.5rem 0;
    color: #555;
    line-height: 1.5;
}

.modal-content button {
    margin: 0.5rem 0.5rem 0 0;
    padding: 0.5rem 1rem;
    background-color: #4caf50;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: background-color 0.2s;
}

.modal-content button:hover {
    background-color: #45a049;
}

.modal-content input {
    display: block;
    margin: 0.5rem 0;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    width: 100%;
    box-sizing: border-box;
}

.modal-content ul {
    margin: 0.5rem 0;
    padding-left: 1.5rem;
}

.modal-content li {
    margin: 0.25rem 0;
    color: #555;
}

/* 비교 섹션 */
.test-comparison {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
    margin-top: 1.5rem;
}

.comparison-item {
    text-align: center;
}

.comparison-item h4 {
    margin-bottom: 1rem;
    color: #666;
    font-size: 1rem;
    font-weight: 600;
}

.comparison-item .modal-wrapper {
    min-height: 300px;
}

/* 브라우저 정보 */
.browser-info {
    background-color: #f5f5f5;
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.browser-info p {
    margin: 0.5rem 0;
    word-break: break-all;
    color: #555;
}

.browser-info strong {
    color: #333;
}

.browser-info ul {
    list-style: none;
    padding-left: 0;
    margin-top: 1rem;
}

.browser-info li {
    padding: 0.75rem;
    border-bottom: 1px solid #ddd;
    background-color: white;
    margin-bottom: 0.5rem;
    border-radius: 4px;
}

.browser-info li:last-child {
    border-bottom: none;
}
</style>
