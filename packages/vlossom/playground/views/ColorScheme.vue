<template>
    <vs-page :style-set="{ component: { padding: '0' } }">
        <template #title>
            <h1 class="text-2xl font-bold">Color Scheme</h1>
        </template>

        <div class="flex flex-col gap-12">
            <vs-table :columns="tableColumns" :items="tableItems" no-virtual-scroll no-responsive>
                <template #body-name="{ item }">
                    <span class="font-mono text-xs font-semibold">{{ item.name }}</span>
                </template>

                <template #body-vs-cs-line="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-line)' }" />
                </template>
                <template #body-vs-cs-font="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-font)' }" />
                </template>
                <template #body-vs-cs-font-colored="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-font-colored)' }"
                    />
                </template>
                <template #body-vs-cs-font-primary="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-font-primary)' }"
                    />
                </template>
                <template #body-vs-cs-bg-area="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-bg-area)' }" />
                </template>
                <template #body-vs-cs-bg-area-colored="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-bg-area-colored)' }"
                    />
                </template>
                <template #body-vs-cs-bg="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-bg)' }" />
                </template>
                <template #body-vs-cs-bg-colored="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-bg-colored)' }"
                    />
                </template>
                <template #body-vs-cs-bg-comp="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-bg-comp)' }" />
                </template>
                <template #body-vs-cs-bg-comp-colored="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-bg-comp-colored)' }"
                    />
                </template>
                <template #body-vs-cs-bg-primary="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-bg-primary)' }"
                    />
                </template>
                <template #body-vs-cs-shadow-color="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-shadow-color)' }"
                    />
                </template>
            </vs-table>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { COLORS } from '@/declaration';

export default defineComponent({
    name: 'ColorScheme',
    setup() {
        const csVariables = [
            { key: '--vs-cs-line', label: '--vs-cs-line' },
            { key: '--vs-cs-font', label: '--vs-cs-font' },
            { key: '--vs-cs-font-colored', label: '--vs-cs-font-colored' },
            { key: '--vs-cs-font-primary', label: '--vs-cs-font-primary' },
            { key: '--vs-cs-bg-area', label: '--vs-cs-bg-area' },
            { key: '--vs-cs-bg-area-colored', label: '--vs-cs-bg-area-colored' },
            { key: '--vs-cs-bg', label: '--vs-cs-bg' },
            { key: '--vs-cs-bg-colored', label: '--vs-cs-bg-colored' },
            { key: '--vs-cs-bg-comp', label: '--vs-cs-bg-comp' },
            { key: '--vs-cs-bg-comp-colored', label: '--vs-cs-bg-comp-colored' },
            { key: '--vs-cs-bg-primary', label: '--vs-cs-bg-primary' },
            { key: '--vs-cs-shadow-color', label: '--vs-cs-shadow-color' },
        ];

        const colorSchemes = [
            { name: 'default', className: 'vs-cs-default' },
            ...COLORS.map((color) => ({ name: color, className: `vs-cs-${color}` })),
        ];

        const tableColumns = [
            { key: 'name', label: 'Color Scheme' },
            ...csVariables.map((v) => ({ key: v.key, label: v.label, align: 'center' as const })),
        ];

        const tableItems = colorSchemes.map((cs) => ({ id: cs.name, ...cs }));

        return {
            tableColumns,
            tableItems,
        };
    },
});
</script>

<style scoped>
.cs-swatch {
    width: 2rem;
    height: 2rem;
    border-radius: 4px;
    border: 1px solid rgba(0, 0, 0, 0.1);
    margin: auto;
}
</style>
