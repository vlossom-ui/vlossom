> 한국어: [README.ko.md](./README.ko.md)

# VsRadio & VsRadioSet

Radio input components. Provides a single radio button (`VsRadio`) and a radio group for selecting one option from multiple (`VsRadioSet`).

**Available Version**: 2.0.0+

## Basic Usage

### VsRadio — Single Radio

```html
<template>
    <vs-radio v-model="payment" radio-label="Credit Card" :radio-value="'card'" name="payment" />
    <vs-radio v-model="payment" radio-label="Bank Transfer" :radio-value="'bank'" name="payment" />
</template>
```

> Using the same `v-model` and `name` lets the browser treat them as a single radio group.

### VsRadioSet — Radio Group

```html
<template>
    <vs-radio-set
        v-model="selectedOption"
        :options="[
            { label: 'Option 1', value: 'opt1' },
            { label: 'Option 2', value: 'opt2' },
        ]"
        option-label="label"
        option-value="value"
        name="example"
    />
</template>

<script setup>
import { ref } from 'vue';
const selectedOption = ref('opt1');
</script>
```

### Custom Label & Vertical Layout

```html
<template>
    <vs-radio-set
        v-model="plan"
        :options="plans"
        option-label="title"
        option-value="id"
        vertical
    >
        <template #radio-label="{ option }">
            <div class="flex flex-col">
                <span class="font-medium">{{ option.title }}</span>
                <span class="text-sm text-gray-500">{{ option.price }}</span>
            </div>
        </template>
    </vs-radio-set>
</template>

<script setup>
import { ref } from 'vue';
const plans = [
    { id: 'basic', title: 'Basic', price: '$10/mo' },
    { id: 'pro', title: 'Pro', price: '$25/mo' },
];
const plan = ref('basic');
</script>
```

### Before Change Confirmation

```html
<template>
    <vs-radio-set
        v-model="delivery"
        :options="['standard', 'express']"
        :before-change="confirmBeforeChange"
        name="delivery"
    />
</template>

<script setup>
import { ref } from 'vue';
const delivery = ref('standard');

const confirmBeforeChange = async (from, to, optionValue) => {
    return window.confirm(`Switch to ${optionValue}?`);
};
</script>
```

## Props

### VsRadio Props

| Prop          | Type                        | Default | Required | Description                               |
| ------------- | --------------------------- | ------- | -------- | ----------------------------------------- |
| `radioValue`  | `any`                       | -       | ✅       | Value set on v-model when selected        |
| `radioLabel`  | `string`                    | `''`    | -        | Label displayed to the right of the radio |
| `checked`     | `boolean`                   | `false` | -        | Initial checked state                     |
| `styleSet`    | `string \| VsRadioStyleSet` | -       | -        | Style key or inline style set             |
| `colorScheme` | `string`                    | -       | -        | Color scheme for the component            |

Also supports common Input Props: `id`, `label`, `messages`, `rules`, `required`, `disabled`, `readonly`, `width`, `grid`, `noMessages`, etc.

### VsRadioSet Props

| Prop           | Type                           | Default | Required | Description                                                                          |
| -------------- | ------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------ |
| `options`      | `any[]`                        | `[]`    | ✅       | List of options to render                                                            |
| `optionLabel`  | `string`                       | `''`    | -        | Property path to read the label from an option object                                |
| `optionValue`  | `string`                       | `''`    | -        | Property path to read the value from an option object                                |
| `vertical`     | `boolean`                      | `false` | -        | Arrange radios vertically                                                            |
| `styleSet`     | `string \| VsRadioSetStyleSet` | -       | -        | Group and item style customization                                                   |
| `beforeChange` | `Function`                     | -       | -        | Async function called before change (from, to, optionValue; cancel if returns false) |

## Types

```typescript
interface VsRadioStyleSet {
    variables?: {
        borderRadius?: string;
        radioColor?: string;
        radioSize?: string;
    };
    wrapper?: VsInputWrapperStyleSet;
}

interface VsRadioSetStyleSet {
    component?: CSSProperties;
    radio?: VsRadioStyleSet;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> - `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).
> - `radio` in VsRadioSetStyleSet uses [VsRadioStyleSet](#types).

## Events

### VsRadio Events

| Event               | Payload      | Description                               |
| ------------------- | ------------ | ----------------------------------------- |
| `update:modelValue` | `any`        | Emitted when the v-model value changes    |
| `update:changed`    | `boolean`    | Emitted when the changed state updates    |
| `update:valid`      | `boolean`    | Emitted when the validation state changes |
| `change`            | `Event`      | Native radio change event                 |
| `toggle`            | `boolean`    | Emitted after toggle with checked state   |
| `focus`             | `FocusEvent` | Emitted when the radio receives focus     |
| `blur`              | `FocusEvent` | Emitted when the radio loses focus        |

### VsRadioSet Events

| Event               | Payload | Description                                     |
| ------------------- | ------- | ----------------------------------------------- |
| `update:modelValue` | `any`   | Emitted when the selected value changes         |
| `change`            | `any`   | Emitted when an inner radio fires change        |
| `focus`             | `any`   | Emitted on item focus (option and event passed) |
| `blur`              | `any`   | Emitted on item blur (option and event passed)  |

## Slots

### VsRadio Slots

| Slot          | Description                             |
| ------------- | --------------------------------------- |
| `label`       | Top label area of the input wrapper     |
| `radio-label` | Radio item label (replaceable via slot) |
| `messages`    | Bottom message area                     |

### VsRadioSet Slots

| Slot          | Description                              |
| ------------- | ---------------------------------------- |
| `label`       | Group top label area                     |
| `radio-label` | Label area for each item (custom markup) |
| `messages`    | Group bottom message area                |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
