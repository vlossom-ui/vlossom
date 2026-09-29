<script setup lang="ts">
import { colors } from './vlossom.ts';

// playground/views/ColorPalette.vue와 같은 구성.
const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];
const tokens = [
    { label: 'soft', suffix: '-soft' },
    { label: 'base', suffix: '' },
    { label: 'strong', suffix: '-strong' },
];
</script>

<template>
    <ClientOnly>
        <div v-if="colors.length" class="vs-palette">
            <table>
                <thead>
                    <tr>
                        <th class="vs-palette-name"></th>
                        <th v-for="step in steps" :key="step">{{ step }}</th>
                        <th v-for="token in tokens" :key="token.label" class="vs-palette-token">{{ token.label }}</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="color in colors" :key="color">
                        <th class="vs-palette-name" :style="{ color: `var(--vs-${color}-500)` }">{{ color }}</th>
                        <td v-for="step in steps" :key="`${color}-${step}`">
                            <span
                                class="vs-palette-cell"
                                :style="{ backgroundColor: `var(--vs-${color}-${step})` }"
                                :title="`--vs-${color}-${step}`"
                            />
                        </td>
                        <td v-for="token in tokens" :key="`${color}-${token.label}`" class="vs-palette-token">
                            <span
                                class="vs-palette-cell"
                                :style="{ backgroundColor: `var(--vs-${color}${token.suffix})` }"
                                :title="`--vs-${color}${token.suffix}`"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </ClientOnly>
</template>

<style scoped>
.vs-palette {
    overflow-x: auto;
    margin: 1.5rem 0;
}

.vs-palette table {
    display: table;
    border-collapse: separate;
    border-spacing: 3px;
}

.vs-palette th,
.vs-palette td {
    padding: 0;
    border: none;
    background: none;
}

.vs-palette thead th {
    color: var(--vp-c-text-3);
    font-size: 0.7rem;
    font-weight: 500;
    text-align: center;
}

.vs-palette-name {
    padding-right: 0.6rem !important;
    font-size: 0.78rem;
    font-weight: 700;
    text-align: right !important;
    white-space: nowrap;
}

.vs-palette-cell {
    display: block;
    width: 2.1rem;
    height: 2.1rem;
    border: 1px solid var(--vp-c-divider);
    border-radius: 4px;
}

/* 토큰 열(soft/base/strong)은 스텝 열과 구분되게 살짝 띄운다 */
.vs-palette-token {
    padding-left: 0.5rem !important;
}
</style>
