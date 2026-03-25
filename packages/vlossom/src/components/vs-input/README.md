> 한국어: [README.ko.md](./README.ko.md)

# VsInput

A flexible input component supporting multiple types and validation. Provides text, email, password, number, and more input types, with string modifiers for automatic value transformation.

**Available Version**: 2.0.0+

## Basic Usage

### Default Input

```html
<template>
    <vs-input v-model="value" placeholder="Enter text" />
</template>
```

### With Label

```html
<template>
    <vs-input v-model="name" label="Name" placeholder="Enter your name" />
</template>
```

### Various Types

```html
<template>
    <vs-input v-model="email" type="email" label="Email" placeholder="email@example.com" />
    <vs-input v-model="password" type="password" label="Password" placeholder="Enter password" />
    <vs-input v-model="age" type="number" label="Age" placeholder="Enter age" />
    <vs-input v-model="phone" type="tel" label="Phone" placeholder="010-0000-0000" />
</template>
```

### Required Field

```html
<template>
    <vs-input v-model="email" type="email" label="Email" placeholder="email@example.com" required />
</template>
```

### String Modifiers

```html
<template>
    <!-- Capitalize first letter -->
    <vs-input v-model.capitalize="name" label="Name" />

    <!-- All uppercase -->
    <vs-input v-model.upper="code" label="Code" />

    <!-- All lowercase -->
    <vs-input v-model.lower="username" label="Username" />
</template>
```

### Prepend / Append Slots

```html
<template>
    <!-- Add icon before input -->
    <vs-input v-model="search" placeholder="Search">
        <template #prepend> 🔍 </template>
    </vs-input>

    <!-- Add unit after input -->
    <vs-input v-model="price" type="number" placeholder="Enter price">
        <template #append>
            <span style="padding: 0 0.5rem">USD</span>
        </template>
    </vs-input>
</template>
```

### Number Input with min/max

```html
<template>
    <vs-input v-model="age" type="number" label="Age" placeholder="Enter age" :min="0" :max="120" />
</template>
```

### Disabled and Readonly

```html
<template>
    <vs-input v-model="value1" label="Disabled" disabled />
    <vs-input v-model="value2" label="Readonly" readonly />
</template>
```

### Without Clear Button

```html
<template>
    <vs-input v-model="value" label="No Clear Button" no-clear />
</template>
```

### Using Methods

```html
<template>
    <vs-input ref="inputRef" v-model="value" label="Name" />
    <button @click="focusInput">Focus</button>
    <button @click="selectInput">Select</button>
    <button @click="clearInput">Clear</button>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { VsInputRef } from '@/components';

const inputRef = useTemplateRef('inputRef');
const value = ref('');

function focusInput() {
    inputRef.value?.focus();
}

function selectInput() {
    inputRef.value?.select();
}

function clearInput() {
    inputRef.value?.clear();
}
</script>
```

## Props

| Prop             | Type                                                                        | Default                   | Required | Description                                       |
| ---------------- | --------------------------------------------------------------------------- | ------------------------- | -------- | ------------------------------------------------- |
| `colorScheme`    | `ColorScheme`                                                               | -                         | -        | Color scheme for the component                    |
| `styleSet`       | `string \| VsInputStyleSet`                                                 | -                         | -        | Custom style configuration object                 |
| `autocomplete`   | `boolean`                                                                   | `false`                   | -        | Enable autocomplete                               |
| `changed`        | `boolean`                                                                   | `false`                   | -        | Whether the value has changed (v-model:changed)   |
| `disabled`       | `boolean`                                                                   | `false`                   | -        | Disable the input                                 |
| `grid`           | `string \| number \| Breakpoints`                                           | -                         | -        | Grid layout size                                  |
| `hidden`         | `boolean`                                                                   | `false`                   | -        | Hide the component                                |
| `id`             | `string`                                                                    | -                         | -        | The `id` attribute of the input element           |
| `label`          | `string`                                                                    | -                         | -        | Input field label                                 |
| `max`            | `number \| string`                                                          | `Number.MAX_SAFE_INTEGER` | -        | Maximum value for number type                     |
| `messages`       | `Message<InputValueType>[]`                                                 | `[]`                      | -        | Validation messages to display                    |
| `min`            | `number \| string`                                                          | `Number.MIN_SAFE_INTEGER` | -        | Minimum value for number type                     |
| `modelValue`     | `string \| number \| null`                                                  | `null`                    | -        | v-model binding value                             |
| `modelModifiers` | `StringModifiers`                                                           | `{}`                      | -        | String modifiers (capitalize, upper, lower)       |
| `name`           | `string`                                                                    | -                         | -        | The `name` attribute of the input element         |
| `noClear`        | `boolean`                                                                   | `false`                   | -        | Hide the clear button                             |
| `noDefaultRules` | `boolean`                                                                   | `false`                   | -        | Disable built-in validation rules                 |
| `noLabel`        | `boolean`                                                                   | `false`                   | -        | Hide the label area                               |
| `noMessages`     | `boolean`                                                                   | `false`                   | -        | Hide the messages area                            |
| `placeholder`    | `string`                                                                    | -                         | -        | Placeholder text                                  |
| `readonly`       | `boolean`                                                                   | `false`                   | -        | Set to readonly mode                              |
| `required`       | `boolean`                                                                   | `false`                   | -        | Mark as required                                  |
| `rules`          | `Rule<InputValueType>[]`                                                    | `[]`                      | -        | Custom validation rules                           |
| `state`          | `UIState`                                                                   | `'idle'`                  | -        | Input state (idle, success, info, error, warning) |
| `type`           | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'`                  | -        | Input type                                        |
| `valid`          | `boolean`                                                                   | `false`                   | -        | Whether validation passed (v-model:valid)         |
| `width`          | `string \| number \| Breakpoints`                                           | -                         | -        | Component width                                   |

## Events

| Event               | Parameters              | Description                               |
| ------------------- | ----------------------- | ----------------------------------------- |
| `update:modelValue` | `value: InputValueType` | Emitted when the v-model value changes    |
| `update:changed`    | `changed: boolean`      | Emitted when the changed state updates    |
| `update:valid`      | `valid: boolean`        | Emitted when the validation state updates |
| `change`            | `value: InputValueType` | Emitted when the input value changes      |

## Exposed Methods

| Method   | Parameters | Return Type | Description                        |
| -------- | ---------- | ----------- | ---------------------------------- |
| `focus`  | -          | `void`      | Set focus on the input field       |
| `select` | -          | `void`      | Select all text in the input field |
| `clear`  | -          | `void`      | Clear the input field value        |

## Types

```typescript
interface VsInputStyleSet {
    prepend?: CSSProperties;
    append?: CSSProperties;
    input?: CSSProperties;
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).

## Slots

| Slot       | Description                               |
| ---------- | ----------------------------------------- |
| `label`    | Custom label content                      |
| `prepend`  | Content to display before the input field |
| `append`   | Content to display after the input field  |
| `messages` | Custom message content                    |

## Features

- **Multiple input type support**: Provides text, email, password, number, tel, url, search, and more
- **String modifiers**: Automatically transform input values via v-model's `capitalize`, `upper`, `lower` modifiers
- **Number input validation**: Limit range with `min`/`max` props when `type="number"`
- **Clear button**: Provides a clear button for quickly clearing the input value (can be disabled)
- **Prepend/Append slots**: Add icons or text before and after the input field
- **Validation rules**: Custom validation rules and built-in validation (required, min, max)
- **Type safety**: Automatically converts number type to number and text type to string
