<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <template #title>
            <h1>Hello, Sandbox</h1>
        </template>

        <section v-for="group in groups" :key="group.title" class="mb-8">
            <h2 class="mb-2 text-lg font-bold">{{ group.title }}</h2>
            <p class="mb-3 text-sm opacity-70">{{ group.description }}</p>
            <div class="flex flex-wrap gap-2">
                <vs-button v-for="item in group.cases" :key="item.label" size="sm" @click="openCase(item)">
                    {{ item.label }}
                </vs-button>
            </div>
        </section>

        <section class="mb-8">
            <h2 class="mb-2 text-lg font-bold">$vs.modal</h2>
            <p class="mb-3 text-sm opacity-70">플러그인으로 연 모달에도 같은 size 규칙이 적용되어야 한다.</p>
            <div class="flex flex-wrap gap-2">
                <vs-button size="sm" @click="openPluginModal('md', 2)">size: 'md' (짧은 내용)</vs-button>
                <vs-button size="sm" @click="openPluginModal('md', 60)">size: 'md' (긴 내용)</vs-button>
                <vs-button size="sm" @click="openPluginModal({ width: 'sm', height: 'lg' }, 2)">
                    size: { width: 'sm', height: 'lg' }
                </vs-button>
            </div>
        </section>

        <section class="mb-8">
            <h2 class="mb-2 text-lg font-bold">$vs.confirm / $vs.alert / $vs.prompt</h2>
            <p class="mb-3 text-sm opacity-70">
                기본 너비는 27rem이고 size로 바꿀 수 있다. 높이가 내용에 맞고, 내용이 길면 모달 안에서 스크롤되는지
                확인한다.
            </p>
            <div class="flex flex-wrap gap-2">
                <vs-button size="sm" @click="openConfirm(false)">confirm (짧은 내용)</vs-button>
                <vs-button size="sm" @click="openConfirm(true)">confirm (긴 내용)</vs-button>
                <vs-button size="sm" @click="openConfirm(false, 'md')">confirm (size: 'md')</vs-button>
                <vs-button size="sm" @click="openAlert(false)">alert (짧은 내용)</vs-button>
                <vs-button size="sm" @click="openAlert(true)">alert (긴 내용)</vs-button>
                <vs-button size="sm" @click="openPrompt(false)">prompt (짧은 내용)</vs-button>
                <vs-button size="sm" @click="openPrompt(true)">prompt (긴 내용)</vs-button>
            </div>
            <p class="mt-3 text-sm">마지막 결과: {{ lastResult }}</p>
        </section>

        <vs-modal v-model="isOpen" :size="current.size" :style-set="current.styleSet" dimmed dim-close esc-close>
            <h3 class="mb-2 text-lg font-bold">{{ current.label }}</h3>
            <pre class="mb-4 text-xs opacity-70">size: {{ JSON.stringify(current.size) }}</pre>
            <p v-for="line in current.lines" :key="line" class="mb-2">{{ line }}. {{ loremText }}</p>
            <vs-button class="mt-4" @click="isOpen = false">Close</vs-button>
        </vs-modal>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useVlossom } from '@/framework';
import type { SizeProp } from '@/declaration';
import type { VsModalNodeStyleSet } from '@/components/vs-modal/types';

type ModalSize = SizeProp | { width?: SizeProp; height?: SizeProp };

interface ModalCase {
    label: string;
    size?: ModalSize;
    lines: number;
    styleSet?: VsModalNodeStyleSet;
}

interface CaseGroup {
    title: string;
    description: string;
    cases: ModalCase[];
}

const loremText =
    'Vlossom 모달의 높이는 size를 명시하지 않으면 내용에 맞춰 늘어나고, 컨테이너를 넘으면 모달 내부에서 스크롤된다.';

function buildLongHtml(count: number) {
    const paragraphs = Array.from({ length: count }, (_, i) => `<p>${i + 1}. ${loremText}</p>`).join('');
    return `<div>${paragraphs}</div>`;
}

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const $vs = useVlossom();

        const groups: CaseGroup[] = [
            {
                title: 'Size 키워드 (너비만 적용)',
                description: '높이는 내용에 맞아야 한다. 짧은 내용과 긴 내용을 비교한다.',
                cases: (['xs', 'sm', 'md', 'lg', 'xl'] as const).flatMap((size) => [
                    { label: `${size} (짧은 내용)`, size, lines: 1 },
                    { label: `${size} (긴 내용)`, size, lines: 40 },
                ]),
            },
            {
                title: '단일 커스텀 값 (너비만 적용)',
                description: '문자열이나 숫자 하나는 너비에만 적용되어야 한다.',
                cases: [
                    { label: "'480px'", size: '480px', lines: 2 },
                    { label: '480 (number)', size: 480, lines: 2 },
                    { label: "'30rem'", size: '30rem', lines: 2 },
                ],
            },
            {
                title: '객체 형태',
                description: 'height를 명시했을 때만 높이가 고정된다. height에는 키워드도 쓸 수 있다.',
                cases: [
                    { label: "{ width: '600px' }", size: { width: '600px' }, lines: 2 },
                    { label: "{ height: 'lg' }", size: { height: 'lg' }, lines: 2 },
                    { label: "{ width: 'sm', height: 'lg' }", size: { width: 'sm', height: 'lg' }, lines: 2 },
                    {
                        label: "{ width: '600px', height: '300px' }",
                        size: { width: '600px', height: '300px' },
                        lines: 2,
                    },
                    {
                        label: "{ width: '600px', height: '300px' } (긴 내용)",
                        size: { width: '600px', height: '300px' },
                        lines: 40,
                    },
                ],
            },
            {
                title: '경계 케이스',
                description:
                    'max-width / max-height로 컨테이너를 넘지 않아야 하고, styleSet으로 덮어쓸 수 있어야 한다.',
                cases: [
                    { label: 'size 없음 (짧은 내용)', lines: 1 },
                    { label: 'size 없음 (긴 내용)', lines: 80 },
                    { label: "'3000px' (화면보다 넓음)", size: '3000px', lines: 2 },
                    { label: "{ height: '3000px' } (화면보다 높음)", size: { height: '3000px' }, lines: 2 },
                    { label: "styleSet maxHeight: '50%'", size: 'md', lines: 40, styleSet: { maxHeight: '50%' } },
                ],
            },
        ];

        const isOpen = ref(false);
        const current = ref<ModalCase>(groups[0].cases[0]);

        function openCase(item: ModalCase) {
            current.value = item;
            isOpen.value = true;
        }

        function openPluginModal(size: ModalSize, count: number) {
            $vs.modal.open(buildLongHtml(count), { size, dimmed: true, dimClose: true, escClose: true });
        }

        const lastResult = ref<string>('-');

        async function openConfirm(long: boolean, size?: ModalSize) {
            const result = await $vs.confirm.open(long ? buildLongHtml(40) : '정말 삭제하시겠습니까?', { size });
            lastResult.value = `confirm: ${result}`;
        }

        async function openAlert(long: boolean) {
            await $vs.alert.open(long ? buildLongHtml(40) : '저장되었습니다.');
            lastResult.value = 'alert: closed';
        }

        async function openPrompt(long: boolean) {
            const result = await $vs.prompt.open(long ? buildLongHtml(40) : '이름을 입력해주세요.', {
                input: { placeholder: 'name' },
            });
            lastResult.value = `prompt: ${result}`;
        }

        return {
            groups,
            isOpen,
            current,
            loremText,
            lastResult,
            openCase,
            openPluginModal,
            openConfirm,
            openAlert,
            openPrompt,
        };
    },
});
</script>
