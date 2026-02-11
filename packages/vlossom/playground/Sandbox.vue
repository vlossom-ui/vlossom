<template>
    <div class="sandbox-container">
        <h1>fit-content 브라우저 호환성 테스트</h1>

        <section class="test-section">
            <h2>1. width: fit-content 테스트</h2>
            <div class="test-row">
                <div class="test-box fit-content-width">
                    <p>짧은 텍스트</p>
                </div>
                <div class="test-box fit-content-width">
                    <p>이것은 조금 더 긴 텍스트입니다. 박스가 콘텐츠에 맞춰 늘어나야 합니다.</p>
                </div>
                <div class="test-box fit-content-width">
                    <p>매우 긴 텍스트입니다. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>2. height: fit-content 테스트</h2>
            <div class="test-row">
                <div class="test-box fit-content-height" style="width: 200px">
                    <p>한 줄</p>
                </div>
                <div class="test-box fit-content-height" style="width: 200px">
                    <p>여러 줄의 텍스트가 있습니다.</p>
                    <p>두 번째 단락입니다.</p>
                </div>
                <div class="test-box fit-content-height" style="width: 200px">
                    <p>더 많은 콘텐츠가 있습니다.</p>
                    <p>두 번째 줄</p>
                    <p>세 번째 줄</p>
                    <p>네 번째 줄</p>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>3. width + height 모두 fit-content 테스트</h2>
            <div class="test-row">
                <div class="test-box fit-content-both">
                    <p>짧은 콘텐츠</p>
                </div>
                <div class="test-box fit-content-both">
                    <p>조금 더 긴 콘텐츠입니다.</p>
                    <p>두 번째 줄이 있습니다.</p>
                </div>
                <div class="test-box fit-content-both">
                    <button>버튼</button>
                    <input type="text" placeholder="입력 필드" />
                    <p>다양한 요소들</p>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>4. VsModal 시뮬레이션 (CSS Variables 사용)</h2>
            <div class="test-row">
                <div class="modal-simulation small-content">
                    <h3>작은 모달</h3>
                    <p>짧은 콘텐츠</p>
                </div>
                <div class="modal-simulation medium-content">
                    <h3>중간 모달</h3>
                    <p>이것은 중간 크기의 콘텐츠입니다.</p>
                    <button>버튼 1</button>
                    <button>버튼 2</button>
                </div>
                <div class="modal-simulation large-content">
                    <h3>큰 모달</h3>
                    <p>
                        이것은 더 많은 콘텐츠를 포함하는 큰 모달입니다. Lorem ipsum dolor sit amet,
                        consectetur adipiscing elit.
                    </p>
                    <ul>
                        <li>항목 1</li>
                        <li>항목 2</li>
                        <li>항목 3</li>
                    </ul>
                    <button>확인</button>
                    <button>취소</button>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>5. 비교: fit-content vs auto vs 고정 크기</h2>
            <div class="test-comparison">
                <div class="comparison-item">
                    <h4>fit-content</h4>
                    <div class="test-box fit-content-both">
                        <p>동적 크기</p>
                    </div>
                </div>
                <div class="comparison-item">
                    <h4>auto</h4>
                    <div class="test-box auto-size">
                        <p>동적 크기</p>
                    </div>
                </div>
                <div class="comparison-item">
                    <h4>고정 크기 (200px)</h4>
                    <div class="test-box fixed-size">
                        <p>고정 크기</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>6. max-content / min-content 비교</h2>
            <div class="test-comparison">
                <div class="comparison-item">
                    <h4>fit-content</h4>
                    <div class="test-box fit-content-width">
                        <p>긴 텍스트가 있는 박스입니다</p>
                    </div>
                </div>
                <div class="comparison-item">
                    <h4>max-content</h4>
                    <div class="test-box max-content-width">
                        <p>긴 텍스트가 있는 박스입니다</p>
                    </div>
                </div>
                <div class="comparison-item">
                    <h4>min-content</h4>
                    <div class="test-box min-content-width">
                        <p>긴 텍스트가 있는 박스입니다</p>
                    </div>
                </div>
            </div>
        </section>

        <section class="test-section">
            <h2>7. 브라우저 정보</h2>
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

export default defineComponent({
    name: 'Sandbox',
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

        return {
            userAgent,
            supportsFeature,
        };
    },
});
</script>

<style scoped>
.sandbox-container {
    padding: 2rem;
    font-family: system-ui, -apple-system, sans-serif;
}

h1 {
    margin-bottom: 2rem;
    color: #333;
}

h2 {
    margin-top: 2rem;
    margin-bottom: 1rem;
    color: #555;
    border-bottom: 2px solid #ddd;
    padding-bottom: 0.5rem;
}

.test-section {
    margin-bottom: 3rem;
}

.test-row {
    display: flex;
    gap: 1rem;
    flex-wrap: wrap;
    margin-top: 1rem;
}

.test-box {
    border: 2px solid #4caf50;
    padding: 1rem;
    background-color: #f0f8f0;
    position: relative;
}

.test-box::before {
    content: attr(class);
    position: absolute;
    top: -10px;
    left: 10px;
    background-color: #4caf50;
    color: white;
    padding: 2px 8px;
    font-size: 10px;
    border-radius: 3px;
}

/* fit-content 테스트 */
.fit-content-width {
    width: fit-content;
    width: -webkit-fit-content;
    width: -moz-fit-content;
}

.fit-content-height {
    height: fit-content;
    height: -webkit-fit-content;
    height: -moz-fit-content;
}

.fit-content-both {
    width: fit-content;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    height: fit-content;
    height: -webkit-fit-content;
    height: -moz-fit-content;
}

/* max-content / min-content */
.max-content-width {
    width: max-content;
    width: -webkit-max-content;
    width: -moz-max-content;
}

.min-content-width {
    width: min-content;
    width: -webkit-min-content;
    width: -moz-min-content;
}

/* 비교용 */
.auto-size {
    width: auto;
    height: auto;
}

.fixed-size {
    width: 200px;
    height: 100px;
}

/* VsModal 시뮬레이션 */
.modal-simulation {
    --vs-modal-node-width: fit-content;
    --vs-modal-node-height: fit-content;

    width: var(--vs-modal-node-width, fit-content);
    height: var(--vs-modal-node-height, fit-content);
    border: 3px solid #2196f3;
    background-color: white;
    padding: 1.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    border-radius: 8px;
}

.modal-simulation h3 {
    margin-top: 0;
    color: #2196f3;
}

.modal-simulation button {
    margin: 0.5rem 0.5rem 0 0;
    padding: 0.5rem 1rem;
    background-color: #2196f3;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

.modal-simulation input {
    display: block;
    margin: 0.5rem 0;
    padding: 0.5rem;
    border: 1px solid #ddd;
    border-radius: 4px;
}

/* 비교 섹션 */
.test-comparison {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 2rem;
    margin-top: 1rem;
}

.comparison-item {
    text-align: center;
}

.comparison-item h4 {
    margin-bottom: 1rem;
    color: #666;
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
}

.browser-info ul {
    list-style: none;
    padding-left: 0;
}

.browser-info li {
    padding: 0.5rem 0;
    border-bottom: 1px solid #ddd;
}

.browser-info li:last-child {
    border-bottom: none;
}
</style>
