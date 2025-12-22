<template>
    <vs-block class="settings-panel" :style-set="panelStyleSet">
        <template #title><p class="font-bold">Color Scheme Panel</p></template>
        <vs-focus-trap>
            <vs-grid :grid-size="6" column-gap="1rem" row-gap="1rem">
                <button
                    :class="['color-btn', 'clear-btn', { selected: !selectedColorScheme }]"
                    aria-label="clear color scheme"
                    @click="clearColorScheme"
                />
                <button
                    v-for="color in colorOptions"
                    :key="color"
                    :class="['color-btn', { selected: selectedColorScheme === color }]"
                    :style="{ '--btn-color': `var(--vs-${color}-500)` }"
                    :title="color"
                    @click="setColorScheme(color)"
                />
            </vs-grid>
        </vs-focus-trap>
    </vs-block>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useVlossom } from '@/framework';
import { COLORS } from '@/declaration/constants';
import type { ColorScheme } from '@/declaration';
import type { VsBlockStyleSet } from '@/components/vs-block/types';

const panelStyleSet: VsBlockStyleSet = {
    backgroundColor: 'var(--vs-no-color)',
    border: '1px solid var(--vs-gray-300)',
    title: {
        backgroundColor: 'var(--vs-no-color)',
        fontColor: 'var(--vs-no-color-inverse)',
    },
};

export default defineComponent({
    name: 'ColorSchemePanel',
    setup() {
        const $vs = useVlossom();

        const colorOptions = COLORS;

        const selectedColorScheme = ref<ColorScheme | null>(null);

        function setColorScheme(color: ColorScheme) {
            selectedColorScheme.value = color;
            $vs.colorScheme = { fallback: color };
        }

        function clearColorScheme() {
            selectedColorScheme.value = null;
            $vs.colorScheme = {};
        }

        return {
            panelStyleSet,
            colorOptions,
            selectedColorScheme,
            setColorScheme,
            clearColorScheme,
        };
    },
});
</script>

<style scoped>
.settings-panel {
    position: fixed;
    top: 80px;
    right: 100px;
    width: 280px;
    z-index: 100;
}

.color-btn {
    aspect-ratio: 1;
    border: none;
    border-radius: 6px;
    background-color: var(--btn-color);
    cursor: pointer;
    transition: all 0.15s ease;
    outline: 2px solid transparent;
    outline-offset: 2px;
}

.color-btn:focus-visible {
    outline-color: var(--btn-color);
    transform: scale(1.1);
}

.color-btn.selected {
    outline-color: var(--btn-color);
    box-shadow:
        0 0 0 2px var(--vs-no-color),
        0 0 0 4px var(--btn-color);
}

.clear-btn {
    --btn-color: var(--vs-no-color-inverse);
    background-color: var(--btn-color);
}
</style>
