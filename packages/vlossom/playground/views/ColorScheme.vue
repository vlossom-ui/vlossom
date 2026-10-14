<template>
    <vs-page :style-set="{ padding: '0' }">
        <template #title>
            <h1 class="text-2xl font-bold">Color Scheme</h1>
        </template>

        <div class="flex flex-col gap-12">
            <vs-table :columns="tableColumns" :items="tableItems" item-key="id">
                <template #item-name="{ item }">
                    <span class="font-mono text-xs font-semibold">{{ item.name }}</span>
                </template>

                <template #item-vs-cs-line="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-border)' }" />
                </template>
                <template #item-vs-cs-line-strong="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-border-strong)' }"
                    />
                </template>
                <template #item-vs-cs-font="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-text)' }" />
                </template>
                <template #item-vs-cs-font-colored="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-text-tinted)' }"
                    />
                </template>
                <template #item-vs-cs-font-primary="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-text-primary)' }"
                    />
                </template>
                <template #item-vs-cs-bg-area="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-surface)' }" />
                </template>
                <template #item-vs-cs-bg-area-colored="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-surface-tinted)' }"
                    />
                </template>
                <template #item-vs-cs-bg="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-bg)' }" />
                </template>
                <template #item-vs-cs-bg-colored="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-bg-tinted)' }"
                    />
                </template>
                <template #item-vs-cs-bg-comp="{ item }">
                    <div :class="['cs-swatch', item.className]" :style="{ backgroundColor: 'var(--vs-cs-bg-comp)' }" />
                </template>
                <template #item-vs-cs-bg-comp-colored="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-bg-comp-tinted)' }"
                    />
                </template>
                <template #item-vs-cs-bg-primary="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-primary)' }"
                    />
                </template>
                <template #item-vs-cs-shadow-color="{ item }">
                    <div
                        :class="['cs-swatch', item.className]"
                        :style="{ backgroundColor: 'var(--vs-cs-shadow)' }"
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
            { key: 'vs-cs-line', label: '--vs-cs-border' },
            { key: 'vs-cs-line-strong', label: '--vs-cs-border-strong' },
            { key: 'vs-cs-font', label: '--vs-cs-text' },
            { key: 'vs-cs-font-colored', label: '--vs-cs-text-tinted' },
            { key: 'vs-cs-font-primary', label: '--vs-cs-text-primary' },
            { key: 'vs-cs-bg-area', label: '--vs-cs-surface' },
            { key: 'vs-cs-bg-area-colored', label: '--vs-cs-surface-tinted' },
            { key: 'vs-cs-bg', label: '--vs-cs-bg' },
            { key: 'vs-cs-bg-colored', label: '--vs-cs-bg-tinted' },
            { key: 'vs-cs-bg-comp', label: '--vs-cs-bg-comp' },
            { key: 'vs-cs-bg-comp-colored', label: '--vs-cs-bg-comp-tinted' },
            { key: 'vs-cs-bg-primary', label: '--vs-cs-primary' },
            { key: 'vs-cs-shadow-color', label: '--vs-cs-shadow' },
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
