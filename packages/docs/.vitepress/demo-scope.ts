// README 예제가 참조하지만 예제 안에서 선언하지 않는 변수들.
//
// README는 MCP가 파싱하는 계약 문서라 건드리지 않는다. 그래서 데모를 굴리는 데
// 필요한 상태는 여기에 모아두고, 문서 페이지 상단에 <script setup>으로 주입한다.
//
// 이 선언들은 펜스가 들고 있는 <script setup>보다 **먼저** 합쳐진다.
// 같은 이름이면 여기가 이긴다. README 예제 중에는 정의되지 않은 함수를 부르는 것들이
// 있어서(예: VsButton의 `await doSomething()`) 덮어쓸 수단이 필요하다.
//
// 주의: 한 페이지가 스코프 하나를 공유한다. 같은 이름을 쓰는 예제끼리는 상태가
// 같이 움직인다.

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
`,

    'vs-checkbox': `
import { ref } from 'vue';

const agreed = ref(false);
`,

    'vs-chip': `
function removeChip() {
    // 데모용 no-op
}
`,

    'vs-date-picker': `
import { ref } from 'vue';

const datetime = ref('2026-05-18T15:30');
const time = ref('15:30');
const month = ref('2026-05');
const type = ref('date');
`,

    'vs-file-input': `
import { ref } from 'vue';

const formRef = ref(null);
`,

    'vs-floating': `
import { ref } from 'vue';

const visible = ref(false);
`,

    'vs-form': `
import { ref } from 'vue';

const firstName = ref('');
const lastName = ref('');
`,

    'vs-grid': `
const items = [
    { id: 1, name: 'Apple' },
    { id: 2, name: 'Banana' },
    { id: 3, name: 'Cherry' },
    { id: 4, name: 'Durian' },
];
`,

    'vs-grouped-list': `
const longList = Array.from({ length: 30 }, (_, index) => ({
    id: String(index + 1),
    label: \`Item \${index + 1}\`,
    item: { category: index % 2 === 0 ? 'fruit' : 'vegetable' },
}));

function handleClick() {
    // 데모용 no-op
}
`,

    'vs-input': `
import { ref } from 'vue';

const text = ref('');
const email = ref('');
const password = ref('');
const count = ref(0);
const value = ref('');
`,

    // 예제가 './MyIcon.vue', './Greeting.vue'를 import하지만 그런 파일은 없다.
    'vs-render': `
import { h } from 'vue';

const MyIcon = { setup: () => () => h('span', { style: 'font-size:1.5rem' }, '⭐') };

const Greeting = {
    props: { name: String, count: Number },
    setup: (props) => () => h('span', \`Hello, \${props.name}! (x\${props.count})\`),
};
`,

    'vs-search-input': `
import { ref } from 'vue';

const caseSensitive = ref(false);
const regex = ref(false);
`,

    'vs-switch': `
import { ref } from 'vue';

const selected = ref([]);
`,

    'vs-table': `
import { ref } from 'vue';

const page = ref(1);
const pageSize = ref(10);
const totalCount = ref(2);
const pagedItems = ref([]);
const totalItems = ref([]);
const orderedItems = ref([]);
const selectedItems = ref([]);

function fetchData() {
    // 데모용 no-op (server-mode 예제)
}
`,

    'vs-text-wrap': `
function doSomething() {
    // 데모용 no-op
}
`,

    'vs-toast': `
function handleClose() {
    // 데모용 no-op
}
`,

    'vs-toggle': `
import { ref } from 'vue';

const a = ref(false);
const b = ref(false);
const c = ref(false);
const d = ref(false);
`,
};
