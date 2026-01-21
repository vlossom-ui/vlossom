<template>
    <vs-page class="color-palette" :style-set="{ variables: { padding: '0' } }">
        <template #title>
            <h1 class="text-2xl font-bold">Color Palette</h1>
        </template>
        <div class="flex flex-col gap-3">
            <div class="flex gap-3">
                <vs-avatar :style-set="{ component: { border: 'none', width: '4rem', height: '1rem' } }"></vs-avatar>
                <vs-avatar
                    v-for="step in steps"
                    :key="step"
                    :style-set="{ component: { border: 'none', width: '3rem', height: '1rem' } }"
                >
                    <span class="text-xs">{{ step }}</span>
                </vs-avatar>
            </div>
            <div v-for="color in COLORS" :key="color" class="flex flex-nowrap gap-3">
                <vs-avatar :style-set="{ component: { border: 'none', width: '4rem', height: '3rem' } }">
                    <span class="text-sm font-bold" :style="{ color: `var(--vs-${color}-500)` }">{{ color }}</span>
                </vs-avatar>
                <vs-avatar
                    v-for="step in steps"
                    :key="`${color}-${step}`"
                    :style-set="{
                        component: {
                            backgroundColor: `var(--vs-${color}-${step})`,
                            border: 'none',
                            width: '3rem',
                            height: '3rem',
                        },
                    }"
                />
            </div>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { COLORS } from '@/declaration';

export default defineComponent({
    setup() {
        const steps = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900, 950];

        return {
            COLORS,
            steps,
        };
    },
});
</script>
