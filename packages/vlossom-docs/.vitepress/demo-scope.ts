export const DEMO_SCOPE: Record<string, string> = {
    'vs-button': `
function handleClick() {}

function doSomething() {
    return new Promise((resolve) => setTimeout(resolve, 1000));
}
`,
    'vs-checkbox': `
import { ref } from 'vue';

const agreed = ref(false);
`,
    'vs-chip': `
function removeChip() {}
`,
    'vs-date-picker': `
import { ref } from 'vue';

const datetime = ref('2026-05-18T15:30');
const time = ref('15:30');
const month = ref('2026-05');
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

function handleClick() {}
`,
    'vs-index-view': `
import { h } from 'vue';

const ComponentA = () => h('p', 'Component A');
const ComponentB = () => h('p', 'Component B');
const ComponentC = () => h('p', 'Component C');
`,
    'vs-input': `
import { ref } from 'vue';

const email = ref('');
const password = ref('');
const count = ref(0);
const value = ref('');
`,
    'vs-render': `
import { h } from 'vue';

const MyIcon = () => h('span', '⭐');
const Greeting = (props: { name: string; count: number }) => h('span', \`Hello, \${props.name}! (x\${props.count})\`);
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

const orderedItems = ref([]);
const page = ref(0);
const pageSize = ref(10);
const totalCount = ref(2);

function fetchData() {}
`,
    'vs-text-wrap': `
function doSomething() {}
`,
    'vs-toggle': `
import { ref } from 'vue';

const a = ref(false);
const b = ref(false);
const c = ref(false);
const d = ref(false);
`,
};

const PLACEHOLDER_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
    '<rect width="96" height="96" fill="#cbd5e1"/>' +
    '<circle cx="48" cy="38" r="18" fill="#94a3b8"/>' +
    '<path d="M16 96c0-17.7 14.3-32 32-32s32 14.3 32 32z" fill="#94a3b8"/></svg>';
const PLACEHOLDER_IMAGE = `data:image/svg+xml,${encodeURIComponent(PLACEHOLDER_SVG)}`;
const FALLBACK_SVG =
    '<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96">' +
    '<rect width="96" height="96" fill="#fde68a"/>' +
    '<text x="48" y="53" font-family="sans-serif" font-size="14" text-anchor="middle" fill="#92400e">fallback</text></svg>';
const FALLBACK_IMAGE = `data:image/svg+xml,${encodeURIComponent(FALLBACK_SVG)}`;

export const DEMO_IMAGES: Record<string, string> = {
    '/profile.png': PLACEHOLDER_IMAGE,
    'https://example.com/fallback.png': FALLBACK_IMAGE,
    'https://example.com/image.png': PLACEHOLDER_IMAGE,
};
