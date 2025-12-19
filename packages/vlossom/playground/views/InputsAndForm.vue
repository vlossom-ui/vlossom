<template>
    <section class="section">
        <h2 class="section-title">Form Components</h2>

        <!-- Checkbox -->
        <h3 class="component-title">VsCheckbox & VsCheckboxSet</h3>
        <div style="display: flex; flex-direction: column; gap: 1rem">
            <vs-checkbox v-model="checkboxValue" check-label="Single Checkbox" />
            <vs-checkbox-set
                v-model="checkboxSetValue"
                label="Checkbox Set"
                :options="['Option A', 'Option B', 'Option C']"
            />
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- File Drop -->
        <h3 class="component-title">VsFileDrop</h3>
        <vs-file-drop v-model="files" label="Upload Files" placeholder="Drop files here" multiple />
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Input -->
        <h3 class="component-title">VsInput</h3>
        <vs-grid :grid-size="12" column-gap="1rem" row-gap="1rem">
            <vs-input v-model="inputText" label="Text Input" placeholder="Enter text..." :grid="6" />
            <vs-input
                v-model="inputNumber"
                type="number"
                label="Number Input"
                placeholder="Enter number..."
                :grid="6"
            />
            <vs-input
                v-model="inputPassword"
                type="password"
                label="Password"
                placeholder="Enter password..."
                :grid="6"
            />
            <vs-input label="Disabled" placeholder="Disabled input" disabled :grid="6" />
            <vs-input label="Readonly" placeholder="Readonly input" readonly model-value="Readonly" :grid="6" />
            <vs-input label="Required" placeholder="Required field" required :grid="6" />
        </vs-grid>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Radio -->
        <h3 class="component-title">VsRadioSet</h3>
        <vs-radio-set v-model="radioValue" label="Select Option" :options="['Option 1', 'Option 2', 'Option 3']" />
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Search Input -->
        <h3 class="component-title">VsSearchInput</h3>
        <vs-search-input v-model="searchText" placeholder="Search..." />
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Switch -->
        <h3 class="component-title">VsSwitch</h3>
        <div class="component-row">
            <vs-switch v-model="switchValue" label="Switch" />
            <vs-switch v-model="switchValue2" label="Custom Labels" true-label="Yes" false-label="No" />
        </div>
        <vs-divider style="margin: 1.5rem 0" />

        <!-- Textarea -->
        <h3 class="component-title">VsTextarea</h3>
        <vs-textarea v-model="textareaValue" label="Description" placeholder="Enter description..." />
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';

export default defineComponent({
    name: 'InputsAndForm',
    setup() {
        const inputText = ref('');
        const inputNumber: Ref<number | null> = ref(null);
        const inputPassword = ref('');
        const searchText = ref('');
        const textareaValue = ref('');
        const checkboxValue = ref(false);
        const checkboxSetValue: Ref<string[]> = ref([]);
        const radioValue = ref(null);
        const switchValue = ref(false);
        const switchValue2 = ref(false);
        const files: Ref<File[]> = ref([]);

        return {
            inputText,
            inputNumber,
            inputPassword,
            searchText,
            textareaValue,
            checkboxValue,
            checkboxSetValue,
            radioValue,
            switchValue,
            switchValue2,
            files,
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
