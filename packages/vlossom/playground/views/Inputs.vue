<template>
    <section>
        <h2 class="mb-6 border-b-2 pb-2 text-2xl font-semibold">Input Components</h2>

        <h3 class="mb-4 font-semibold">VsCheckbox & VsCheckboxSet</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <vs-checkbox v-model="checkboxValue" check-label="Single Checkbox" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Checkbox Set (with label)</h4>
                <vs-checkbox-set
                    v-model="checkboxSetValue"
                    label="Checkbox Set"
                    :options="['Option A', 'Option B', 'Option C']"
                />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Checkbox Set (no label)</h4>
                <vs-checkbox-set v-model="noLabelCheckboxSetValue" :options="['Option X', 'Option Y', 'Option Z']" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">States</h4>
                <div class="flex flex-wrap gap-4">
                    <vs-checkbox check-label="Disabled" disabled />
                    <vs-checkbox check-label="Readonly" readonly checked />
                    <vs-checkbox check-label="Indeterminate" indeterminate />
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Sizes</h4>
                <div class="flex flex-wrap gap-4">
                    <vs-checkbox check-label="Small" small />
                    <vs-checkbox check-label="Default" />
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsFileDrop</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-file-drop
                v-model="files"
                label="Upload Files"
                placeholder="Drop files here"
                multiple
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-file-drop placeholder="No label" :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-file-drop label="Disabled" placeholder="Disabled" disabled :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-file-drop label="Readonly" placeholder="Readonly" readonly :grid="{ xs: 12, md: 6, lg: 3 }" />
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsInput</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-input v-model="inputText" label="Text" placeholder="Enter text..." :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-input placeholder="No label" :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-input
                v-model="inputNumber"
                type="number"
                label="Number"
                placeholder="Enter number..."
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input
                v-model="inputPassword"
                type="password"
                label="Password"
                placeholder="Password..."
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-input label="Disabled" placeholder="Disabled" disabled :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-input label="Readonly" model-value="Readonly value" readonly :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-input label="Required" placeholder="Required field" required :grid="{ xs: 12, md: 6, lg: 3 }" />
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsRadio & VsRadioSet</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default</h4>
                <vs-radio v-model="singleRadioValue" radio-label="Single Radio" :radio-value="true" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Radio Set (with label)</h4>
                <vs-radio-set v-model="radioValue" label="Radio Set" :options="['Option 1', 'Option 2', 'Option 3']" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Radio Set (no label)</h4>
                <vs-radio-set v-model="noLabelRadioValue" :options="['Choice A', 'Choice B', 'Choice C']" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">States</h4>
                <div class="flex flex-wrap gap-4">
                    <vs-radio radio-label="Disabled" :radio-value="true" disabled />
                    <vs-radio radio-label="Readonly" :radio-value="true" readonly checked />
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Sizes</h4>
                <div class="flex flex-wrap gap-4">
                    <vs-radio radio-label="Small" :radio-value="true" small />
                    <vs-radio radio-label="Default" :radio-value="true" />
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsSearchInput</h3>
        <div class="flex flex-col gap-4">
            <h4 class="text-sm text-gray-500 dark:text-gray-400">Default</h4>
            <vs-search-input
                ref="searchInputRef"
                v-model="searchText"
                placeholder="Search fruits... (try: ^A or .*berry)"
                use-case-sensitive
                use-regex
                @search="onSearch"
            />
            <div class="flex flex-wrap gap-2">
                <vs-chip v-for="item in filteredFruits" :key="item" small>{{ item }}</vs-chip>
                <span v-if="filteredFruits.length === 0" class="text-sm text-gray-500">No results found</span>
            </div>
        </div>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsSwitch</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Default (with label)</h4>
                <vs-switch v-model="switchValue" label="Switch" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">No label</h4>
                <vs-switch v-model="noLabelSwitchValue" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Custom Labels</h4>
                <vs-switch v-model="switchValue2" label="Custom Labels" true-label="Yes" false-label="No" />
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">States</h4>
                <div class="flex flex-wrap gap-4">
                    <vs-switch label="Disabled" disabled />
                    <vs-switch label="Readonly" readonly checked />
                </div>
            </vs-responsive>
            <vs-responsive :grid="{ xs: 12, md: 6, lg: 3 }">
                <h4 class="mb-2 text-sm text-gray-500 dark:text-gray-400">Sizes</h4>
                <div class="flex flex-wrap gap-4">
                    <vs-switch label="Small" small />
                    <vs-switch label="Default" />
                </div>
            </vs-responsive>
        </vs-grid>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsTextarea</h3>
        <vs-grid :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-textarea
                v-model="textareaValue"
                label="Description"
                placeholder="Enter description..."
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-textarea placeholder="No label" :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-textarea label="Disabled" placeholder="Disabled" disabled :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-textarea label="Readonly" model-value="Readonly content" readonly :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-textarea label="Small" placeholder="Small textarea" small :grid="{ xs: 12, md: 6, lg: 3 }" />
        </vs-grid>
    </section>
</template>

<script lang="ts">
import { defineComponent, ref, useTemplateRef, type Ref, type TemplateRef } from 'vue';
import type { VsSearchInputRef } from '@/components/vs-search-input/types';

export default defineComponent({
    name: 'Inputs',
    setup() {
        const inputText = ref('');
        const inputNumber: Ref<number | null> = ref(null);
        const inputPassword = ref('');
        const searchText = ref('');
        const searchInputRef: TemplateRef<VsSearchInputRef> = useTemplateRef('searchInputRef');
        const fruits = [
            'Apple',
            'Banana',
            'Cherry',
            'Grape',
            'Lemon',
            'Mango',
            'Orange',
            'Peach',
            'Strawberry',
            'Watermelon',
        ];
        const filteredFruits: Ref<string[]> = ref([...fruits]);

        function onSearch() {
            filteredFruits.value = fruits.filter((fruit) => searchInputRef.value?.match(fruit) ?? true);
        }
        const textareaValue = ref('');
        const checkboxValue = ref(false);
        const checkboxSetValue: Ref<string[]> = ref([]);
        const noLabelCheckboxSetValue: Ref<string[]> = ref([]);
        const singleRadioValue = ref(false);
        const radioValue = ref(null);
        const noLabelRadioValue = ref(null);
        const switchValue = ref(false);
        const switchValue2 = ref(false);
        const noLabelSwitchValue = ref(false);
        const files: Ref<File[]> = ref([]);

        return {
            inputText,
            inputNumber,
            inputPassword,
            searchText,
            searchInputRef,
            filteredFruits,
            onSearch,
            textareaValue,
            checkboxValue,
            checkboxSetValue,
            noLabelCheckboxSetValue,
            singleRadioValue,
            radioValue,
            noLabelRadioValue,
            switchValue,
            switchValue2,
            noLabelSwitchValue,
            files,
        };
    },
});
</script>
