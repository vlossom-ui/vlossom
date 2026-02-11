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
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

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
        };
    },
});
</script>
