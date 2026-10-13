<script setup lang="ts">
import type { ColorScheme } from 'vlossom';
import { useData } from 'vitepress';
import { computed, ref, useTemplateRef, type ComponentPublicInstance } from 'vue';
import { defaultColorScheme, setDefaultColorScheme, vlossomColors } from './vlossom.ts';

const LABELS = {
    root: {
        title: 'Demo options',
        theme: 'Theme',
        light: 'Light',
        dark: 'Dark',
        colorScheme: 'Color scheme',
        default: 'default',
    },
    ko: {
        title: '데모 옵션',
        theme: '테마',
        light: '라이트',
        dark: '다크',
        colorScheme: '색상 스킴',
        default: '기본값',
    },
};

const { isDark, localeIndex } = useData();
const open = ref(false);
const opened = ref(false);
const toggleButton = useTemplateRef<ComponentPublicInstance>('toggleButton');
const swatchGroup = useTemplateRef<HTMLElement>('swatchGroup');
const labels = computed(() => (localeIndex.value === 'ko' ? LABELS.ko : LABELS.root));
const options = computed<(ColorScheme | undefined)[]>(() => [undefined, ...vlossomColors.value]);
const selectedIndex = computed(() => options.value.indexOf(defaultColorScheme.value));

function toggle(): void {
    open.value = !open.value;
    opened.value = true;
}

function close(): void {
    open.value = false;
    toggleButton.value?.$el.focus();
}

// v-for 안의 ref 배열은 순서를 보장하지 않으므로, 옮겨 갈 스와치는 DOM 순서로 찾는다.
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
            <!-- 스와치는 color-scheme을 직접 받아서 전역 기본값과 관계없이 자기 색을 보인다. -->
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
        </vs-block>
    </div>
</template>

<style scoped>
/* 모바일 사이드바와 그 배경막(z-index 50, 60)이 콘솔을 덮어야 하므로 그보다 낮은 층에 둔다.
   Tab 순서가 버튼 → 패널이 되도록 마크업은 버튼을 먼저 두고, 화면에서는 패널을 버튼 위에 놓는다. */
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
    box-shadow: 0 0 0 2px var(--vs-cs-font-primary);
}

.toggle-label {
    font-size: 0.875rem;
    font-weight: 600;
}

/* VsBlock은 container-type: inline-size라서, 크기가 내용에 맞춰지는 fixed 부모 안에서는 너비를 주지 않으면 2px로 줄어든다.
   배경을 사이트의 떠 있는 면 색으로 두어 다크 모드에서도 페이지와 구분하고, 선택 링의 간격 색과 맞춘다. */
.panel {
    width: min(21rem, calc(100vw - 2rem));
    background-color: var(--vp-c-bg-elv);
    box-shadow: var(--vp-shadow-3);
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

/* vlossom의 포커스 링은 각 스와치 색의 1px이라 밝은 스와치에서 거의 보이지 않는다. 그 규칙은 utilities 레이어의 !important라서
   레이어 밖에서는 두께를 바꿀 수 없으므로, 링 색 변수를 브랜드 색으로 바꾸고 box-shadow로 2px 링을 더한다.
   VsBlock이 넘치는 부분을 자르므로 링은 4px 안에 둔다. 파동 애니메이션은 box-shadow를 덮으므로 포커스 중에는 멈춘다. */
.toggle:focus-visible,
.theme-button:focus-visible,
.swatch:focus-visible {
    --vs-cs-line-strong: var(--vp-c-brand-1);
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
