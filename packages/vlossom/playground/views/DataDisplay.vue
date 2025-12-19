<template>
    <section class="section">
        <h2 class="section-title">Data Display</h2>

        <!-- Image -->
        <h3 class="component-title">VsImage</h3>
        <div class="component-row">
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
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Label Value -->
        <h3 class="component-title">VsLabelValue</h3>
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
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Message -->
        <h3 class="component-title">VsMessage</h3>
        <div style="display: flex; flex-direction: column; gap: 0.5rem">
            <vs-message state="info" text="This is an info message" />
            <vs-message state="success" text="This is a success message" />
            <vs-message state="warning" text="This is a warning message" />
            <vs-message state="error" text="This is an error message" />
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Pagination -->
        <h3 class="component-title">VsPagination</h3>
        <vs-pagination v-model="pageValue" :length="20" :showing-length="5" edge-buttons />
        <p style="margin-top: 0.5rem">Current Page: {{ pageValue + 1 }}</p>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Progress -->
        <h3 class="component-title">VsProgress</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem">
            <vs-progress :value="progressValue" :max="100" :label="`${progressValue}%`" />
            <vs-progress :value="0.7" color-scheme="green" />
            <vs-progress :value="0.4" color-scheme="blue" />
            <vs-button small @click="progressValue = Math.min(100, progressValue + 10)">Increase</vs-button>
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Steps -->
        <h3 class="component-title">VsSteps</h3>
        <vs-steps v-model="stepValue" :steps="['Step 1', 'Step 2', 'Step 3', 'Step 4']" />
        <div class="component-row" style="margin-top: 1rem">
            <vs-button small @click="stepValue = Math.max(0, stepValue - 1)">Prev</vs-button>
            <vs-button small @click="stepValue = Math.min(3, stepValue + 1)">Next</vs-button>
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Text Wrap -->
        <h3 class="component-title">VsTextWrap</h3>
        <vs-text-wrap copy>Copy this text to clipboard</vs-text-wrap>
        <vs-text-wrap link="https://github.com" style="margin-top: 0.5rem">Open GitHub</vs-text-wrap>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'DataDisplay',
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

<style scoped>
.section {
    margin-bottom: 2rem;
}

.section-title {
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    padding-bottom: 0.5rem;
    border-bottom: 2px solid var(--vs-line-color);
}

.component-title {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: var(--vs-font-color);
}

.component-row {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    align-items: center;
}
</style>
