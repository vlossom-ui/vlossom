# VsInput

A feature-rich text input component with validation, clear button, prepend/append slots, and form integration.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Supports multiple input types: `text`, `email`, `number`, `password`, `search`, `tel`, `url`.
- Built-in clear button that appears on hover/focus.
- Form validation with custom rules and built-in `required`, `min`, `max` checks.
- Prepend and append slot areas for icons or additional content.
- Responsive layout via `width` and `grid` props.

## Basic Usage

```html
<template>
    <vs-input v-model="text" label="Name" placeholder="Enter your name" />
</template>

<script setup>
import { ref } from 'vue';
const text = ref('');
</script>
```

### Input Types

```html
<template>
    <vs-input v-model="email" type="email" label="Email" />
    <vs-input v-model="password" type="password" label="Password" />
    <vs-input v-model="count" type="number" label="Count" :min="0" :max="100" />
</template>
```

### With Prepend and Append

```html
<template>
    <vs-input v-model="value" label="Search">
        <template #prepend>
            <span>🔍</span>
        </template>
        <template #append>
            <span>Go</span>
        </template>
    </vs-input>
</template>
```

### Validation

```html
<template>
    <vs-input
        v-model="value"
        label="Required Field"
        :required="true"
        :rules="[v => !!v || 'This field is required']"
    />
</template>
```

### Disabled and Readonly

```html
<template>
    <vs-input v-model="value" label="Disabled" :disabled="true" />
    <vs-input v-model="value" label="Readonly" :readonly="true" />
</template>
```

## Props

| Prop              | Type                                              | Default  | Required | Description                                                      |
| ----------------- | ------------------------------------------------- | -------- | -------- | ---------------------------------------------------------------- |
| `colorScheme`     | `string`                                          | -        | -        | Color scheme for the component.                                  |
| `styleSet`        | `string \| VsInputStyleSet`                       | -        | -        | Custom style set for the component.                              |
| `modelValue`      | `string \| number \| null`                        | `null`   | -        | The bound value (v-model).                                       |
| `type`            | `'email' \| 'number' \| 'password' \| 'search' \| 'tel' \| 'text' \| 'url'` | `'text'` | - | HTML input type.                     |
| `label`           | `string`                                          | `''`     | -        | Label text displayed above the input.                            |
| `placeholder`     | `string`                                          | `''`     | -        | Placeholder text for the input.                                  |
| `disabled`        | `boolean`                                         | `false`  | -        | Disables the input.                                              |
| `readonly`        | `boolean`                                         | `false`  | -        | Makes the input read-only.                                       |
| `required`        | `boolean`                                         | `false`  | -        | Marks the field as required (adds validation).                   |
| `noClear`         | `boolean`                                         | `false`  | -        | Hides the clear button.                                          |
| `autocomplete`    | `boolean`                                         | `false`  | -        | Enables browser autocomplete.                                    |
| `noLabel`         | `boolean`                                         | `false`  | -        | Hides the label area.                                            |
| `noMessages`      | `boolean`                                         | `false`  | -        | Hides the messages area.                                         |
| `hidden`          | `boolean`                                         | `false`  | -        | Hides the entire component.                                      |
| `id`              | `string`                                          | `''`     | -        | The `id` attribute for the input element.                        |
| `name`            | `string`                                          | `''`     | -        | The `name` attribute for the input element.                      |
| `messages`        | `Message[]`                                       | `[]`     | -        | External messages (state + text) to display below the input.     |
| `rules`           | `Rule[]`                                          | `[]`     | -        | Validation rules applied on change.                              |
| `noDefaultRules`  | `boolean`                                         | `false`  | -        | Disables the built-in required/min/max rules.                    |
| `state`           | `UIState`                                         | `'idle'` | -        | External validation state (`idle`, `info`, `success`, `warning`, `error`). |
| `min`             | `string \| number`                                | -        | -        | Minimum value (number type) or minimum length (text type).       |
| `max`             | `string \| number`                                | -        | -        | Maximum value (number type) or maximum length (text type).       |
| `width`           | `string \| number \| Breakpoints`                 | -        | -        | Width of the component.                                          |
| `grid`            | `string \| number \| Breakpoints`                 | -        | -        | Grid column span for layout.                                     |
| `changed`         | `boolean`                                         | `false`  | -        | v-model binding that reflects whether the value has changed.     |
| `valid`           | `boolean`                                         | `false`  | -        | v-model binding that reflects the current validation state.      |

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
> `wrapper` uses `VsInputWrapperStyleSet`. See the [VsInputWrapper README](../vs-input-wrapper/README.md) for details.

### StyleSet Example

```html
<template>
    <vs-input
        v-model="value"
        label="Styled Input"
        :style-set="{
            component: { borderRadius: '20px', height: '3rem' },
            input: { fontSize: '1rem' },
            prepend: { backgroundColor: '#eee', padding: '0 0.5rem' },
            append: { backgroundColor: '#eee', padding: '0 0.5rem' },
            wrapper: { label: { color: 'blue' } },
        }"
    />
</template>
```

## Events

| Event               | Payload                    | Description                                         |
| ------------------- | -------------------------- | --------------------------------------------------- |
| `update:modelValue` | `string \| number \| null` | Emitted when the input value changes.               |
| `update:changed`    | `boolean`                  | Emitted when the changed state updates.             |
| `update:valid`      | `boolean`                  | Emitted when the validation state updates.          |
| `change`            | -                          | Emitted after the value is committed.               |
| `focus`             | `FocusEvent`               | Emitted when the input receives focus.              |
| `blur`              | `FocusEvent`               | Emitted when the input loses focus.                 |

## Slots

| Slot       | Description                                          |
| ---------- | ---------------------------------------------------- |
| `label`    | Custom label content replacing the default label.    |
| `prepend`  | Content displayed to the left inside the input box.  |
| `append`   | Content displayed to the right inside the input box. |
| `messages` | Custom messages content below the input.             |

## Methods

| Method     | Parameters | Description                                         |
| ---------- | ---------- | --------------------------------------------------- |
| `focus`    | -          | Focuses the input element.                          |
| `blur`     | -          | Blurs the input element.                            |
| `validate` | -          | Triggers validation and returns the result.         |
| `clear`    | -          | Clears the input value.                             |
| `select`   | -          | Selects all text in the input element.              |
