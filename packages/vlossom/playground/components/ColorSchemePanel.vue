<template>
    <div class="z-99">
        <vs-accordion :style-set="{ component: { width: '15rem' } }" open>
            <template #title><p class="font-bold">Color Scheme Panel</p></template>
            <vs-focus-trap>
                <vs-grid :grid-size="5" column-gap="0.8rem" row-gap="0.8rem">
                    <button
                        :class="['color-btn', 'clear-btn', { selected: !selectedColorScheme }]"
                        @click="clearColorScheme"
                    />
                    <button
                        v-for="color in colorOptions"
                        :key="color"
                        :class="['color-btn', { selected: selectedColorScheme === color }]"
                        :style="{ '--btn-color': `var(--vs-${color}-600)` }"
                        @click="setColorScheme(color)"
                    />
                </vs-grid>
            </vs-focus-trap>
        </vs-accordion>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useVlossom } from '@/framework';
import { COLORS } from '@/declaration/constants';
import type { ColorScheme } from '@/declaration';

export default defineComponent({
    name: 'ColorSchemePanel',
    setup() {
        const $vs = useVlossom();

        const colorOptions = COLORS;

        const selectedColorScheme = ref<ColorScheme | null>(null);

        function setColorScheme(color: ColorScheme) {
            selectedColorScheme.value = color;
            $vs.colorScheme = { default: color };
        }

        function clearColorScheme() {
            selectedColorScheme.value = null;
            $vs.colorScheme = {};
        }

        return {
            colorOptions,
            selectedColorScheme,
            setColorScheme,
            clearColorScheme,
        };
    },
});
</script>
<style scoped>
.color-btn {
    aspect-ratio: 1;
    border-radius: 6px;
    background-color: var(--btn-color);
    cursor: pointer;
    outline: 2px solid transparent;
    outline-offset: 2px;
}

.color-btn:focus-visible {
    outline-color: var(--btn-color);
    transform: scale(1.1);
}

.color-btn.selected {
    outline-color: var(--btn-color);
}

.clear-btn {
    --btn-color: var(--vs-no-color-inverse);
}
</style>
