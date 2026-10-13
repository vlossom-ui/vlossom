<script setup lang="ts">
import { useData } from 'vitepress';
import { computed, ref } from 'vue';
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

const { frontmatter, isDark, localeIndex } = useData();
const open = ref(false);
const toggleButton = ref<HTMLButtonElement>();
const labels = computed(() => (localeIndex.value === 'ko' ? LABELS.ko : LABELS.root));
const visible = computed(() => frontmatter.value.liveDemos === true && vlossomColors.value.length > 0);
const colorScheme = computed({
    get: () => defaultColorScheme.value,
    set: setDefaultColorScheme,
});

function close(): void {
    open.value = false;
    toggleButton.value?.focus();
}
</script>

<template>
    <div v-if="visible" class="demo-options" @keydown.esc="close">
        <button
            ref="toggleButton"
            type="button"
            :class="['toggle', `vs-cs-${colorScheme ?? 'default'}`]"
            :title="labels.title"
            :aria-label="labels.title"
            :aria-expanded="open"
            aria-controls="demo-options-panel"
            @click="open = !open"
        />
        <section v-show="open" id="demo-options-panel" class="panel" :aria-label="labels.title">
            <p class="title">{{ labels.title }}</p>
            <fieldset>
                <legend>{{ labels.theme }}</legend>
                <div class="segments">
                    <label class="segment">
                        <input v-model="isDark" type="radio" name="demo-options-theme" :value="false" />
                        {{ labels.light }}
                    </label>
                    <label class="segment">
                        <input v-model="isDark" type="radio" name="demo-options-theme" :value="true" />
                        {{ labels.dark }}
                    </label>
                </div>
            </fieldset>
            <fieldset>
                <legend>
                    {{ labels.colorScheme }}
                    <span class="current">{{ colorScheme ?? labels.default }}</span>
                </legend>
                <div class="swatches">
                    <label class="swatch vs-cs-default" :title="labels.default">
                        <input
                            v-model="colorScheme"
                            type="radio"
                            name="demo-options-color-scheme"
                            :value="undefined"
                            :aria-label="labels.default"
                        />
                    </label>
                    <label
                        v-for="color in vlossomColors"
                        :key="color"
                        :class="['swatch', `vs-cs-${color}`]"
                        :title="color"
                    >
                        <input
                            v-model="colorScheme"
                            type="radio"
                            name="demo-options-color-scheme"
                            :value="color"
                            :aria-label="color"
                        />
                    </label>
                </div>
            </fieldset>
        </section>
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

.panel {
    max-width: calc(100vw - 2rem);
    padding: 1rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 12px;
    background-color: var(--vp-c-bg-elv);
    box-shadow: var(--vp-shadow-3);
}

.title {
    margin: 0 0 0.75rem;
    color: var(--vp-c-text-1);
    font-size: 0.875rem;
    font-weight: 600;
}

fieldset {
    margin: 0;
    padding: 0;
    border: 0;
}

fieldset + fieldset {
    margin-top: 1rem;
}

legend {
    margin-bottom: 0.5rem;
    padding: 0;
    color: var(--vp-c-text-2);
    font-size: 0.75rem;
    font-weight: 500;
}

.current {
    margin-left: 0.25rem;
    color: var(--vp-c-text-1);
    font-family: var(--vp-font-family-mono);
}

.segments {
    display: inline-flex;
    padding: 0.125rem;
    border-radius: 8px;
    background-color: var(--vp-c-default-soft);
}

.segment {
    position: relative;
    padding: 0.25rem 0.75rem;
    border-radius: 6px;
    color: var(--vp-c-text-2);
    font-size: 0.8125rem;
    cursor: pointer;
}

.segment:has(:checked) {
    background-color: var(--vp-c-bg-elv);
    color: var(--vp-c-text-1);
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

input {
    position: absolute;
    inset: 0;
    margin: 0;
    opacity: 0;
    cursor: pointer;
}

.segment:has(:focus-visible),
.swatch:has(:focus-visible) {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
}

.swatches {
    display: grid;
    grid-template-columns: repeat(10, 1.25rem);
    gap: 0.5rem;
}

/* vlossom의 vs-cs-* 클래스가 정하는 primary 색을 그대로 보여 주므로, 다크 모드에서는 다크 팔레트의 색이 나온다. */
.swatch {
    position: relative;
    width: 1.25rem;
    height: 1.25rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 50%;
    background-color: var(--vs-cs-bg-primary);
}

.swatch:has(:checked) {
    box-shadow:
        0 0 0 2px var(--vp-c-bg-elv),
        0 0 0 4px var(--vp-c-text-1);
}

.toggle {
    width: 2.75rem;
    height: 2.75rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 50%;
    background:
        radial-gradient(circle, var(--vs-cs-bg-primary) 0 32%, var(--vp-c-bg-elv) 34% 46%, transparent 48%),
        conic-gradient(
            var(--vs-red-500),
            var(--vs-amber-500),
            var(--vs-green-500),
            var(--vs-sky-500),
            var(--vs-violet-500),
            var(--vs-pink-500),
            var(--vs-red-500)
        );
    box-shadow: var(--vp-shadow-3);
    cursor: pointer;
}

.toggle:focus-visible {
    outline: 2px solid var(--vp-c-brand-1);
    outline-offset: 2px;
}

@media (min-width: 768px) {
    .demo-options {
        right: 1.5rem;
        bottom: 1.5rem;
    }
}
</style>
