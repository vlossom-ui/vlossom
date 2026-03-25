> 한국어: [README.ko.md](./README.ko.md)

# VsTextarea

A multi-line text input component. Supports string modifiers for automatic value transformation and provides built-in validation.

**Available Version**: 2.0.0+

## Basic Usage

### Default Textarea

```html
<template>
    <vs-textarea v-model="description" placeholder="Enter content" />
</template>
```

### With Label

```html
<template>
    <vs-textarea v-model="content" label="Description" placeholder="Enter content" />
</template>
```

### Required Field

```html
<template>
    <vs-textarea v-model="content" label="Required Field" placeholder="This field is required" required />
</template>
```

### String Modifiers

```html
<template>
    <!-- Capitalize first letter -->
    <vs-textarea v-model.capitalize="text" label="Title" />

    <!-- All uppercase -->
    <vs-textarea v-model.upper="code" label="Code" />

    <!-- All lowercase -->
    <vs-textarea v-model.lower="email" label="Email" />
</template>
```

### Character Limit (min/max)

```html
<template>
    <vs-textarea
        v-model="description"
        label="Product Description"
        placeholder="Minimum 10, maximum 500 characters"
        :min="10"
        :max="500"
    />
</template>
```

### Disabled and Readonly

```html
<template>
    <vs-textarea v-model="value1" label="Disabled" disabled />
    <vs-textarea v-model="value2" label="Readonly" readonly />
</template>
```

### Custom Validation Rules

```html
<template>
    <vs-textarea v-model="comment" label="Comment" :rules="[noBadWords]" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const comment = ref('');

function noBadWords(value: string) {
    const badWords = ['badword1', 'badword2'];
    if (badWords.some((word) => value.includes(word))) {
        return 'Prohibited words are included';
    }
    return '';
}
</script>
```

### Using Methods

```html
<template>
    <vs-textarea ref="textareaRef" v-model="value" label="Content" />
    <button @click="focusTextarea">Focus</button>
    <button @click="selectTextarea">Select</button>
    <button @click="clearTextarea">Clear</button>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { VsTextareaRef } from '@/components';

const textareaRef = useTemplateRef('textareaRef');
const value = ref('');

function focusTextarea() {
    textareaRef.value?.focus();
}

function selectTextarea() {
    textareaRef.value?.select();
}

function clearTextarea() {
    textareaRef.value?.clear();
}
</script>
```

## Props

| Prop             | Type                              | Default                   | Required | Description                                       |
| ---------------- | --------------------------------- | ------------------------- | -------- | ------------------------------------------------- |
| `colorScheme`    | `ColorScheme`                     | -                         | -        | Color scheme for the component                    |
| `styleSet`       | `string \| VsTextareaStyleSet`    | -                         | -        | Custom style configuration object                 |
| `autocomplete`   | `boolean`                         | `false`                   | -        | Enable autocomplete                               |
| `changed`        | `boolean`                         | `false`                   | -        | Whether the value has changed (v-model:changed)   |
| `disabled`       | `boolean`                         | `false`                   | -        | Disable the textarea                              |
| `grid`           | `string \| number \| Breakpoints` | -                         | -        | Grid layout size                                  |
| `hidden`         | `boolean`                         | `false`                   | -        | Hide the component                                |
| `id`             | `string`                          | -                         | -        | The `id` attribute of the textarea element        |
| `label`          | `string`                          | -                         | -        | Input field label                                 |
| `max`            | `number \| string`                | `Number.MAX_SAFE_INTEGER` | -        | Maximum character count                           |
| `messages`       | `Message<string>[]`               | `[]`                      | -        | Validation messages to display                    |
| `min`            | `number \| string`                | `Number.MIN_SAFE_INTEGER` | -        | Minimum character count                           |
| `modelValue`     | `string`                          | `''`                      | -        | v-model binding value                             |
| `modelModifiers` | `StringModifiers`                 | `{}`                      | -        | String modifiers (capitalize, upper, lower)       |
| `name`           | `string`                          | -                         | -        | The `name` attribute of the textarea element      |
| `noDefaultRules` | `boolean`                         | `false`                   | -        | Disable built-in validation rules                 |
| `noLabel`        | `boolean`                         | `false`                   | -        | Hide the label area                               |
| `noMessages`     | `boolean`                         | `false`                   | -        | Hide the messages area                            |
| `placeholder`    | `string`                          | -                         | -        | Placeholder text                                  |
| `readonly`       | `boolean`                         | `false`                   | -        | Set to readonly mode                              |
| `required`       | `boolean`                         | `false`                   | -        | Mark as required                                  |
| `rules`          | `Rule<string>[]`                  | `[]`                      | -        | Custom validation rules                           |
| `state`          | `UIState`                         | `'idle'`                  | -        | Input state (idle, success, info, error, warning) |
| `valid`          | `boolean`                         | `false`                   | -        | Whether validation passed (v-model:valid)         |
| `width`          | `string \| number \| Breakpoints` | -                         | -        | Component width                                   |

## Types

```typescript
interface VsTextareaStyleSet {
    textarea?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> `wrapper` uses [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types).

### StyleSet Example

```html
<template>
    <vs-textarea
        v-model="description"
        :style-set="{
            textarea: {
                minHeight: '10rem',
                padding: '1rem',
                border: '2px solid #333',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
            },
        }"
    />
</template>
```

## Events

| Event               | Payload             | Description                               |
| ------------------- | ------------------- | ----------------------------------------- |
| `update:modelValue` | `value: string`     | Emitted when the v-model value changes    |
| `update:changed`    | `changed: boolean`  | Emitted when the changed state updates    |
| `update:valid`      | `valid: boolean`    | Emitted when the validation state updates |
| `change`            | `value: string`     | Emitted when the input value changes      |
| `focus`             | `event: FocusEvent` | Emitted when the textarea receives focus  |
| `blur`              | `event: FocusEvent` | Emitted when the textarea loses focus     |

## Slots

| Slot       | Description            |
| ---------- | ---------------------- |
| `label`    | Custom label content   |
| `messages` | Custom message content |

## Methods

| Method     | Parameters | Return Type | Description                          |
| ---------- | ---------- | ----------- | ------------------------------------ |
| `focus`    | -          | `void`      | Set focus on the textarea            |
| `blur`     | -          | `void`      | Remove focus from the textarea       |
| `select`   | -          | `void`      | Select all text in the textarea      |
| `clear`    | -          | `void`      | Clear the textarea value             |
| `validate` | -          | `boolean`   | Run validation and return the result |

## Features

- **Multi-line text input**: Provides a textarea element suitable for long text or descriptions
- **String modifiers**: Automatically transform input values via v-model's `capitalize`, `upper`, `lower` modifiers
- **Character limit**: Limit minimum/maximum character count via `min`/`max` props
- **Validation rules**: Custom validation rules and built-in validation (required, min, max)
- **Text selection**: Select all text via the `select()` method
- **Accessibility**: Screen reader support via `aria-required`
