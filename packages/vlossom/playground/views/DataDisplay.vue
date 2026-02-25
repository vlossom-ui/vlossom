<template>
    <section>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Data Display</h2>

        <h3 class="mb-4 font-semibold">VsImage</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <vs-image
                    src="https://picsum.photos/200/200"
                    alt="Sample Image"
                    :style-set="{ variables: { width: '120px', height: '120px' } }"
                />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Lazy Loading</h4>
                <vs-image
                    src="https://picsum.photos/201/201"
                    alt="Lazy Image"
                    lazy
                    :style-set="{ variables: { width: '120px', height: '120px' } }"
                />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Fallback</h4>
                <vs-image
                    src="https://invalid-url-example.com/image.jpg"
                    fallback="/assets/vlossom-logo.png"
                    alt="Fallback Image"
                    :style-set="{ variables: { width: '120px', height: '120px' } }"
                />
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsLabelValue</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <div class="flex flex-col gap-1">
                    <vs-label-value>
                        <template #label>Name</template>
                        Vlossom
                    </vs-label-value>
                    <vs-label-value>
                        <template #label>Version</template>
                        2.0.0
                    </vs-label-value>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Primary</h4>
                <div class="flex flex-col gap-1">
                    <vs-label-value primary>
                        <template #label>Status</template>
                        Active
                    </vs-label-value>
                    <vs-label-value primary>
                        <template #label>Status</template>
                        Inactive
                    </vs-label-value>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Dense</h4>
                <div class="flex flex-col gap-0.5">
                    <vs-label-value dense>
                        <template #label>Item 1</template>
                        Value 1
                    </vs-label-value>
                    <vs-label-value dense>
                        <template #label>Item 2</template>
                        Value 2
                    </vs-label-value>
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsMessage</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">States</h4>
                <div class="flex flex-col gap-2">
                    <vs-message state="info" text="This is an info message" />
                    <vs-message state="success" text="This is a success message" />
                    <vs-message state="warning" text="This is a warning message" />
                    <vs-message state="error" text="This is an error message" />
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Sizes</h4>
                <div class="flex flex-col gap-2">
                    <vs-message state="info" text="XS message" size="xs" />
                    <vs-message state="info" text="SM message" size="sm" />
                    <vs-message state="info" text="MD message" />
                    <vs-message state="info" text="LG message" size="lg" />
                    <vs-message state="info" text="XL message" size="xl" />
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsPagination</h3>
        <vs-grid :grid-size="12" column-gap="2.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <vs-pagination v-model="pageDefault" :length="20" :showing-length="5" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Edge Buttons</h4>
                <vs-pagination v-model="pageEdgeButtons" :length="20" :showing-length="5" edge-buttons />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Variants</h4>
                <div class="flex flex-col gap-2">
                    <vs-pagination v-model="pageOutline" :length="10" :showing-length="5" outline />
                    <vs-pagination v-model="pageGhost" :length="10" :showing-length="5" ghost />
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsProgress</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="12">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">State</h4>
                <div
                    class="flex w-40 flex-col items-center justify-center gap-2 rounded border border-dashed
                        border-gray-300 p-3 dark:border-gray-600"
                >
                    <vs-chip :style-set="{ component: { width: '80px' } }">{{ progressValue }}%</vs-chip>
                    <div class="flex gap-2">
                        <vs-button size="sm" :style-set="{ component: { width: '2.5rem' } }" @click="decreaseProgress"
                            >-</vs-button
                        >
                        <vs-button size="sm" :style-set="{ component: { width: '2.5rem' } }" @click="increaseProgress"
                            >+</vs-button
                        >
                    </div>
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <vs-progress :value="progressValue" :max="100" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">With Label</h4>
                <vs-progress :value="progressValue" :max="100" :label="`${progressValue}%`" />
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsSteps</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <vs-steps v-model="stepDefault" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">No Label</h4>
                <vs-steps v-model="stepNoLabel" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" no-label />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Vertical</h4>
                <vs-steps v-model="stepVertical" :steps="['Step 1', 'Step 2', 'Step 3']" vertical height="150px" />
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsTextWrap</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Copy</h4>
                <vs-text-wrap copy>Copy this text to clipboard</vs-text-wrap>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Link</h4>
                <vs-text-wrap link="https://github.com">Open GitHub</vs-text-wrap>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 4 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Both</h4>
                <vs-text-wrap copy link="https://github.com">Copy and open link</vs-text-wrap>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsTable</h3>
        <div class="mb-4 rounded border border-dashed border-gray-300 p-3 dark:border-gray-600">
            <vs-checkbox-set
                v-model="tablePropsSelected"
                :options="tablePropsOptions"
                option-label="label"
                option-value="value"
                :style-set="{ wrapper: { component: { width: '100%' } } }"
            />
        </div>
        <vs-table
            :columns="tableColumns"
            :items="tableItems"
            :dense="tablePropsSelected.includes('dense')"
            :primary="tablePropsSelected.includes('primary')"
            :selectable="tablePropsSelected.includes('selectable')"
            :no-responsive="tablePropsSelected.includes('noResponsive')"
            :sticky-header="tablePropsSelected.includes('stickyHeader')"
            :loading="tablePropsSelected.includes('loading')"
            :draggable="tablePropsSelected.includes('draggable')"
            :expandable="tablePropsSelected.includes('expandable')"
            :search="tablePropsSelected.includes('search')"
            :pagination="tablePropsSelected.includes('pagination')"
            :state="tablePropsSelected.includes('state') ? getRowState : 'idle'"
            v-model:selected-items="tableSelectedItems"
        >
            <template #body-row1="{ item }">
                <div v-if="tablePropsSelected.includes('customSlot')">
                    <vs-input v-model="item.score" />
                </div>
                <span v-else class="w-full"> {{ item.score }} </span>
            </template>
            <template #body-col2="{ item }">
                <div v-if="tablePropsSelected.includes('customSlot')">
                    <vs-input v-model="item.score" />
                </div>
                <span v-else class="w-full"> {{ item.score }} </span>
            </template>
            <template #expand="{ cells }">
                <div class="p-3 text-sm text-gray-600 dark:text-gray-400">
                    {{ cells[0]?.item.name }} — Score: {{ cells[0]?.item.score }}
                </div>
            </template>
        </vs-table>

        <p v-if="tablePropsSelected && tableSelectedItems.length" class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            Selected: {{ tableSelectedItems.map((i) => i.name).join(', ') }}
        </p>
    </section>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from 'vue';
import type { UIState } from '@/declaration';
import type { ColumnDef, Item } from '@/components';

export default defineComponent({
    name: 'DataDisplay',
    setup() {
        const progressValue = ref(30);
        const stepDefault = ref(0);
        const stepNoLabel = ref(0);
        const stepVertical = ref(0);
        const pageDefault = ref(0);
        const pageEdgeButtons = ref(0);
        const pageOutline = ref(0);
        const pageGhost = ref(0);

        const MIN_PROGRESS = 0;
        const MAX_PROGRESS = 100;
        const PROGRESS_STEP = 10;

        function increaseProgress() {
            progressValue.value = Math.min(MAX_PROGRESS, progressValue.value + PROGRESS_STEP);
        }

        function decreaseProgress() {
            progressValue.value = Math.max(MIN_PROGRESS, progressValue.value - PROGRESS_STEP);
        }

        // VsTable
        const tablePropsOptions = [
            { value: 'dense', label: 'Dense' },
            { value: 'primary', label: 'Primary' },
            { value: 'selectable', label: 'Selectable' },
            { value: 'noResponsive', label: 'NoResponsive' },
            { value: 'stickyHeader', label: 'StickyHeader' },
            { value: 'loading', label: 'Loading' },
            { value: 'draggable', label: 'Draggable' },
            { value: 'expandable', label: 'Expandable' },
            { value: 'search', label: 'Search' },
            { value: 'pagination', label: 'Pagination' },
            { value: 'state', label: 'UI State' },
            { value: 'textAlignRight', label: 'Text Align Right' },
            { value: 'customSlot', label: 'Custom Slot' },
        ];
        const tablePropsSelected = ref<string[]>([]);
        const tableSelectedItems = ref<Item[]>([]);
        const tableColumns = computed<ColumnDef[]>(() =>
            [
                { key: 'name', label: 'Name', sortable: true },
                { key: 'role', label: 'Role' },
                { key: 'status', label: 'Status' },
                { key: 'score', label: 'Score', sortable: true },
            ].map((column) => ({
                ...column,
                align: tablePropsSelected.value.includes('textAlignRight') ? 'right' : 'left',
            })),
        );
        const tableItems: Item[] = [
            { name: 'Alice', role: 'Admin', status: 'Active', score: 95 },
            { name: 'Bob', role: 'Editor', status: 'Inactive', score: 20 },
            { name: 'Charlie', role: 'Viewer', status: 'Active', score: 88 },
            { name: 'Diana', role: 'Admin', status: 'Active', score: 91 },
            { name: 'Eve', role: 'Editor', status: 'Active', score: 35 },
            { name: 'Frank', role: 'Viewer', status: 'Active', score: 72 },
            { name: 'Grace', role: 'Editor', status: 'Inactive', score: 45 },
            { name: 'Henry', role: 'Admin', status: 'Active', score: 98 },
        ];
        function getRowState(item: Item, index?: number): UIState {
            if (item.status === 'Inactive') {
                return 'error';
            }
            if (index === undefined) {
                return 'idle';
            }
            if (index % 2 === 0) {
                return 'warning';
            }
            if (index % 3 === 0) {
                return 'success';
            }
            if (index % 5 === 0) {
                return 'idle';
            }
            return 'info';
        }

        return {
            progressValue,
            stepDefault,
            stepNoLabel,
            stepVertical,
            pageDefault,
            pageEdgeButtons,
            pageOutline,
            pageGhost,
            increaseProgress,
            decreaseProgress,
            tableSelectedItems,
            tablePropsOptions,
            tablePropsSelected,
            tableColumns,
            tableItems,
            getRowState,
        };
    },
});
</script>
