<script lang="ts">
import { ref } from 'vue';

const styleSetSource = ref('');
</script>

<script setup lang="ts">
// 사이트에 등록된 vlossom 컴포넌트는 콘솔 style-set을 기본값으로 쓰는 복사본이다(vlossom.ts의 withDocsStyleSet).
// 콘솔이 자기 입력으로 바뀌지 않도록 원래 컴포넌트를 직접 가져와 쓴다.
import { VsBlock, VsButton, VsTextarea, VsThemeButton, type ColorScheme } from 'vlossom';
import { useData } from 'vitepress';
import { computed, useTemplateRef, watch, type ComponentPublicInstance } from 'vue';
import { parseStyleSet, type StyleSetInputError } from './style-set-input.ts';
import {
    defaultColorScheme,
    setDefaultColorScheme,
    setDemoStyleSet,
    STYLE_SET_NAMES,
    styleSetComponents,
    vlossomColors,
} from './vlossom.ts';

const LABELS = {
    root: {
        title: 'Vlossom options',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        colorScheme: 'Color scheme',
        default: 'default',
        styleSet: 'Style set',
        apply: 'Apply',
        reset: 'Reset',
        applied: 'Applied to the demos.',
        errors: {
            syntax: 'This is not a valid object: ',
            'not-object': 'Enter an object, for example { VsButton: { ... } }.',
            'unknown-component': 'These components do not take a style set: ',
            'not-style-object': 'Give each component an object: ',
        },
    },
    ko: {
        title: 'Vlossom 옵션',
        theme: '테마',
        light: '라이트',
        dark: '다크',
        colorScheme: '색상 스킴',
        default: '기본값',
        styleSet: '스타일 세트',
        apply: '적용',
        reset: '초기화',
        applied: '데모에 적용했습니다.',
        errors: {
            syntax: '객체 문법이 아닙니다: ',
            'not-object': '객체를 입력하세요. 예: { VsButton: { ... } }',
            'unknown-component': '스타일 세트를 받지 않는 컴포넌트입니다: ',
            'not-style-object': '컴포넌트마다 객체를 주세요: ',
        },
    },
} satisfies Record<string, { errors: Record<StyleSetInputError, string> } & Record<string, unknown>>;
const STYLE_SET_PLACEHOLDER = "{ VsButton: { backgroundColor: '#e11d48', color: '#fff' } }";
const TEXTAREA_STYLE_SET = {
    $textarea: { minHeight: '6rem', fontFamily: 'var(--vp-font-family-mono)', fontSize: '0.75rem' },
};

type StyleSetStatus = { kind: 'applied' } | { kind: 'error'; error: StyleSetInputError; detail: string };

const { isDark, localeIndex } = useData();
const open = ref(false);
const opened = ref(false);
const status = ref<StyleSetStatus>();
const source = styleSetSource;
const toggleButton = useTemplateRef<ComponentPublicInstance>('toggleButton');
const swatchGroup = useTemplateRef<HTMLElement>('swatchGroup');
const labels = computed(() => (localeIndex.value === 'ko' ? LABELS.ko : LABELS.root));
const options = computed<(ColorScheme | undefined)[]>(() => [undefined, ...vlossomColors.value]);
const selectedIndex = computed(() => options.value.indexOf(defaultColorScheme.value));
const statusText = computed(() => {
    if (!status.value) {
        return '';
    }
    return status.value.kind === 'applied'
        ? labels.value.applied
        : `${labels.value.errors[status.value.error]}${status.value.detail}`;
});

watch(source, () => {
    status.value = undefined;
});

function applyStyleSet(): void {
    const result = parseStyleSet(source.value, styleSetComponents.value, STYLE_SET_NAMES);
    if (!result.ok) {
        status.value = { kind: 'error', error: result.error, detail: result.detail };
        return;
    }
    setDemoStyleSet(result.value);
    status.value = result.value ? { kind: 'applied' } : undefined;
}

function resetStyleSet(): void {
    source.value = '';
    setDemoStyleSet(undefined);
    status.value = undefined;
}

function toggle(): void {
    open.value = !open.value;
    opened.value = true;
}

function close(): void {
    open.value = false;
    toggleButton.value?.$el.focus();
}

function move(step: number): void {
    const next = (selectedIndex.value + step + options.value.length) % options.value.length;
    setDefaultColorScheme(options.value[next]);
    swatchGroup.value?.querySelectorAll<HTMLElement>('.swatch')[next]?.focus();
}
</script>

<template>
    <div class="demo-options" @keydown.esc="close">
        <vs-button
            ref="toggleButton"
            :class="['toggle', { opened }]"
            primary
            size="lg"
            :style-set="{ borderRadius: '9999px' }"
            :title="labels.title"
            :aria-expanded="open"
            aria-controls="demo-options-panel"
            @click="toggle"
        >
            <span class="wheel" />
            <span class="toggle-label">{{ labels.title }}</span>
        </vs-button>
        <vs-block v-show="open" id="demo-options-panel" class="panel" role="region" :aria-label="labels.title">
            <template #title>{{ labels.title }}</template>
            <div class="row">
                <span class="label">{{ labels.theme }}</span>
                <span class="value">{{ isDark ? labels.dark : labels.light }}</span>
                <vs-theme-button class="theme-button" />
            </div>
            <div class="row">
                <span class="label">{{ labels.colorScheme }}</span>
                <span class="value">{{ defaultColorScheme ?? labels.default }}</span>
            </div>
            <div
                ref="swatchGroup"
                class="swatches"
                role="radiogroup"
                :aria-label="labels.colorScheme"
                @keydown.right.prevent="move(1)"
                @keydown.down.prevent="move(1)"
                @keydown.left.prevent="move(-1)"
                @keydown.up.prevent="move(-1)"
            >
                <vs-button
                    v-for="(option, index) in options"
                    :key="option ?? 'default'"
                    class="swatch"
                    circle
                    primary
                    size="xs"
                    role="radio"
                    :color-scheme="option ?? 'none'"
                    :title="option ?? labels.default"
                    :aria-label="option ?? labels.default"
                    :aria-checked="index === selectedIndex"
                    :tabindex="index === selectedIndex ? 0 : -1"
                    @click="setDefaultColorScheme(option)"
                />
            </div>
            <div class="style-set">
                <!-- VsTextarea의 라벨은 div라서 입력란과 연결되지 않으므로, label을 직접 넣는다. -->
                <vs-textarea
                    id="demo-options-style-set"
                    v-model="source"
                    :placeholder="STYLE_SET_PLACEHOLDER"
                    no-messages
                    :style-set="TEXTAREA_STYLE_SET"
                >
                    <template #label>
                        <label for="demo-options-style-set">{{ labels.styleSet }}</label>
                    </template>
                </vs-textarea>
                <div class="actions">
                    <span :class="['status', status?.kind]" role="status">{{ statusText }}</span>
                    <vs-button size="sm" @click="resetStyleSet">
                        {{ labels.reset }}
                    </vs-button>
                    <vs-button size="sm" primary @click="applyStyleSet">
                        {{ labels.apply }}
                    </vs-button>
                </div>
            </div>
        </vs-block>
    </div>
</template>

<style scoped>
.demo-options {
    position: fixed;
    right: 1rem;
    bottom: 1rem;
    z-index: var(--vp-z-index-local-nav);
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    gap: 0.75rem;
}

.toggle {
    min-width: var(--vs-comp-height-lg);
    box-shadow: var(--vp-shadow-3);
    animation: demo-options-pulse 1.6s ease-out 3;
}

.toggle.opened {
    animation: none;
}

.toggle :deep(.vs-button-content) {
    gap: 0.5rem;
    padding: 0 1rem 0 0.625rem;
}

.wheel {
    display: block;
    flex-shrink: 0;
    width: 1.25rem;
    height: 1.25rem;
    border-radius: 50%;
    background: conic-gradient(
        var(--vs-red-500),
        var(--vs-amber-500),
        var(--vs-green-500),
        var(--vs-sky-500),
        var(--vs-violet-500),
        var(--vs-pink-500),
        var(--vs-red-500)
    );
    box-shadow: 0 0 0 2px var(--vs-cs-text-primary);
}

.toggle-label {
    font-size: 0.875rem;
    font-weight: 600;
}

/* VsBlock은 container-type: inline-size라서, 크기가 내용에 맞춰지는 fixed 부모 안에서는 너비를 주지 않으면 2px로 줄어든다. */
.panel {
    width: min(21rem, calc(100vw - 2rem));
    max-height: calc(100dvh - var(--vp-nav-height) - 6rem);
    overflow-y: auto;
    background-color: var(--vp-c-bg-elv);
    box-shadow: var(--vp-shadow-3);
}

.style-set {
    margin-top: 0.75rem;
}

.actions {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 0.5rem;
    margin-top: 0.5rem;
}

.status {
    margin-right: auto;
    font-size: 0.75rem;
}

.status.error {
    color: var(--vp-c-danger-1);
}

.status.applied {
    color: var(--vp-c-text-2);
}

.row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    min-height: 2rem;
    font-size: 0.8125rem;
}

.label {
    font-weight: 500;
}

.value {
    margin-left: auto;
    font-family: var(--vp-font-family-mono);
}

.swatches {
    display: flex;
    flex-wrap: wrap;
    gap: 0.375rem;
    margin-top: 0.5rem;
    padding: 0.25rem;
}

.swatch[aria-checked='true'] {
    box-shadow:
        0 0 0 2px var(--vp-c-bg-elv),
        0 0 0 4px var(--vp-c-text-1);
}

/* vlossom 포커스 링은 스와치 색의 1px이고 utilities 레이어의 !important라서 두께를 바꿀 수 없다.
   VsBlock이 넘치는 부분을 자르므로 링은 4px 안에 둔다. */
.toggle:focus-visible,
.theme-button:focus-visible,
.swatch:focus-visible {
    --vs-cs-border-strong: var(--vp-c-brand-1);
    box-shadow:
        0 0 0 2px var(--vp-c-bg-elv),
        0 0 0 4px var(--vp-c-brand-1);
    animation: none;
}

@keyframes demo-options-pulse {
    0% {
        box-shadow:
            var(--vp-shadow-3),
            0 0 0 0 color-mix(in oklch, var(--vp-c-brand-1) 55%, transparent);
    }

    70%,
    100% {
        box-shadow:
            var(--vp-shadow-3),
            0 0 0 14px transparent;
    }
}

@media (max-width: 639px) {
    .toggle :deep(.vs-button-content) {
        padding: 0;
    }

    .toggle-label {
        position: absolute;
        width: 1px;
        height: 1px;
        overflow: hidden;
        clip-path: inset(50%);
        white-space: nowrap;
    }
}

@media (min-width: 768px) {
    .demo-options {
        right: 1.5rem;
        bottom: 1.5rem;
    }
}

@media (prefers-reduced-motion: reduce) {
    .toggle {
        animation: none;
    }
}
</style>
