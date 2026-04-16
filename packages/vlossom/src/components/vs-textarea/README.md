> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsTextarea

A multi-line text input component with validation, string modifiers, and min/max length constraints.

**Available Version**: 2.0.0+

## Feature

- Multi-line text input with full validation support
- String modifiers (trim, lowercase, uppercase, etc.) applied via `v-model.trim` style modifiers
- Min/max length validation with default rules
- Integrated with `VsInputWrapper` for label, message, and state display
- Autocomplete and read-only modes

## Basic Usage

```html
<template>
    <vs-textarea v-model="text" label="Description" placeholder="Enter description..." />
</template>

<script setup>
import { ref } from 'vue';
const text = ref('');
</script>
```

### With Validation

```html
<template>
    <vs-textarea
        v-model="text"
        label="Bio"
        required
        :min="10"
        :max="200"
        :messages="[{ state: 'info', text: 'Enter 10–200 characters' }]"
    />
</template>
```

### Read-only Mode

```html
<template>
    <vs-textarea v-model="text" label="Notes" readonly />
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsTextareaStyleSet` | | | Custom style set for the component |
| `autocomplete` | `boolean` | `false` | | Enables browser autocomplete |
| `changed` | `boolean` | `false` | | v-model for changed state |
| `disabled` | `boolean` | `false` | | Disables the textarea |
| `grid` | `string \| number \| Breakpoints` | | | Grid column span |
| `hidden` | `boolean` | `false` | | Hides the component |
| `id` | `string` | `''` | | HTML `id` attribute |
| `label` | `string` | `''` | | Label text |
| `max` | `number \| string` | | | Maximum character length |
| `messages` | `Message[]` | `[]` | | Validation messages |
| `min` | `number \| string` | | | Minimum character length |
| `modelValue` | `string` | `''` | | v-model value |
| `modelModifiers` | `StringModifiers` | `{}` | | String modifier flags |
| `name` | `string` | `''` | | HTML `name` attribute |
| `noDefaultRules` | `boolean` | `false` | | Disables built-in min/max/required rules |
| `noLabel` | `boolean` | `false` | | Hides the label area |
| `noMessages` | `boolean` | `false` | | Hides the message area |
| `placeholder` | `string` | `''` | | Placeholder text |
| `readonly` | `boolean` | `false` | | Makes the textarea read-only |
| `required` | `boolean` | `false` | | Marks the field as required |
| `rules` | `Rule[]` | `[]` | | Custom validation rules |
| `state` | `UIState` | `'idle'` | | UI state (`idle`, `success`, `warning`, `error`) |
| `valid` | `boolean` | `false` | | v-model for valid state |
| `width` | `string \| number \| Breakpoints` | | | Component width |

## Types

```typescript
interface VsTextareaStyleSet {
    textarea?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `wrapper` uses [`VsInputWrapperStyleSet`](../vs-input-wrapper/README.md).

### StyleSet Example

```html
<template>
    <vs-textarea
        v-model="text"
        label="Description"
        :style-set="{
            textarea: {
                minHeight: '6rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
            },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `string` | Emitted when the value changes |
| `update:changed` | `boolean` | Emitted when the changed state updates |
| `update:valid` | `boolean` | Emitted when the valid state updates |
| `change` | `string` | Emitted on value change |
| `focus` | `FocusEvent` | Emitted on focus |
| `blur` | `FocusEvent` | Emitted on blur |

## Slots

| Slot | Description |
| ---- | ----------- |
| `label` | Custom label content |
| `messages` | Custom message content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `focus` | | Focuses the textarea |
| `blur` | | Blurs the textarea |
| `validate` | | Triggers validation |
| `clear` | | Clears the value |
| `select` | | Selects all text in the textarea |
