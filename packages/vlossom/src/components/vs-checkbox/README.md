> 한국어: [README.ko.md](./README.ko.md)

# VsCheckbox & VsCheckboxSet

Checkbox input components. Provides a single checkbox (`VsCheckbox`) and a checkbox group for selecting multiple options (`VsCheckboxSet`).

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### VsCheckbox — Single Checkbox

```html
<template>
    <vs-checkbox v-model="checked" check-label="I agree" />
</template>
```

### Custom Values

```html
<template>
    <vs-checkbox
        v-model="agreement"
        check-label="Agree"
        true-value="yes"
        false-value="no"
    />
</template>

<script setup>
import { ref } from 'vue';
const agreement = ref('no');
</script>
```

### Indeterminate State

```html
<template>
    <vs-checkbox indeterminate check-label="Partially selected" />
</template>
```

### Array Mode

```html
<template>
    <vs-checkbox v-model="selectedTags" check-label="Tag 1" :true-value="'tag1'" multiple />
    <vs-checkbox v-model="selectedTags" check-label="Tag 2" :true-value="'tag2'" multiple />
</template>

<script setup>
import { ref } from 'vue';
const selectedTags = ref([]);
</script>
```

### Before Change Confirmation

```html
<template>
    <vs-checkbox v-model="checked" check-label="I agree" :before-change="confirmBeforeChange" />
</template>

<script setup>
import { ref } from 'vue';
const checked = ref(false);

const confirmBeforeChange = async (from, to, optionValue) => {
    return confirm('Are you sure you want to agree?');
};
</script>
```

### VsCheckboxSet — Checkbox Group

```html
<template>
    <vs-checkbox-set
        v-model="selectedOptions"
        :options="options"
        option-label="label"
        option-value="value"
    />
</template>

<script setup>
import { ref } from 'vue';
const options = [
    { label: 'Option 1', value: 'opt1' },
    { label: 'Option 2', value: 'opt2' },
];
const selectedOptions = ref([]);
</script>
```

### Vertical Layout

```html
<template>
    <vs-checkbox-set v-model="selected" :options="options" vertical />
</template>
```

### Selection Count Limit

```html
<template>
    <vs-checkbox-set v-model="selected" :options="options" :min="1" :max="3" />
</template>
```

## Props

### VsCheckbox Props

| Prop            | Type                           | Default | Required | Description                                                                            |
| --------------- | ------------------------------ | ------- | -------- | -------------------------------------------------------------------------------------- |
| `colorScheme`   | `string`                       | -       | -        | Color scheme for the component                                                         |
| `styleSet`      | `string \| VsCheckboxStyleSet` | -       | -        | Custom style configuration object                                                      |
| `checked`       | `boolean`                      | `false` | -        | Initial checked state                                                                  |
| `checkLabel`    | `string`                       | -       | -        | Label displayed next to the checkbox                                                   |
| `indeterminate` | `boolean`                      | `false` | -        | Show indeterminate (partially selected) state                                          |
| `multiple`      | `boolean`                      | `false` | -        | Enable array mode (v-model operates as an array)                                       |
| `trueValue`     | `any`                          | `true`  | -        | Value stored in v-model when checked                                                   |
| `falseValue`    | `any`                          | `false` | -        | Value stored in v-model when unchecked                                                 |
| `beforeChange`  | `Function`                     | -       | -        | Async function called before state change (receives from, to, optionValue; cancel if returns false) |

Also supports common Input Props: `id`, `label`, `required`, `disabled`, `readonly`, `messages`, `rules`, etc.

### VsCheckboxSet Props

| Prop           | Type               | Default | Required | Description                                                                             |
| -------------- | ------------------ | ------- | -------- | --------------------------------------------------------------------------------------- |
| `options`      | `any[]`            | -       | ✅       | Array of selectable options                                                             |
| `optionLabel`  | `string`           | -       | -        | Property to use as the label from an option object                                      |
| `optionValue`  | `string`           | -       | -        | Property to use as the value from an option object                                      |
| `vertical`     | `boolean`          | `false` | -        | Apply vertical layout                                                                   |
| `min`          | `number \| string` | `0`     | -        | Minimum number of selections                                                            |
| `max`          | `number \| string` | -       | -        | Maximum number of selections                                                            |
| `beforeChange` | `Function`         | -       | -        | Async function called before state change (receives from, to, optionValue; cancel if returns false) |

## Types

```typescript
interface VsCheckboxStyleSet {
    variables?: {
        checkboxColor?: string;
        checkboxSize?: string;
    };
    checkbox?: CSSProperties;
    checkboxLabel?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}

interface VsCheckboxSetStyleSet {
    component?: CSSProperties;
    checkbox?: Omit<VsCheckboxStyleSet, 'wrapper'>;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> - `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).
> - `checkbox` in VsCheckboxSetStyleSet uses [VsCheckboxStyleSet](#types).

## Events

### VsCheckbox Events

| Event               | Payload                 | Description                                   |
| ------------------- | ----------------------- | --------------------------------------------- |
| `update:modelValue` | `any \| any[]`          | Emitted when the v-model value changes        |
| `change`            | `any`                   | Emitted when the checked state changes        |
| `toggle`            | `(boolean, MouseEvent)` | Emitted on toggle (passes post-toggle state)  |
| `focus`             | `FocusEvent`            | Emitted when the checkbox receives focus      |
| `blur`              | `FocusEvent`            | Emitted when the checkbox loses focus         |

### VsCheckboxSet Events

| Event               | Payload                | Description                                      |
| ------------------- | ---------------------- | ------------------------------------------------ |
| `update:modelValue` | `any[]`                | Emitted when the v-model value changes           |
| `change`            | `any`                  | Emitted when the checked state changes           |
| `focus`             | `(option, FocusEvent)` | Emitted when a checkbox receives focus           |
| `blur`              | `(option, FocusEvent)` | Emitted when a checkbox loses focus              |

## Slots

### VsCheckbox Slots

| Slot          | Description                               |
| ------------- | ----------------------------------------- |
| `default`     | Content displayed in the outer wrapper    |
| `label`       | Label area of the input wrapper           |
| `check-label` | Label displayed next to the checkbox      |
| `messages`    | Bottom message area                       |

### VsCheckboxSet Slots

| Slot          | Description                                       |
| ------------- | ------------------------------------------------- |
| `default`     | Content displayed in the outer wrapper            |
| `label`       | Label area of the input wrapper                   |
| `check-label` | Label for each checkbox (scoped slot)             |
| `messages`    | Bottom message area                               |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
