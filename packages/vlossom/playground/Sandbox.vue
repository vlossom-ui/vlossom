<template>
    <vs-page class="mb-8" :style-set="{ padding: '0' }">
        <template #title>
            <h1 class="text-2xl font-bold">Line Tiers</h1>
        </template>

        <h3 class="mb-4 font-semibold">Input components by size</h3>
        <p class="mb-4 text-sm">
            Every input component at every size, one row per size. Controls in a row are centered on a single line, so a
            control whose box is taller or shorter than the others shows up as a misalignment.
        </p>
        <div class="mb-8 flex w-full flex-col gap-4">
            <div v-for="size in sizes" :key="size" class="flex flex-wrap items-center gap-3">
                <code class="size-name">{{ size }}</code>
                <vs-input v-model="text" :size width="16rem" placeholder="Input" />
                <vs-search-input :size width="16rem" placeholder="Search" />
                <vs-select v-model="fruit" :size width="16rem" :options="fruits" placeholder="Select" />
                <vs-date-picker v-model="date" :size width="16rem" />
                <vs-checkbox v-model="checked" :size width="16rem" check-label="Checkbox" />
                <vs-radio-set v-model="choice" :size width="16rem" :options="['One', 'Two']" />
                <vs-switch v-model="toggled" :size width="16rem" true-label="ON" false-label="OFF" />
                <vs-textarea v-model="text" :size width="16rem" placeholder="Textarea" />
            </div>
        </div>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">Line Tiers</h3>
        <p class="mb-8 text-sm">
            Lines come in two tiers. <code>--vs-cs-line</code> is the default for anything at rest, and
            <code>--vs-cs-line-strong</code> is one step up for lines that need to be noticed. Toggle the theme in the
            header and pick a color scheme in the panel to check every combination.
        </p>

        <h3 class="mb-4 font-semibold">Tier reference</h3>
        <div class="tier-legend mb-4">
            <div v-for="tier in tiers" :key="tier.key" class="tier-row">
                <div class="tier-swatch" :style="{ backgroundColor: `var(${tier.key})` }" />
                <code class="tier-name">{{ tier.key }}</code>
                <span class="text-sm">{{ tier.role }}</span>
            </div>
        </div>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">--vs-cs-line — everything at rest</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="1.5rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm">Outer borders</h4>
                <div class="flex flex-col gap-2">
                    <vs-input v-model="text" placeholder="Resting border" />
                    <div class="flex flex-wrap items-center gap-2">
                        <vs-button>Button</vs-button>
                        <vs-chip>Chip</vs-chip>
                        <vs-chip outline>Outline</vs-chip>
                    </div>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm">Title divider inside a block</h4>
                <vs-block>
                    <template #title>Block Title</template>
                    The outer border and the title divider share one tier, so neither competes with the content.
                </vs-block>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm">Divider and label-value</h4>
                <div class="flex flex-col gap-1">
                    <span class="text-sm">Above the divider</span>
                    <vs-divider />
                    <span class="mb-2 text-sm">Below the divider</span>
                    <vs-label-value>
                        <template #label>Name</template>
                        Vlossom
                    </vs-label-value>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm">Form controls rest here too</h4>
                <div class="flex flex-col gap-3">
                    <vs-checkbox v-model="checked" check-label="Checkbox" />
                    <vs-radio-set v-model="choice" :options="['One', 'Two']" />
                    <vs-switch v-model="toggled" label="Switch" />
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">--vs-cs-line-strong — lines that need to be noticed</h3>
        <p class="mb-4 text-sm">
            Press <kbd>Tab</kbd> to move focus through the controls below, and hover the drop zone. Interaction states
            step up exactly one tier from the resting border, which is enough to read without shouting. The same tier
            draws separators that delimit a region.
        </p>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="1.5rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm">Focus ring</h4>
                <div class="flex flex-wrap items-center gap-2">
                    <vs-button>Focus me</vs-button>
                    <vs-checkbox v-model="focusChecked" check-label="And me" />
                    <vs-switch v-model="focusToggled" />
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm">Hover outline, and the dashed outline while dragging files over</h4>
                <vs-file-drop placeholder="Hover or drag over me" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm">Tabs: the rail rests, hover and the active tab step up</h4>
                <vs-tabs v-model="tab" :tabs="['First', 'Second', 'Third']" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, lg: 7 }">
                <h4 class="mb-2 text-sm">Table: only the header/body separator steps up, the grid and frame rest</h4>
                <vs-table :columns="tableColumns" :items="tableItems" no-virtual-scroll no-responsive />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, lg: 5 }">
                <h4 class="mb-2 text-sm">Floating surfaces keep a stepped-up edge</h4>
                <vs-select v-model="fruit" placeholder="Options panel edge steps up" :options="fruits" />
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">All schemes on every background tier</h3>
        <p class="mb-4 text-sm">
            Each cell stacks <code>--vs-cs-line</code> over <code>--vs-cs-line-strong</code> on one background tier. A
            tier that disappears against its background, or that is not weaker than the tier below it, is a bug.
        </p>
        <table class="line-matrix">
            <thead>
                <tr>
                    <th class="text-left">Color Scheme</th>
                    <th v-for="bg in backgrounds" :key="bg.key">
                        <code>{{ bg.label }}</code>
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="scheme in schemes" :key="scheme">
                    <th class="scheme-name text-left">{{ scheme }}</th>
                    <td v-for="bg in backgrounds" :key="bg.key" :class="`vs-cs-${scheme}`">
                        <div class="line-cell" :style="{ backgroundColor: `var(${bg.key})` }">
                            <div
                                v-for="tier in tiers"
                                :key="tier.key"
                                :style="{ backgroundColor: `var(${tier.key})` }"
                            />
                        </div>
                    </td>
                </tr>
            </tbody>
        </table>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { COLORS, SIZES } from '@/declaration';

export default defineComponent({
    name: 'Sandbox',
    setup() {
        const tiers = [
            { key: '--vs-cs-line', role: 'Default. Everything at rest, including form controls.' },
            { key: '--vs-cs-line-strong', role: 'Focus, hover, active, and separators that delimit a region.' },
        ];

        const backgrounds = [
            { key: '--vs-cs-bg-area', label: 'bg-area' },
            { key: '--vs-cs-bg', label: 'bg' },
            { key: '--vs-cs-bg-colored', label: 'bg-colored' },
            { key: '--vs-cs-bg-comp', label: 'bg-comp' },
            { key: '--vs-cs-bg-comp-colored', label: 'bg-comp-colored' },
        ];

        const schemes = ['default', ...COLORS];

        const tableColumns = [
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role' },
        ];
        const tableItems = [
            { id: 1, name: 'Alice', role: 'admin' },
            { id: 2, name: 'Bob', role: 'editor' },
            { id: 3, name: 'Charlie', role: 'viewer' },
        ];

        return {
            sizes: SIZES,
            tiers,
            backgrounds,
            schemes,
            tableColumns,
            tableItems,
            text: ref(''),
            checked: ref(false),
            choice: ref('One'),
            toggled: ref(false),
            fruit: ref<string | null>(null),
            date: ref(''),
            fruits: ['Apple', 'Banana', 'Cherry'],
            focusChecked: ref(false),
            focusToggled: ref(false),
            tab: ref(0),
        };
    },
});
</script>

<style scoped>
.size-name {
    width: 2rem;
    font-size: 0.75rem;
}

.tier-legend {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.tier-row {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.tier-swatch {
    width: 3rem;
    height: 1.25rem;
    border-radius: 3px;
}

.tier-name {
    width: 12rem;
    font-size: 0.75rem;
}

.line-matrix {
    border-collapse: collapse;
    font-size: 0.75rem;
}

.line-matrix th,
.line-matrix td {
    padding: 0.25rem 0.5rem;
}

.scheme-name {
    font-family: monospace;
    font-weight: 600;
}

.line-cell {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    width: 7rem;
    height: 2.75rem;
    padding: 0.4rem 0;
}

.line-cell > div {
    height: 1px;
}
</style>
