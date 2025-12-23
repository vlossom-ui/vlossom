<template>
    <section>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Data Display</h2>

        <h3 class="mb-4 font-semibold">VsImage</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-image
                src="https://picsum.photos/200/200"
                alt="Sample Image"
                :style-set="{ width: '150px', height: '150px' }"
            />
            <vs-image
                src="https://picsum.photos/201/201"
                alt="Lazy Image"
                lazy
                :style-set="{ width: '150px', height: '150px' }"
            />
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsLabelValue</h3>
        <vs-grid :grid-size="12" row-gap="0.5rem">
            <vs-label-value :grid="12">
                <template #label>Name</template>
                Vlossom
            </vs-label-value>
            <vs-label-value :grid="12">
                <template #label>Version</template>
                2.0.0
            </vs-label-value>
            <vs-label-value :grid="12" primary>
                <template #label>Status</template>
                Active
            </vs-label-value>
        </vs-grid>
        <Divider />

        <h3 class="mb-4 font-semibold">VsMessage</h3>
        <div class="flex flex-col gap-2">
            <vs-message state="info" text="This is an info message" />
            <vs-message state="success" text="This is a success message" />
            <vs-message state="warning" text="This is a warning message" />
            <vs-message state="error" text="This is an error message" />
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsPagination</h3>
        <vs-pagination v-model="pageValue" :length="20" :showing-length="5" edge-buttons />
        <p class="mt-2">Current Page: {{ pageValue + 1 }}</p>
        <Divider />

        <h3 class="mb-4 font-semibold">VsProgress</h3>
        <div class="flex flex-col gap-4">
            <vs-progress :value="progressValue" :max="100" :label="`${progressValue}%`" />
            <vs-progress :value="0.7" color-scheme="green" />
            <vs-progress :value="0.4" color-scheme="blue" />
            <vs-button small @click="progressValue = Math.min(100, progressValue + 10)">Increase</vs-button>
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsSteps</h3>
        <vs-steps v-model="stepValue" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" />
        <Divider />

        <h3 class="mb-4 font-semibold">VsTextWrap</h3>
        <div class="flex flex-col gap-2">
            <vs-text-wrap copy>Copy this text to clipboard</vs-text-wrap>
            <vs-text-wrap link="https://github.com" class="mt-2">Open GitHub</vs-text-wrap>
        </div>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import Divider from '../components/Divider.vue';

export default defineComponent({
    name: 'DataDisplay',
    components: {
        Divider,
    },
    setup() {
        const progressValue = ref(30);
        const stepValue = ref(0);
        const pageValue = ref(0);

        return {
            progressValue,
            stepValue,
            pageValue,
        };
    },
});
</script>
