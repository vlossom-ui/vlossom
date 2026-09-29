// README 예제가 참조하지만 예제 안에서 선언하지 않는 변수들.
//
// README는 MCP가 파싱하는 계약 문서라 건드리지 않는다. 그래서 데모를 굴리는 데
// 필요한 상태는 여기에 모아두고, 문서 페이지 상단에 <script setup>으로 주입한다.
//
// 주의: 한 페이지가 스코프 하나를 공유한다. 같은 이름을 쓰는 예제끼리는 상태가
// 같이 움직인다 (vs-input의 `value`가 그렇다).

export const DEMO_SCOPE: Record<string, string> = {
    'vs-button': `
import { ref } from 'vue';

const isLoading = ref(false);

function handleClick() {
    // 데모용 no-op
}

function submit() {
    isLoading.value = true;
    setTimeout(() => (isLoading.value = false), 1200);
}
`.trim(),

    'vs-input': `
import { ref } from 'vue';

const text = ref('');
const email = ref('');
const password = ref('');
const count = ref(0);
const value = ref('');
`.trim(),
};
