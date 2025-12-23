<template>
    <section>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Form Components</h2>

        <h3 class="mb-4 font-semibold">VsCheckbox & VsCheckboxSet</h3>
        <div class="flex flex-col gap-4">
            <vs-checkbox v-model="checkboxValue" check-label="Single Checkbox" />
            <vs-checkbox-set
                v-model="checkboxSetValue"
                label="Checkbox Set"
                :options="['Option A', 'Option B', 'Option C']"
            />
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsFileDrop</h3>
        <vs-file-drop v-model="files" label="Upload Files" placeholder="Drop files here" multiple />
        <Divider />

        <h3 class="mb-4 font-semibold">VsInput</h3>
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
        <Divider />

        <h3 class="mb-4 font-semibold">VsRadioSet</h3>
        <vs-radio-set v-model="radioValue" label="Select Option" :options="['Option 1', 'Option 2', 'Option 3']" />
        <Divider />

        <h3 class="mb-4 font-semibold">VsSearchInput</h3>
        <vs-search-input v-model="searchText" placeholder="Search..." />
        <Divider />

        <h3 class="mb-4 font-semibold">VsSwitch</h3>
        <div class="flex flex-wrap items-center gap-4">
            <vs-switch v-model="switchValue" label="Switch" />
            <vs-switch v-model="switchValue2" label="Custom Labels" true-label="Yes" false-label="No" />
        </div>
        <Divider />

        <h3 class="mb-4 font-semibold">VsTextarea</h3>
        <vs-textarea v-model="textareaValue" label="Description" placeholder="Enter description..." />
        <Divider />

        <SignUpFormExample />
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, type Ref } from 'vue';
import Divider from '../components/Divider.vue';
import SignUpFormExample from '../components/SignUpFormExample.vue';

export default defineComponent({
    name: 'InputsAndForm',
    components: {
        Divider,
        SignUpFormExample,
    },
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
