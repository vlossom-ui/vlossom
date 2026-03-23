> 한국어: [README.ko.md](./README.ko.md)

# VsSelect

A dropdown selection component supporting single and multiple selection. Provides search, select-all, grouping, and other powerful features.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Single Selection

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        placeholder="Select an option"
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange'];
const selected = ref(null);
</script>
```

### Multiple Selection

```html
<template>
    <vs-select
        v-model="selectedItems"
        :options="options"
        placeholder="Select multiple options"
        multiple
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange'];
const selectedItems = ref([]);
</script>
```

### Object Array Options

```html
<template>
    <vs-select
        v-model="selectedUserId"
        :options="users"
        option-label="name"
        option-value="id"
        placeholder="Select a user"
    />
</template>

<script setup>
import { ref } from 'vue';
const users = [
    { id: 1, name: 'John Doe' },
    { id: 2, name: 'Jane Smith' },
    { id: 3, name: 'Bob Johnson' },
];
const selectedUserId = ref(null);
</script>
```

### Search

```html
<template>
    <vs-select
        v-model="selected"
        :options="longOptions"
        placeholder="Search to select"
        search
    />
</template>

<script setup>
import { ref } from 'vue';
const longOptions = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple', 'Strawberry'];
const selected = ref(null);
</script>
```

### Custom Search Options

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        :search="{
            useRegex: false,
            useCaseSensitive: false,
            placeholder: 'Type to search...'
        }"
    />
</template>
```

### Select All (Multiple Mode)

```html
<template>
    <vs-select
        v-model="selectedItems"
        :options="options"
        placeholder="Select multiple options"
        multiple
        select-all
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange', 'Mango'];
const selectedItems = ref([]);
</script>
```

### Grouped Options

```html
<template>
    <vs-select
        v-model="selected"
        :options="groupedOptions"
        option-label="name"
        option-value="id"
        group-by="category"
        placeholder="Select by category"
    />
</template>

<script setup>
import { ref } from 'vue';
const groupedOptions = [
    { id: 1, name: 'Apple', category: 'Fruits' },
    { id: 2, name: 'Banana', category: 'Fruits' },
    { id: 3, name: 'Carrot', category: 'Vegetables' },
    { id: 4, name: 'Broccoli', category: 'Vegetables' },
];
const selected = ref(null);
</script>
```

### Disabled Options

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        :options-disabled="(option) => option.unavailable"
        option-label="name"
        option-value="id"
    />
</template>

<script setup>
import { ref } from 'vue';
const options = [
    { id: 1, name: 'Apple', unavailable: false },
    { id: 2, name: 'Banana', unavailable: true },
    { id: 3, name: 'Orange', unavailable: false },
];
const selected = ref(null);
</script>
```

### Selection Limit (Multiple Mode)

```html
<template>
    <vs-select
        v-model="selectedItems"
        :options="options"
        placeholder="Select up to 3 items"
        multiple
        :min="1"
        :max="3"
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'];
const selectedItems = ref([]);
</script>
```

### Chips (Multiple Mode)

```html
<template>
    <vs-select
        v-model="selectedItems"
        :options="options"
        multiple
        closable-chips
        collapse-chips
    />
</template>

<script setup>
import { ref } from 'vue';
const options = ['Apple', 'Banana', 'Orange', 'Mango', 'Pineapple'];
const selectedItems = ref([]);
</script>
```

### Custom Option Template

```html
<template>
    <vs-select v-model="selected" :options="users" option-label="name" option-value="id">
        <template #option="{ label, email, selected }">
            <div :class="{ 'selected-option': selected }">
                <strong>{{ label }}</strong>
                <span>{{ email }}</span>
            </div>
        </template>
    </vs-select>
</template>

<script setup>
import { ref } from 'vue';
const users = [
    { id: 1, name: 'John Doe', email: 'john@example.com' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
];
const selected = ref(null);
</script>
```

## Props

| Prop              | Type                                              | Default                   | Required | Description                                                      |
| ----------------- | ------------------------------------------------- | ------------------------- | -------- | ---------------------------------------------------------------- |
| `colorScheme`     | `ColorScheme`                                     | -                         | -        | Color scheme for the component                                   |
| `styleSet`        | `string \| VsSelectStyleSet`                      | -                         | -        | Custom style configuration object                                |
| `disabled`        | `boolean`                                         | `false`                   | -        | Disable the component                                            |
| `hidden`          | `boolean`                                         | `false`                   | -        | Hide the component                                               |
| `id`              | `string`                                          | `''`                      | -        | Component id                                                     |
| `label`           | `string`                                          | `''`                      | -        | Input field label                                                |
| `noLabel`         | `boolean`                                         | `false`                   | -        | Hide the label area                                              |
| `noMessages`      | `boolean`                                         | `false`                   | -        | Hide the messages area                                           |
| `required`        | `boolean`                                         | `false`                   | -        | Mark as required                                                 |
| `small`           | `boolean`                                         | `false`                   | -        | Apply small size                                                 |
| `messages`        | `Message[]`                                       | `[]`                      | -        | Validation messages to display                                   |
| `name`            | `string`                                          | `''`                      | -        | The `name` attribute of the input element                        |
| `noDefaultRules`  | `boolean`                                         | `false`                   | -        | Disable built-in validation rules                                |
| `placeholder`     | `string`                                          | `''`                      | -        | Placeholder text when nothing is selected                        |
| `readonly`        | `boolean`                                         | `false`                   | -        | Set to readonly mode                                             |
| `rules`           | `Rule[]`                                          | `[]`                      | -        | Custom validation rules                                          |
| `state`           | `UIState`                                         | `'idle'`                  | -        | Input state (idle, success, info, error, warning)                |
| `changed`         | `boolean`                                         | `false`                   | -        | Whether the value has changed (v-model:changed)                  |
| `valid`           | `boolean`                                         | `false`                   | -        | Whether validation passed (v-model:valid)                        |
| `width`           | `string \| number \| Breakpoints`                 | -                         | -        | Component width                                                  |
| `grid`            | `string \| number \| Breakpoints`                 | -                         | -        | Grid layout size                                                 |
| `options`         | `any[]`                                           | `[]`                      | -        | Array of selectable options                                      |
| `optionLabel`     | `string`                                          | `''`                      | -        | Property to use as the label from an option object               |
| `optionValue`     | `string`                                          | `''`                      | -        | Property to use as the value from an option object               |
| `groupBy`         | `(option, index) => string \| null`               | `null`                    | -        | Function to group options                                        |
| `groupOrder`      | `string[]`                                        | `[]`                      | -        | Specify the display order of groups                              |
| `min`             | `number \| string`                                | `0`                       | -        | Minimum number of selections in multiple mode                    |
| `max`             | `number \| string`                                | `Number.MAX_SAFE_INTEGER` | -        | Maximum number of selections in multiple mode                    |
| `closableChips`   | `boolean`                                         | `false`                   | -        | Show close button on chips in multiple mode                      |
| `collapseChips`   | `boolean`                                         | `false`                   | -        | Collapse chips in multiple mode                                  |
| `multiple`        | `boolean`                                         | `false`                   | -        | Enable multiple selection mode                                   |
| `noClear`         | `boolean`                                         | `false`                   | -        | Hide the clear button                                            |
| `optionsDisabled` | `boolean \| (option, index, options) => boolean`  | `false`                   | -        | Disable specific options via function or boolean                 |
| `search`          | `SearchProps`                                     | `false`                   | -        | Enable search and configure search options                       |
| `selectAll`       | `boolean`                                         | `false`                   | -        | Show select-all checkbox (only works in multiple mode)           |
| `modelValue`      | `any \| any[]`                                    | `null`                    | -        | v-model binding value                                            |

## Types

```typescript
interface VsSelectStyleSet {
    variables?: {
        height?: string;
        focused?: {
            border?: string;
            borderRadius?: string;
            backgroundColor?: string;
        };
    };
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
    chip?: VsChipStyleSet;
    selectAllCheckbox?: VsCheckboxStyleSet;
    options?: VsGroupedListStyleSet;
    option?: CSSProperties;
    selectedOption?: CSSProperties;
}
```

> [!NOTE]
>
> - `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).
> - `chip` uses [VsChipStyleSet](../vs-chip/README.md#types).
> - `selectAllCheckbox` uses [VsCheckboxStyleSet](../vs-checkbox/README.md#types).
> - `options` uses [VsGroupedListStyleSet](../vs-grouped-list/README.md#types).

### StyleSet Example

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        :style-set="{
            variables: {
                height: '3rem',
                focused: {
                    border: '2px solid #2196f3',
                    borderRadius: '8px',
                    backgroundColor: '#f5f5f5',
                },
            },
            component: {
                fontSize: '1rem',
            },
            selectedOption: {
                backgroundColor: '#e3f2fd',
                fontWeight: 700,
            },
        }"
    />
</template>
```

## Events

| Event               | Payload        | Description                              |
| ------------------- | -------------- | ---------------------------------------- |
| `update:modelValue` | `any \| any[]` | Emitted when the v-model value changes   |
| `update:changed`    | `boolean`      | Emitted when the changed state updates   |
| `update:valid`      | `boolean`      | Emitted when the validation state updates |
| `change`            | `any \| any[]` | Emitted when the selected value changes  |
| `click-option`      | `OptionItem`   | Emitted when an option is clicked        |
| `open`              | -              | Emitted when the options list opens      |
| `close`             | -              | Emitted when the options list closes     |
| `clear`             | -              | Emitted when the clear button is clicked |
| `focus`             | `FocusEvent`   | Emitted when the trigger receives focus  |
| `blur`              | `FocusEvent`   | Emitted when the trigger loses focus     |

## Slots

| Slot             | Props                                      | Description                                  |
| ---------------- | ------------------------------------------ | -------------------------------------------- |
| `default`        | -                                          | Content displayed in the outer wrapper       |
| `label`          | -                                          | Label area of the input wrapper              |
| `option`         | `{ id, label, value, disabled, selected }` | Custom template for each option              |
| `group`          | `{ groupName }`                            | Custom template for group headers            |
| `options-header` | -                                          | Header displayed above the options list      |
| `options-footer` | -                                          | Footer displayed below the options list      |
| `messages`       | -                                          | Bottom message area                          |

## Methods

| Method     | Return Type     | Description                                    |
| ---------- | --------------- | ---------------------------------------------- |
| `validate` | `boolean`       | Validate the current value and return the result |
| `clear`    | `void`          | Clear all selected values                      |
| `focus`    | `void`          | Set focus on the trigger                       |
| `blur`     | `void`          | Remove focus from the trigger                  |
