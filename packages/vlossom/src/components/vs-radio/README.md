> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsRadio / VsRadioSet

A radio button component (`VsRadio`) and a group component (`VsRadioSet`) for selecting a single option from a list.

**Available Version**: 2.0.0+

## Feature

- `VsRadio`: single radio button with v-model support
- `VsRadioSet`: renders a list of radio buttons from an `options` array
- Supports `beforeChange` async callback to conditionally allow value change
- Built-in validation support (required rules, custom rules)
- Keyboard accessible with focus/blur events
- Vertical layout option for `VsRadioSet`

## Basic Usage

### VsRadio

```html
<template>
    <vs-radio v-model="selected" :radio-value="'apple'" radio-label="Apple" />
    <vs-radio v-model="selected" :radio-value="'banana'" radio-label="Banana" />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
</script>
```

### VsRadioSet

```html
<template>
    <vs-radio-set v-model="selected" :options="options" label="Choose a fruit" />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
const options = ['Apple', 'Banana', 'Cherry'];
</script>
```

### Vertical Layout

```html
<template>
    <vs-radio-set v-model="selected" :options="options" vertical />
</template>
```

### With beforeChange

```html
<template>
    <vs-radio-set
        v-model="selected"
        :options="options"
        :before-change="confirmChange"
    />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
const options = ['Apple', 'Banana', 'Cherry'];

async function confirmChange(from, to) {
    return confirm(`Change from ${from} to ${to}?`);
}
</script>
```

## Props

### VsRadio

| Prop           | Type                                                              | Default  | Required | Description                                       |
| -------------- | ----------------------------------------------------------------- | -------- | -------- | ------------------------------------------------- |
| `colorScheme`  | `string`                                                          | -        | -        | Color scheme for the component                    |
| `styleSet`     | `string \| VsRadioStyleSet`                                       | -        | -        | Custom style set for the component                |
| `disabled`     | `boolean`                                                         | `false`  | -        | Disables the radio input                          |
| `hidden`       | `boolean`                                                         | `false`  | -        | Hides the component                               |
| `id`           | `string`                                                          | `''`     | -        | HTML id attribute                                 |
| `label`        | `string`                                                          | `''`     | -        | Label text for the input wrapper                  |
| `noLabel`      | `boolean`                                                         | `false`  | -        | Hides the label                                   |
| `noMessages`   | `boolean`                                                         | `false`  | -        | Hides validation messages                         |
| `required`     | `boolean`                                                         | `false`  | -        | Marks the field as required                       |
| `messages`     | `Message[]`                                                       | `[]`     | -        | Validation messages                               |
| `name`         | `string`                                                          | `''`     | -        | HTML name attribute for grouping radio buttons    |
| `noDefaultRules` | `boolean`                                                       | `false`  | -        | Disables built-in validation rules                |
| `readonly`     | `boolean`                                                         | `false`  | -        | Makes the radio read-only                         |
| `rules`        | `Rule[]`                                                          | `[]`     | -        | Custom validation rules                           |
| `state`        | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'`         | `'idle'` | -        | Validation state                                  |
| `beforeChange` | `(from: any, to: any, optionValue: any) => Promise<boolean> \| null` | `null` | -     | Async callback called before value changes        |
| `checked`      | `boolean`                                                         | `false`  | -        | Pre-selects this radio on mount                   |
| `radioLabel`   | `string`                                                          | `''`     | -        | Label displayed next to the radio circle          |
| `radioValue`   | `any`                                                             | -        | Yes      | The value this radio represents                   |
| `modelValue`   | `any`                                                             | `null`   | -        | Currently selected value (v-model)                |
| `width`        | `string \| number \| Breakpoints`                                 | -        | -        | Width of the component                            |
| `grid`         | `string \| number \| Breakpoints`                                 | -        | -        | Grid column span                                  |

### VsRadioSet

| Prop           | Type                                                              | Default  | Required | Description                                       |
| -------------- | ----------------------------------------------------------------- | -------- | -------- | ------------------------------------------------- |
| `colorScheme`  | `string`                                                          | -        | -        | Color scheme for the component                    |
| `styleSet`     | `string \| VsRadioSetStyleSet`                                    | -        | -        | Custom style set for the component                |
| `disabled`     | `boolean`                                                         | `false`  | -        | Disables all radio buttons                        |
| `hidden`       | `boolean`                                                         | `false`  | -        | Hides the component                               |
| `id`           | `string`                                                          | `''`     | -        | HTML id attribute                                 |
| `label`        | `string`                                                          | `''`     | -        | Label text for the group                          |
| `noLabel`      | `boolean`                                                         | `false`  | -        | Hides the label                                   |
| `noMessages`   | `boolean`                                                         | `false`  | -        | Hides validation messages                         |
| `required`     | `boolean`                                                         | `false`  | -        | Marks the field as required                       |
| `messages`     | `Message[]`                                                       | `[]`     | -        | Validation messages                               |
| `name`         | `string`                                                          | `''`     | -        | HTML name attribute shared by all radios          |
| `noDefaultRules` | `boolean`                                                       | `false`  | -        | Disables built-in validation rules                |
| `readonly`     | `boolean`                                                         | `false`  | -        | Makes all radios read-only                        |
| `rules`        | `Rule[]`                                                          | `[]`     | -        | Custom validation rules                           |
| `state`        | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'`         | `'idle'` | -        | Validation state                                  |
| `options`      | `any[]`                                                           | `[]`     | -        | Array of option values or objects                 |
| `optionLabel`  | `string`                                                          | -        | -        | Key name for the label when options are objects   |
| `optionValue`  | `string`                                                          | -        | -        | Key name for the value when options are objects   |
| `beforeChange` | `(from: any, to: any, optionValue: any) => Promise<boolean> \| null` | `null` | -     | Async callback called before value changes        |
| `vertical`     | `boolean`                                                         | `false`  | -        | Displays radio buttons in a vertical layout       |
| `modelValue`   | `any`                                                             | `null`   | -        | Currently selected value (v-model)                |
| `width`        | `string \| number \| Breakpoints`                                 | -        | -        | Width of the component                            |
| `grid`         | `string \| number \| Breakpoints`                                 | -        | -        | Grid column span                                  |

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
> `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).

### StyleSet Example

```html
<template>
    <vs-radio-set
        v-model="selected"
        :options="options"
        :style-set="{
            component: { gap: '1rem' },
            radio: {
                variables: {
                    radioColor: '#6366f1',
                    radioSize: '1.2rem',
                },
            },
        }"
    />
</template>
```

## Events

### VsRadio

| Event               | Payload                   | Description                              |
| ------------------- | ------------------------- | ---------------------------------------- |
| `update:modelValue` | `any`                     | Emitted when the selected value changes  |
| `update:changed`    | `boolean`                 | Emitted when the changed state updates   |
| `update:valid`      | `boolean`                 | Emitted when the validation state updates |
| `change`            | `Event`                   | Emitted when the radio selection changes |
| `toggle`            | `boolean`                 | Emitted when the radio is toggled        |
| `focus`             | `FocusEvent`              | Emitted when the radio receives focus    |
| `blur`              | `FocusEvent`              | Emitted when the radio loses focus       |

### VsRadioSet

| Event               | Payload                   | Description                              |
| ------------------- | ------------------------- | ---------------------------------------- |
| `update:modelValue` | `any`                     | Emitted when the selected value changes  |
| `update:changed`    | `boolean`                 | Emitted when the changed state updates   |
| `update:valid`      | `boolean`                 | Emitted when the validation state updates |
| `change`            | `any`                     | Emitted when the selection changes       |
| `focus`             | `(option: any, event: FocusEvent)` | Emitted when a radio receives focus |
| `blur`              | `(option: any, event: FocusEvent)` | Emitted when a radio loses focus   |

## Slots

### VsRadio

| Slot           | Description                                   |
| -------------- | --------------------------------------------- |
| `label`        | Custom label content                          |
| `radio-label`  | Custom label displayed next to the radio      |
| `messages`     | Custom validation messages                    |

### VsRadioSet

| Slot           | Description                                                          |
| -------------- | -------------------------------------------------------------------- |
| `label`        | Custom label content                                                 |
| `radio-label`  | Custom label for each radio; receives `{ option, value, label }`     |
| `messages`     | Custom validation messages                                           |

## Methods

### VsRadio

| Method     | Parameters | Description                  |
| ---------- | ---------- | ---------------------------- |
| `clear`    | -          | Clears the selected value    |
| `validate` | -          | Triggers validation          |
| `focus`    | -          | Focuses the radio input      |
| `blur`     | -          | Blurs the radio input        |

### VsRadioSet

| Method     | Parameters | Description                      |
| ---------- | ---------- | -------------------------------- |
| `focus`    | -          | Focuses the first radio input    |
| `blur`     | -          | Blurs the first radio input      |
| `validate` | -          | Triggers validation              |
| `clear`    | -          | Clears the selected value        |
