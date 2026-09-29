<script setup lang="ts">
import { ref } from 'vue';
import { applyColorScheme, colors } from './vlossom.ts';

const selected = ref<string | null>(null);

function select(color: string | null) {
    selected.value = color;
    applyColorScheme(color);
}
</script>

<template>
    <ClientOnly>
        <div v-if="colors.length" class="vs-scheme-bar">
            <span class="vs-scheme-label">Color scheme</span>
            <button
                type="button"
                class="vs-scheme-swatch vs-scheme-none"
                :class="{ 'is-selected': selected === null }"
                title="none"
                @click="select(null)"
            />
            <button
                v-for="color in colors"
                :key="color"
                type="button"
                class="vs-scheme-swatch"
                :class="{ 'is-selected': selected === color }"
                :style="{ backgroundColor: `var(--vs-${color}-500)` }"
                :title="color"
                @click="select(color)"
            />
            <span class="vs-scheme-current">{{ selected ?? 'none' }}</span>
        </div>
    </ClientOnly>
</template>

<style scoped>
.vs-scheme-bar {
    display: flex;
    flex-wrap: wrap;
    gap: 0.35rem;
    align-items: center;
    margin: 1rem 0 1.5rem;
    padding: 0.75rem 1rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 8px;
    background-color: var(--vp-c-bg-soft);
}

.vs-scheme-label {
    margin-right: 0.35rem;
    color: var(--vp-c-text-2);
    font-size: 0.8rem;
    font-weight: 600;
}

.vs-scheme-swatch {
    width: 1.15rem;
    height: 1.15rem;
    border: 2px solid transparent;
    border-radius: 50%;
    outline-offset: 2px;
    cursor: pointer;
}

.vs-scheme-swatch.is-selected {
    border-color: var(--vp-c-text-1);
}

.vs-scheme-none {
    position: relative;
    border: 1px dashed var(--vp-c-text-3);
    background-color: transparent;
}

.vs-scheme-none::after {
    position: absolute;
    top: 50%;
    left: 50%;
    width: 100%;
    height: 1px;
    background-color: var(--vp-c-text-3);
    content: '';
    transform: translate(-50%, -50%) rotate(-45deg);
}

.vs-scheme-current {
    margin-left: 0.35rem;
    color: var(--vp-c-text-3);
    font-size: 0.8rem;
    font-variant-numeric: tabular-nums;
}
</style>
