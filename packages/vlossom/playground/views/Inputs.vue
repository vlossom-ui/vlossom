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
        <vs-form :grid-size="12" column-gap="1.5rem" row-gap="3rem">
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
        </vs-form>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsDatePicker</h3>
        <vs-form :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-date-picker v-model="dpDate" type="date" label="Date" :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-date-picker placeholder="No label" :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-date-picker
                v-model="dpDatetime"
                type="datetime-local"
                label="Datetime"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-date-picker v-model="dpTime" type="time" label="Time" :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-date-picker v-model="dpMonth" type="month" label="Month" :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-date-picker label="Disabled" type="date" disabled :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-date-picker
                :model-value="dpReadonlyValue"
                label="Readonly"
                type="date"
                readonly
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-date-picker
                v-model="dpRequired"
                label="Required"
                type="date"
                required
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-date-picker
                v-model="dpTz"
                type="datetime-local"
                label="Datetime + Timezone (responsive)"
                timezone
                responsive
                @timezone-change="onTzChange"
                :grid="{ xs: 12, md: 6, lg: 6 }"
            />
            <vs-date-picker
                v-model="dpTzCustom"
                type="datetime-local"
                label="Custom Timezones (Asia, responsive)"
                timezone
                responsive
                :timezone-options="dpAsiaTz"
                @timezone-change="onTzChange"
                :grid="{ xs: 12, md: 6, lg: 6 }"
            />
        </vs-form>
        <vs-divider style-set="playground" />

        <h3 class="mb-4 font-semibold">VsSelect</h3>
        <vs-form :grid-size="12" column-gap="1.5rem" row-gap="3rem">
            <vs-select
                v-model="selectValue"
                label="Basic"
                placeholder="Select a fruit..."
                :options="selectOptions"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-select placeholder="No label" :options="selectOptions" :grid="{ xs: 12, md: 6, lg: 3 }" />
            <vs-select
                v-model="selectSearchValue"
                label="With Search"
                placeholder="Select a fruit..."
                :options="selectOptions"
                search
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-select
                v-model="selectObjectValue"
                label="Object Options"
                placeholder="Select a color..."
                :options="colorOptions"
                option-label="label"
                option-value="value"
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-select
                v-model="selectMultipleValue"
                label="Multiple"
                placeholder="Select fruits..."
                :options="selectOptions"
                multiple
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-select
                v-model="selectAllValue"
                label="Multiple + Select All + Search"
                placeholder="Select fruits..."
                :options="selectOptions"
                multiple
                select-all
                search
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-select
                v-model="selectCollapseValue"
                label="Collapse Chips"
                placeholder="Select fruits..."
                :options="selectOptions"
                multiple
                collapse-chips
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-select
                v-model="selectClosableValue"
                label="Closable Chips"
                placeholder="Select fruits..."
                :options="selectOptions"
                multiple
                closable-chips
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-select
                label="Disabled"
                placeholder="Disabled"
                :options="selectOptions"
                disabled
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-select
                label="Readonly"
                :model-value="selectOptions[0]"
                :options="selectOptions"
                readonly
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
            <vs-select
                v-model="selectRequiredValue"
                label="Required"
                placeholder="Select a fruit..."
                :options="selectOptions"
                required
                :grid="{ xs: 12, md: 6, lg: 3 }"
            />
        </vs-form>
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
                <vs-chip v-for="item in filteredFruits" :key="item" size="xs">{{ item }}</vs-chip>
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

        const selectOptions = [
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

        const colorOptions = [
            { label: 'Red', value: 'red' },
            { label: 'Green', value: 'green' },
            { label: 'Blue', value: 'blue' },
            { label: 'Yellow', value: 'yellow' },
            { label: 'Purple', value: 'purple' },
            { label: 'Orange', value: 'orange' },
            { label: 'Pink', value: 'pink' },
            { label: 'Brown', value: 'brown' },
        ];

        const selectValue = ref(null);
        const selectSearchValue = ref(null);
        const selectObjectValue = ref(null);
        const selectMultipleValue: Ref<string[]> = ref([]);
        const selectAllValue: Ref<string[]> = ref([]);
        const selectCollapseValue: Ref<string[]> = ref([]);
        const selectClosableValue: Ref<string[]> = ref([]);
        const selectRequiredValue = ref(null);
        const selectLongValue = ref(null);

        // VsDatePicker state
        const dpDate: Ref<Date | null> = ref(null);
        const dpDatetime: Ref<Date | null> = ref(null);
        const dpTime: Ref<Date | null> = ref(null);
        const dpMonth: Ref<Date | null> = ref(null);
        const dpRequired: Ref<Date | null> = ref(null);
        const dpReadonlyValue: Ref<Date | null> = ref(new Date('2026-05-18T00:00:00Z'));
        const dpTz: Ref<Date | null> = ref(new Date('2026-05-18T15:30:00Z'));
        const dpTzCustom: Ref<Date | null> = ref(null);
        const dpAsiaTz = [
            { value: 'Asia/Seoul', label: '서울 (UTC+09:00)' },
            { value: 'Asia/Tokyo', label: '도쿄 (UTC+09:00)' },
            { value: 'Asia/Shanghai', label: '상하이 (UTC+08:00)' },
            { value: 'Asia/Kolkata', label: '콜카타 (UTC+05:30)' },
            { value: 'Asia/Dubai', label: '두바이 (UTC+04:00)' },
        ];
        function onTzChange(payload: { from: string; to: string }) {
            console.info(`[VsDatePicker] timezone: ${payload.from} → ${payload.to}`);
        }

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
            selectOptions,
            colorOptions,
            selectValue,
            selectSearchValue,
            selectObjectValue,
            selectMultipleValue,
            selectAllValue,
            selectCollapseValue,
            selectClosableValue,
            selectRequiredValue,
            selectLongValue,
            dpDate,
            dpDatetime,
            dpTime,
            dpMonth,
            dpRequired,
            dpReadonlyValue,
            dpTz,
            dpTzCustom,
            dpAsiaTz,
            onTzChange,
        };
    },
});
</script>
