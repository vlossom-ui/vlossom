<template>
    <div style="padding: 40px; font-family: sans-serif">
        <h1>VsCheckbox Focus/Blur 테스트</h1>

        <div style="margin: 30px 0; padding: 20px; border: 2px solid #ccc; border-radius: 8px">
            <h2>단일 체크박스 테스트</h2>
            <vs-checkbox
                ref="checkboxRef"
                v-model="checked"
                check-label="포커스 테스트 체크박스"
                @focus="onFocus"
                @blur="onBlur"
            />

            <div style="margin-top: 20px">
                <button @click="focusCheckbox" style="padding: 8px 16px; margin-right: 10px">체크박스에 포커스</button>
                <button @click="blurCheckbox" style="padding: 8px 16px">체크박스 블러</button>
            </div>

            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px">
                <strong>상태:</strong> {{ checked ? '체크됨' : '체크 안됨' }}<br />
                <strong>Focus 횟수:</strong> {{ focusCount }}<br />
                <strong>Blur 횟수:</strong> {{ blurCount }}
            </div>
        </div>

        <div style="margin: 30px 0; padding: 20px; border: 2px solid #ccc; border-radius: 8px">
            <h2>체크박스 세트 테스트</h2>
            <vs-checkbox-set
                ref="checkboxSetRef"
                v-model="selectedOptions"
                :options="options"
                option-label="label"
                option-value="value"
                @focus="onSetFocus"
                @blur="onSetBlur"
            />

            <div style="margin-top: 20px">
                <button @click="focusCheckboxSet" style="padding: 8px 16px; margin-right: 10px">
                    첫 번째 체크박스에 포커스
                </button>
            </div>

            <div style="margin-top: 20px; padding: 10px; background: #f0f0f0; border-radius: 4px">
                <strong>선택된 옵션:</strong> {{ selectedOptions.join(', ') || '없음' }}<br />
                <strong>Set Focus 횟수:</strong> {{ setFocusCount }}<br />
                <strong>Set Blur 횟수:</strong> {{ setBlurCount }}<br />
                <strong>마지막 이벤트 옵션:</strong> {{ lastEventOption }}
            </div>
        </div>

        <div style="margin-top: 20px; padding: 20px; background: #e8f5e9; border-radius: 8px">
            <h3>✅ 브라우저 개발자 도구 확인 방법</h3>
            <ol>
                <li>F12를 눌러 개발자 도구 열기</li>
                <li>Console 탭에서 focus/blur 이벤트 로그 확인</li>
                <li>Elements 탭에서 실제 DOM의 :focus 상태 확인</li>
                <li>위 버튼들을 클릭하거나 Tab 키로 포커스 이동 테스트</li>
            </ol>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { VsCheckbox, VsCheckboxSet } from '@/components';

const checkboxRef = ref<InstanceType<typeof VsCheckbox>>();
const checkboxSetRef = ref<InstanceType<typeof VsCheckboxSet>>();

const checked = ref(false);
const focusCount = ref(0);
const blurCount = ref(0);

const selectedOptions = ref<string[]>([]);
const setFocusCount = ref(0);
const setBlurCount = ref(0);
const lastEventOption = ref('');

const options = [
    { label: '옵션 1', value: 'opt1' },
    { label: '옵션 2', value: 'opt2' },
    { label: '옵션 3', value: 'opt3' },
];

function onFocus(event: FocusEvent) {
    focusCount.value++;
    console.log('✅ VsCheckbox Focus Event:', event);
    console.log('   Active Element:', document.activeElement);
}

function onBlur(event: FocusEvent) {
    blurCount.value++;
    console.log('❌ VsCheckbox Blur Event:', event);
}

function onSetFocus(option: any, event: FocusEvent) {
    setFocusCount.value++;
    lastEventOption.value = option.label;
    console.log('✅ VsCheckboxSet Focus Event:', { option, event });
}

function onSetBlur(option: any, event: FocusEvent) {
    setBlurCount.value++;
    lastEventOption.value = option.label;
    console.log('❌ VsCheckboxSet Blur Event:', { option, event });
}

function focusCheckbox() {
    checkboxRef.value?.focus();
    console.log('🎯 프로그래매틱 Focus 호출');
}

function blurCheckbox() {
    checkboxRef.value?.blur();
    console.log('🎯 프로그래매틱 Blur 호출');
}

function focusCheckboxSet() {
    checkboxSetRef.value?.focus();
    console.log('🎯 VsCheckboxSet 프로그래매틱 Focus 호출');
}
</script>

<style scoped>
button {
    cursor: pointer;
    border: 1px solid #333;
    border-radius: 4px;
    background: white;
    transition: all 0.2s;
}

button:hover {
    background: #f5f5f5;
}

button:active {
    background: #e0e0e0;
}
</style>
