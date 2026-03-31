> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsSelect

A dropdown select component supporting single and multiple selection with search, grouping, and validation.

**Available Version**: 2.0.0+

## Feature

- Single and multiple selection modes
- Built-in search with case-sensitive and regex options
- Option grouping via `groupBy` function
- Select-all checkbox for multiple mode
- Closable chip display for selected values in multiple mode
- Built-in validation support (required, min, max)
- Keyboard navigation within the dropdown list
- Customizable option, selected option, and chip styles

## Basic Usage

```html
<template>
    <vs-select v-model="selected" :options="options" label="Choose a fruit" />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
const options = ['Apple', 'Banana', 'Cherry'];
</script>
```

### Multiple Selection

```html
<template>
    <vs-select v-model="selected" :options="options" multiple label="Choose fruits" />
</template>
```

### With Search

```html
<template>
    <vs-select v-model="selected" :options="options" :search="true" label="Search and select" />
</template>
```

### Object Options with Custom Labels

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        option-label="name"
        option-value="id"
        label="Choose a person"
    />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
const options = [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' },
];
</script>
```

## Props

| Prop              | Type                                                             | Default               | Required | Description                                             |
| ----------------- | ---------------------------------------------------------------- | --------------------- | -------- | ------------------------------------------------------- |
| `colorScheme`     | `string`                                                         | -                     | -        | Color scheme for the component                          |
| `styleSet`        | `string \| VsSelectStyleSet`                                     | -                     | -        | Custom style set for the component                      |
| `disabled`        | `boolean`                                                        | `false`               | -        | Disables the select                                     |
| `hidden`          | `boolean`                                                        | `false`               | -        | Hides the component                                     |
| `id`              | `string`                                                         | `''`                  | -        | HTML id attribute                                       |
| `label`           | `string`                                                         | `''`                  | -        | Label text for the select                               |
| `noLabel`         | `boolean`                                                        | `false`               | -        | Hides the label                                         |
| `noMessages`      | `boolean`                                                        | `false`               | -        | Hides validation messages                               |
| `required`        | `boolean`                                                        | `false`               | -        | Marks the field as required                             |
| `messages`        | `Message[]`                                                      | `[]`                  | -        | Validation messages                                     |
| `name`            | `string`                                                         | `''`                  | -        | HTML name attribute                                     |
| `noDefaultRules`  | `boolean`                                                        | `false`               | -        | Disables built-in validation rules                      |
| `readonly`        | `boolean`                                                        | `false`               | -        | Makes the select read-only                              |
| `rules`           | `Rule[]`                                                         | `[]`                  | -        | Custom validation rules                                 |
| `state`           | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'`        | `'idle'`              | -        | Validation state                                        |
| `width`           | `string \| number \| Breakpoints`                                | -                     | -        | Responsive width                                        |
| `grid`            | `string \| number \| Breakpoints`                                | -                     | -        | Grid column span                                        |
| `options`         | `any[]`                                                          | `[]`                  | -        | Array of option values or objects                       |
| `optionLabel`     | `string`                                                         | `''`                  | -        | Key name for the label when options are objects         |
| `optionValue`     | `string`                                                         | `''`                  | -        | Key name for the value when options are objects         |
| `groupBy`         | `(option: any, index: number) => string \| null`                 | `null`                | -        | Function to group options by a string key               |
| `groupOrder`      | `string[]`                                                       | `[]`                  | -        | Order of groups                                         |
| `min`             | `number \| string`                                               | `0`                   | -        | Minimum number of selections (multiple mode)            |
| `max`             | `number \| string`                                               | `Number.MAX_SAFE_INTEGER` | -    | Maximum number of selections (multiple mode)            |
| `search`          | `boolean \| SearchProps`                                         | `false`               | -        | Enables built-in search                                 |
| `closableChips`   | `boolean`                                                        | `false`               | -        | Shows a close button on selected chips                  |
| `collapseChips`   | `boolean`                                                        | `false`               | -        | Collapses selected chips into a count display           |
| `multiple`        | `boolean`                                                        | `false`               | -        | Enables multiple selection mode                         |
| `noClear`         | `boolean`                                                        | `false`               | -        | Hides the clear button                                  |
| `optionsDisabled` | `boolean \| ((option: any, index: number, options: any[]) => boolean)` | `false`       | -        | Disables individual options                             |
| `selectAll`       | `boolean`                                                        | `false`               | -        | Shows a select-all checkbox (multiple mode)             |
| `modelValue`      | `any`                                                            | `null`                | -        | Selected value (v-model)                                |

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
> `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types), `chip` uses [VsChipStyleSet](../vs-chip/README.md#types), `selectAllCheckbox` uses [VsCheckboxStyleSet](../vs-checkbox/README.md#types), and `options` uses [VsGroupedListStyleSet](../vs-grouped-list/README.md#types).

### StyleSet Example

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        :style-set="{
            variables: {
                height: '2.5rem',
                focused: { border: '2px solid #6366f1' },
            },
            option: { padding: '0.5rem 1rem' },
            selectedOption: { backgroundColor: '#ede9fe', fontWeight: 'bold' },
        }"
    />
</template>
```

## Events

| Event               | Payload       | Description                                      |
| ------------------- | ------------- | ------------------------------------------------ |
| `update:modelValue` | `any`         | Emitted when the selected value changes          |
| `update:changed`    | `boolean`     | Emitted when the changed state updates           |
| `update:valid`      | `boolean`     | Emitted when the validation state updates        |
| `change`            | `any`         | Emitted when the selected value changes          |
| `focus`             | `FocusEvent`  | Emitted when the trigger receives focus          |
| `blur`              | `FocusEvent`  | Emitted when the trigger loses focus             |
| `click-option`      | `OptionItem`  | Emitted when an option is clicked                |
| `open`              | -             | Emitted when the dropdown opens                  |
| `close`             | -             | Emitted when the dropdown closes                 |
| `clear`             | -             | Emitted when the selected value is cleared       |

## Slots

| Slot               | Description                                                          |
| ------------------ | -------------------------------------------------------------------- |
| `label`            | Custom label content                                                 |
| `options-header`   | Custom content above the options list                                |
| `options-footer`   | Custom content below the options list                                |
| `group`            | Custom group header; receives group slot props                       |
| `option`           | Custom option content; receives `{ ...itemSlotProps, selected: boolean }` |
| `messages`         | Custom validation messages                                           |

## Methods

| Method     | Parameters | Description                   |
| ---------- | ---------- | ----------------------------- |
| `focus`    | -          | Focuses the select trigger    |
| `blur`     | -          | Blurs the select trigger      |
| `validate` | -          | Triggers validation           |
| `clear`    | -          | Clears the selected value     |
