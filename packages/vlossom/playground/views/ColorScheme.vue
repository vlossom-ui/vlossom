<template>
    <vs-page :style-set="{ component: { padding: '0' } }">
        <template #title>
            <h1 class="text-2xl font-bold">Color Scheme</h1>
        </template>

        <div class="flex flex-col gap-12">
            <!-- Color Scheme Table -->
            <section>
                <div class="overflow-x-auto">
                    <table class="min-w-full border-collapse text-sm">
                        <thead>
                            <tr>
                                <th class="border px-3 py-2 text-left font-semibold">Color Scheme</th>
                                <th
                                    v-for="v in csVariables"
                                    :key="v.key"
                                    class="border px-2 py-2 text-center font-mono text-xs"
                                >
                                    {{ v.label }}
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="cs in colorSchemes" :key="cs.name">
                                <td class="border px-3 py-2 font-mono text-xs font-semibold">
                                    {{ cs.name }}
                                </td>
                                <td v-for="v in csVariables" :key="v.key" class="border p-1">
                                    <div
                                        :class="['cs-swatch', cs.className]"
                                        :title="`${cs.name} / ${v.label}`"
                                        :style="{ backgroundColor: `var(${v.key})` }"
                                    />
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- ───── VsTable ───── -->
            <section>
                <h2 class="section-title">VsTable</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row items-start">
                    <span class="preview-label mt-2">{{ cs.name }}</span>
                    <div class="preview-items w-full">
                        <div class="w-full">
                            <vs-table
                                :color-scheme="cs.value"
                                :columns="tableColumns"
                                :items="tableRows"
                                class="flex-1"
                                dense
                                selectable
                                expandable
                                sticky-header
                                pagination
                                draggable
                            >
                                <template #expand="expandData"> Hello World, {{ expandData }} </template>
                            </vs-table>
                        </div>
                        <div class="w-full">
                            <vs-table
                                :color-scheme="cs.value"
                                :columns="tableColumns"
                                :items="tableRows"
                                class="flex-1"
                                dense
                                selectable
                                expandable
                                sticky-header
                                pagination
                                draggable
                            >
                            </vs-table>
                        </div>
                        <div class="w-full">
                            <vs-table
                                :color-scheme="cs.value"
                                :columns="tableColumns"
                                :items="tableRows"
                                class="flex-1"
                                dense
                                selectable
                                expandable
                                sticky-header
                                pagination
                                primary
                                draggable
                            >
                                <template #expand="expandData"> Hello World, {{ expandData }} </template>
                            </vs-table>
                        </div>
                    </div>
                </div>
            </section>

            <!-- ───── VsButton ───── -->
            <section>
                <h2 class="section-title">VsButton</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-button :color-scheme="cs.value">Default</vs-button>
                        <vs-button :color-scheme="cs.value" primary>Primary</vs-button>
                        <vs-button :color-scheme="cs.value" outline>Outline</vs-button>
                        <vs-button :color-scheme="cs.value" ghost>Ghost</vs-button>
                        <vs-button :color-scheme="cs.value" disabled>Disabled</vs-button>
                    </div>
                </div>
            </section>

            <!-- ───── VsChip ───── -->
            <section>
                <h2 class="section-title">VsChip</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-chip :color-scheme="cs.value" closable>Default</vs-chip>
                        <vs-chip :color-scheme="cs.value" primary closable>Primary</vs-chip>
                        <vs-chip :color-scheme="cs.value" outline closable>Outline</vs-chip>
                    </div>
                </div>
            </section>

            <!-- ───── VsDrawer ───── -->
            <section>
                <h2 class="section-title">VsDrawer</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-button :color-scheme="cs.value" @click="openDrawer(cs.name)">Open Drawer</vs-button>
                    </div>
                </div>
                <vs-drawer v-model="drawerOpen" :color-scheme="activeDrawerCs" title="Drawer Title" esc-close>
                    Drawer content with color-scheme: {{ activeDrawerCs || 'default' }}
                </vs-drawer>
            </section>

            <!-- ───── VsCheckbox ───── -->
            <section>
                <h2 class="section-title">VsCheckbox</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items flex gap-4">
                        <vs-checkbox
                            :color-scheme="cs.value"
                            :model-value="false"
                            check-label="Unchecked"
                        ></vs-checkbox>
                        <vs-checkbox :color-scheme="cs.value" :model-value="true" check-label="Checked"></vs-checkbox>
                        <vs-checkbox
                            :color-scheme="cs.value"
                            :model-value="false"
                            disabled
                            check-label="Disabled"
                        ></vs-checkbox>
                        <vs-checkbox :color-scheme="cs.value" indeterminate check-label="Indeterminate" />
                    </div>
                </div>
            </section>

            <!-- ───── VsSwitch ───── -->
            <section>
                <h2 class="section-title">VsSwitch</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-switch :color-scheme="cs.value" v-model="switchOff" false-label="Offline Switch" />
                        <vs-switch :color-scheme="cs.value" v-model="switchOn" label="On" />
                        <vs-switch :color-scheme="cs.value" v-model="switchOn" disabled label="Disabled" />
                    </div>
                </div>
            </section>

            <!-- ───── VsRadio ───── -->
            <section>
                <h2 class="section-title">VsRadio</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-radio
                            :color-scheme="cs.value"
                            v-model="radioValue"
                            :radio-value="1"
                            radio-label="Option 1"
                        />
                        <vs-radio
                            :color-scheme="cs.value"
                            v-model="radioValue"
                            :radio-value="2"
                            radio-label="Option 2 (selected)"
                        />
                        <vs-radio
                            :color-scheme="cs.value"
                            v-model="radioValue"
                            :radio-value="3"
                            radio-label="Disabled"
                            disabled
                        />
                    </div>
                </div>
            </section>

            <!-- ───── VsBlock ───── -->
            <section>
                <h2 class="section-title">VsBlock</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row items-start">
                    <span class="preview-label mt-2">{{ cs.name }}</span>
                    <div class="preview-items flex-1">
                        <vs-block :color-scheme="cs.value" class="flex-1">
                            <template #title>Block Title</template>
                            Block content area
                        </vs-block>
                    </div>
                </div>
            </section>

            <!-- ───── VsAccordion ───── -->
            <section>
                <h2 class="section-title">VsAccordion</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row items-start">
                    <span class="preview-label mt-2">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-accordion :color-scheme="cs.value">
                            <template #title>Accordion</template>
                            Color scheme content area
                        </vs-accordion>
                        <vs-accordion :color-scheme="cs.value" primary>
                            <template #title>Accordion</template>
                            Primary color scheme content
                        </vs-accordion>
                        <vs-accordion :color-scheme="cs.value" disabled>
                            <template #title>Accordion</template>
                            Disabled state content
                        </vs-accordion>
                    </div>
                </div>
            </section>

            <!-- ───── VsAvatar ───── -->
            <section>
                <h2 class="section-title">VsAvatar</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-avatar :color-scheme="cs.value">AB</vs-avatar>
                    </div>
                </div>
            </section>

            <!-- ───── VsDivider ───── -->
            <section>
                <h2 class="section-title">VsDivider</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row items-start">
                    <span class="preview-label mt-2">{{ cs.name }}</span>
                    <div class="preview-items flex-1 flex-col gap-3">
                        <vs-divider :color-scheme="cs.value" />
                    </div>
                </div>
            </section>

            <!-- ───── VsToggle ───── -->
            <section>
                <h2 class="section-title">VsToggle</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-toggle :color-scheme="cs.value" v-model="toggleOff">Off</vs-toggle>
                        <vs-toggle :color-scheme="cs.value" v-model="toggleOn">On</vs-toggle>
                        <vs-toggle :color-scheme="cs.value" v-model="toggleOn" primary>Primary On</vs-toggle>
                        <vs-toggle :color-scheme="cs.value" v-model="toggleOn" disabled>Disabled</vs-toggle>
                    </div>
                </div>
            </section>
            <!-- ───── VsInput ───── -->
            <section>
                <div class="flex w-full gap-2">
                    <vs-input placeholder="Default" required label="Required" /><vs-button>Search</vs-button>
                    <vs-switch />
                </div>
                <h2 class="section-title">VsInput</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items flex-wrap">
                        <vs-input :color-scheme="cs.value" label="Default" model-value="" placeholder="Default" />
                        <vs-input
                            :color-scheme="cs.value"
                            label="Disabled"
                            model-value=""
                            placeholder="Disabled"
                            disabled
                        />
                    </div>
                </div>
            </section>

            <!-- ───── VsTextarea ───── -->
            <section>
                <h2 class="section-title">VsTextarea</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items flex-wrap">
                        <vs-textarea :color-scheme="cs.value" model-value="" placeholder="Default" />
                        <vs-textarea :color-scheme="cs.value" model-value="" placeholder="Disabled" disabled />
                    </div>
                </div>
            </section>

            <!-- ───── VsSelect ───── -->
            <section>
                <h2 class="section-title">VsSelect</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-select
                            :color-scheme="cs.value"
                            v-model="selectValue"
                            :options="selectOptions"
                            placeholder="Select..."
                        />
                        <vs-select
                            :color-scheme="cs.value"
                            v-model="selectValue"
                            :options="selectOptions"
                            placeholder="Disabled"
                            disabled
                        />
                    </div>
                </div>
            </section>

            <!-- ───── VsSearchInput ───── -->
            <section>
                <h2 class="section-title">VsSearchInput</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-search-input
                            :color-scheme="cs.value"
                            v-model="searchValue"
                            placeholder="Search..."
                            useRegex
                            useCaseSensitive
                        />
                        <vs-search-input
                            :color-scheme="cs.value"
                            v-model="searchValue"
                            placeholder="Disabled"
                            disabled
                            useRegex
                            useCaseSensitive
                        />
                    </div>
                </div>
            </section>

            <!-- ───── VsTabs ───── -->
            <section>
                <h2 class="section-title">VsTabs</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row items-start">
                    <span class="preview-label mt-2">{{ cs.name }}</span>
                    <div class="preview-items flex-1 flex-col gap-2">
                        <vs-tabs :color-scheme="cs.value" v-model="tabValue" :tabs="tabItems" />
                        <vs-tabs :color-scheme="cs.value" v-model="tabValue" :tabs="tabItems" primary />
                        <vs-tabs :color-scheme="cs.value" v-model="tabValue" :tabs="tabItems" dense />
                        <vs-tabs :color-scheme="cs.value" v-model="tabValue" :tabs="tabItems" dense primary />
                    </div>
                </div>
            </section>

            <!-- ───── VsSteps ───── -->
            <section>
                <h2 class="section-title">VsSteps</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row items-start">
                    <span class="preview-label mt-2">{{ cs.name }}</span>
                    <div class="preview-items flex-1 flex-col gap-2">
                        <vs-steps :color-scheme="cs.value" v-model="stepValue" :steps="stepItems" />
                    </div>
                </div>
            </section>

            <!-- ───── VsPagination ───── -->
            <section>
                <h2 class="section-title">VsPagination</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-pagination :color-scheme="cs.value" v-model="pageValue" :length="10" />
                    </div>
                </div>
            </section>

            <!-- ───── VsProgress ───── -->
            <section>
                <h2 class="section-title">VsProgress</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row items-start">
                    <span class="preview-label mt-1">{{ cs.name }}</span>
                    <div class="preview-items flex-1 flex-col gap-2">
                        <vs-progress :color-scheme="cs.value" value="40" max="100" />
                        <vs-progress :color-scheme="cs.value" value="75" max="100" primary />
                    </div>
                </div>
            </section>

            <!-- ───── VsLoading ───── -->
            <section>
                <h2 class="section-title">VsLoading</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-loading :color-scheme="cs.value" width="3rem" height="3rem" />
                        <vs-loading :color-scheme="cs.value" primary width="3rem" height="3rem" />
                    </div>
                </div>
            </section>

            <!-- ───── VsSkeleton ───── -->
            <section>
                <h2 class="section-title">VsSkeleton</h2>
                <div class="preview-row">
                    <span class="preview-label">basic</span>
                    <div class="preview-items">
                        <vs-skeleton :style-set="{ component: { width: '8rem', height: '2rem' } }" />
                        <vs-skeleton
                            :style-set="{ component: { width: '8rem', height: '2rem', borderRadius: '50px' } }"
                        />
                    </div>
                </div>
            </section>

            <!-- ───── VsFileDrop ───── -->
            <section>
                <h2 class="section-title">VsFileDrop</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row items-start">
                    <span class="preview-label mt-2">{{ cs.name }}</span>
                    <div class="preview-items flex-1">
                        <vs-file-drop :color-scheme="cs.value" v-model="fileDropValue" multiple class="flex-1" />
                    </div>
                </div>
            </section>

            <!-- ───── VsLabelValue ───── -->
            <section>
                <h2 class="section-title">VsLabelValue</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items flex-col gap-2">
                        <vs-label-value :color-scheme="cs.value">
                            <template #label>Label</template>
                        </vs-label-value>
                        <vs-label-value :color-scheme="cs.value" primary>
                            <template #label>Primary</template>
                        </vs-label-value>
                        <vs-label-value :color-scheme="cs.value" dense>
                            <template #label>Dense</template>
                        </vs-label-value>
                        <vs-label-value :color-scheme="cs.value" vertical>
                            <template #label>Label</template>
                        </vs-label-value>
                        <vs-label-value :color-scheme="cs.value" vertical primary>
                            <template #label>Primary</template>
                        </vs-label-value>
                        <vs-label-value :color-scheme="cs.value" vertical dense>
                            <template #label>Dense</template>
                        </vs-label-value>
                    </div>
                </div>
            </section>

            <!-- ───── VsMessage ───── -->
            <section>
                <h2 class="section-title">VsMessage (state-driven)</h2>
                <div class="preview-row">
                    <span class="preview-label">states</span>
                    <div class="preview-items flex-col gap-2">
                        <vs-message state="idle" text="Idle message" />
                        <vs-message state="info" text="Info message" />
                        <vs-message state="success" text="Success message" />
                        <vs-message state="warning" text="Warning message" />
                        <vs-message state="error" text="Error message" />
                    </div>
                </div>
            </section>

            <!-- ───── VsTooltip ───── -->
            <section>
                <h2 class="section-title">VsTooltip</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-button :id="`tooltip-${cs.name}-1`" :color-scheme="cs.value">Hover (Default)</vs-button>
                        <vs-tooltip
                            :color-scheme="cs.value"
                            :target="`#tooltip-${cs.name}-1`"
                            tooltip="Default tooltip"
                        />
                    </div>
                </div>
            </section>

            <!-- ───── VsHeader / VsFooter / VsBar ───── -->
            <section>
                <h2 class="section-title">VsBar (VsHeader / VsFooter)</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row flex-col items-start gap-2">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="flex w-full flex-col gap-2">
                        <vs-header
                            :color-scheme="cs.value"
                            :style-set="{ component: { position: 'static', height: '3rem' } }"
                        >
                            <div class="flex h-full items-center gap-2 px-4">
                                <span class="text-sm font-semibold">Header Default</span>
                            </div>
                        </vs-header>
                        <vs-header
                            :color-scheme="cs.value"
                            primary
                            :style-set="{ component: { position: 'static', height: '3rem' } }"
                        >
                            <div class="flex h-full items-center gap-2 px-4">
                                <span class="text-sm font-semibold">Header Primary</span>
                            </div>
                        </vs-header>
                        <vs-footer
                            :color-scheme="cs.value"
                            :style-set="{ component: { position: 'static', height: '3rem' } }"
                        >
                            <div class="flex h-full items-center justify-center text-sm">Footer Default</div>
                        </vs-footer>
                        <vs-footer
                            :color-scheme="cs.value"
                            primary
                            :style-set="{ component: { position: 'static', height: '3rem' } }"
                        >
                            <div class="flex h-full items-center justify-center text-sm">Footer Primary</div>
                        </vs-footer>
                    </div>
                </div>
            </section>

            <!-- ───── VsModal ───── -->
            <section>
                <h2 class="section-title">VsModal</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-button :color-scheme="cs.value" @click="openModal(cs.name)">Open Modal</vs-button>
                    </div>
                </div>
                <vs-modal v-model="modalOpen" :color-scheme="activeModalCs" title="Modal Title">
                    Modal content with color-scheme: {{ activeModalCs || 'default' }}
                </vs-modal>
            </section>

            <!-- ───── VsToast ───── -->
            <section>
                <h2 class="section-title">VsToast</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-button :color-scheme="cs.value" @click="showToast(cs.name)"> Show Toast </vs-button>
                        <vs-button :color-scheme="cs.value" primary @click="showToast(cs.name, true)">
                            Show Primary Toast
                        </vs-button>
                    </div>
                </div>
            </section>

            <!-- ───── VsTextWrap ───── -->
            <section>
                <h2 class="section-title">VsTextWrap</h2>
                <div class="preview-row">
                    <span class="preview-label">basic</span>
                    <div class="preview-items">
                        <vs-text-wrap copy>Copy this text</vs-text-wrap>
                        <vs-text-wrap link="https://vlossom.dev">Link text</vs-text-wrap>
                    </div>
                </div>
            </section>

            <!-- ───── VsThemeButton ───── -->
            <section>
                <h2 class="section-title">VsThemeButton</h2>
                <div v-for="cs in previewColors" :key="cs.name" class="preview-row">
                    <span class="preview-label">{{ cs.name }}</span>
                    <div class="preview-items">
                        <vs-theme-button :color-scheme="cs.value" />
                    </div>
                </div>
            </section>
        </div>
    </vs-page>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { COLORS } from '@/declaration';
import { useVlossom } from '@/framework';
import type { ColorScheme } from '@/declaration';

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

const previewColors: { name: string; value: ColorScheme | undefined }[] = [
    { name: 'default', value: undefined },
    ...COLORS.map((color) => ({ name: color, value: color as ColorScheme })),
];

export default defineComponent({
    name: 'ColorScheme',
    setup() {
        const $vs = useVlossom();

        // Color scheme table
        const colorSchemes = [
            { name: 'default', className: 'vs-cs-default' },
            ...COLORS.map((color) => ({ name: color, className: `vs-cs-${color}` })),
        ];

        // Form state
        const toggleOff = ref(false);
        const toggleOn = ref(true);
        const switchOff = ref(false);
        const switchOn = ref(true);
        const radioValue = ref(2);
        const fileDropValue = ref<File[]>([]);
        const selectValue = ref(null);
        const searchValue = ref('');
        const tabValue = ref(0);
        const stepValue = ref(1);
        const pageValue = ref(1);

        // Options
        const selectOptions = ['Option 1', 'Option 2', 'Option 3'];
        const tabItems = ['Tab 1', 'Tab 2', 'Tab 3'];
        const stepItems = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];

        // Table
        const tableColumns = [
            { key: 'name', label: 'Name' },
            { key: 'role', label: 'Role' },
        ];
        const tableRows = [
            { name: 'Alice', role: 'Admin' },
            { name: 'Bob', role: 'User' },
            { name: 'Charlie', role: 'Guest' },
            { name: 'David', role: 'Admin' },
            { name: 'Eve', role: 'User' },
            { name: 'Frank', role: 'Guest' },
            { name: 'George', role: 'Admin' },
            { name: 'Hannah', role: 'User' },
            { name: 'Ivy', role: 'Guest' },
            { name: 'Jack', role: 'Admin' },
        ];

        // Modal
        const modalOpen = ref(false);
        const activeModalCs = ref<ColorScheme | undefined>(undefined);
        function openModal(csName: string) {
            activeModalCs.value = csName === 'default' ? undefined : (csName as ColorScheme);
            modalOpen.value = true;
        }

        // Drawer
        const drawerOpen = ref(false);
        const activeDrawerCs = ref<ColorScheme | undefined>(undefined);
        function openDrawer(csName: string) {
            activeDrawerCs.value = csName === 'default' ? undefined : (csName as ColorScheme);
            drawerOpen.value = true;
        }

        // Toast
        function showToast(csName: string, primary = false) {
            const cs = csName === 'default' ? undefined : (csName as ColorScheme);
            $vs.toast.show(`Toast - ${csName}`, { colorScheme: cs, primary });
        }

        return {
            csVariables,
            colorSchemes,
            previewColors,
            fileDropValue,
            toggleOff,
            toggleOn,
            switchOff,
            switchOn,
            radioValue,
            selectValue,
            searchValue,
            tabValue,
            stepValue,
            pageValue,
            selectOptions,
            tabItems,
            stepItems,
            tableColumns,
            tableRows,
            modalOpen,
            activeModalCs,
            openModal,
            drawerOpen,
            activeDrawerCs,
            openDrawer,
            showToast,
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

.section-title {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: 0.75rem;
    padding-bottom: 0.375rem;
    border-bottom: 2px solid var(--vs-line-color);
}

.preview-row {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 0.5rem 0;
    border-bottom: 1px solid var(--vs-line-color);
}

.preview-row:last-child {
    border-bottom: none;
}

.preview-label {
    width: 4.5rem;
    flex-shrink: 0;
    font-size: 0.7rem;
    font-weight: 600;
    font-family: monospace;
    color: var(--vs-comp-font);
    opacity: 0.6;
}

.preview-items {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    flex-wrap: wrap;
}
</style>
