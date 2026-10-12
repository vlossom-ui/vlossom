// README 예제가 선언하지 않고 쓰는 이름을 컴포넌트별로 채운다. README가 선언한 이름이 항상 먼저다.
export const DEMO_SCOPE: Record<string, string> = {
    'vs-button': `
function handleClick() {}

function doSomething() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
}
`,
    'vs-input': `
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const count = ref(0);
const value = ref('');
`,
};
