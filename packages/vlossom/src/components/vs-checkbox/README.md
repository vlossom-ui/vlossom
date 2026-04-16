> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsCheckbox

A checkbox form input component supporting single and multiple selection modes, with an optional label and validation.

**Available Version**: 2.0.0+

## Feature

- Single checkbox or group selection via `VsCheckboxSet`
- `v-model` binding with support for custom `trueValue` / `falseValue`
- Multiple selection mode with array-based `v-model`
- Indeterminate state support
- Built-in validation with custom rules and required checks
- `beforeChange` hook for async confirmation before value changes

## Basic Usage

```html
<template>
    <vs-checkbox v-model="checked" check-label="Accept Terms" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const checked = ref(false);
</script>
```

### Checkbox Group (VsCheckboxSet)

```html
<template>
    <vs-checkbox-set
        v-model="selectedFruits"
        label="Fruits"
        :options="['Apple', 'Banana', 'Cherry']"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const selectedFruits = ref([]);
</script>
```

### With Validation

```html
<template>
    <vs-checkbox v-model="agreed" check-label="I agree" required />
</template>
```

### Before Change Hook

```html
<template>
    <vs-checkbox
        v-model="value"
        check-label="Confirm"
        :before-change="confirmChange"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const value = ref(false);

async function confirmChange(from, to) {
    return window.confirm(`Change from ${from} to ${to}?`);
}
</script>
```

## Props

### VsCheckbox Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | Color scheme for the component |
| `styleSet` | `string \| VsCheckboxStyleSet` | | | Custom style set |
| `width` | `string \| number \| Breakpoints` | | | Width of the component |
| `grid` | `string \| number \| Breakpoints` | | | Grid column span |
| `beforeChange` | `(from, to, optionValue) => Promise<boolean> \| null` | `null` | | Async hook called before value change |
| `checked` | `boolean` | `false` | | Initial checked state |
| `checkLabel` | `string` | `''` | | Label displayed next to the checkbox |
| `disabled` | `boolean` | `false` | | Disables the checkbox |
| `hidden` | `boolean` | `false` | | Hides the component |
| `id` | `string` | `''` | | HTML id attribute |
| `indeterminate` | `boolean` | `false` | | Shows indeterminate state |
| `label` | `string` | `''` | | Field label |
| `messages` | `Message[]` | `[]` | | Validation messages |
| `modelValue` | `any` | `false` | | v-model value |
| `multiple` | `boolean` | `false` | | Enables multiple selection mode |
| `name` | `string` | `''` | | HTML name attribute |
| `noDefaultRules` | `boolean` | `false` | | Disables default validation rules |
| `noLabel` | `boolean` | `false` | | Hides the label |
| `noMessages` | `boolean` | `false` | | Hides validation messages |
| `readonly` | `boolean` | `false` | | Makes the checkbox read-only |
| `required` | `boolean` | `false` | | Marks field as required |
| `rules` | `Rule[]` | `[]` | | Custom validation rules |
| `state` | `UIState` | `'idle'` | | Validation state |
| `trueValue` | `any` | `true` | | Value when checked |
| `falseValue` | `any` | `false` | | Value when unchecked |

### VsCheckboxSet Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | Color scheme for the component |
| `styleSet` | `string \| VsCheckboxSetStyleSet` | | | Custom style set |
| `width` | `string \| number \| Breakpoints` | | | Width of the component |
| `grid` | `string \| number \| Breakpoints` | | | Grid column span |
| `beforeChange` | `(from, to, optionValue) => Promise<boolean> \| null` | `null` | | Async hook called before value change |
| `disabled` | `boolean` | `false` | | Disables all checkboxes in the set |
| `hidden` | `boolean` | `false` | | Hides the component |
| `id` | `string` | `''` | | HTML id attribute |
| `label` | `string` | `''` | | Field label |
| `max` | `number \| null` | `null` | | Maximum number of selectable items |
| `messages` | `Message[]` | `[]` | | Validation messages |
| `min` | `number \| null` | `null` | | Minimum number of selectable items |
| `modelValue` | `any[]` | `[]` | | v-model binding (array of selected values) |
| `name` | `string` | `''` | | HTML name attribute |
| `noDefaultRules` | `boolean` | `false` | | Disables default validation rules |
| `noLabel` | `boolean` | `false` | | Hides the label |
| `noMessages` | `boolean` | `false` | | Hides validation messages |
| `options` | `any[]` | `[]` | | Array of options to display as checkboxes |
| `optionLabel` | `string` | `'label'` | | Key to use as the label for each option |
| `optionValue` | `string` | `'value'` | | Key to use as the value for each option |
| `readonly` | `boolean` | `false` | | Makes all checkboxes read-only |
| `required` | `boolean` | `false` | | Marks field as required |
| `rules` | `Rule[]` | `[]` | | Custom validation rules |
| `state` | `UIState` | `'idle'` | | Validation state |
| `vertical` | `boolean` | `false` | | Arranges checkboxes vertically |

## Types

```typescript
interface VsCheckboxStyleSet {
    variables?: {
        checkboxCheckedColor?: string;
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
> `wrapper` uses `VsInputWrapperStyleSet`. See the [VsInputWrapper documentation](../vs-input-wrapper/README.md) for details.

### StyleSet Example

```html
<template>
    <vs-checkbox
        v-model="checked"
        check-label="Custom Checkbox"
        :style-set="{
            variables: {
                checkboxSize: '1.5rem',
                checkboxColor: '#e0e0e0',
                checkboxCheckedColor: '#6200ea',
            },
            checkboxLabel: {
                fontSize: '1rem',
                fontWeight: '500',
            },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `any` | Emitted when the value changes |
| `update:changed` | `boolean` | Emitted when changed state updates |
| `update:valid` | `boolean` | Emitted when validation state updates |
| `change` | `any` | Emitted on value change |
| `focus` | `FocusEvent` | Emitted when the checkbox gains focus |
| `blur` | `FocusEvent` | Emitted when the checkbox loses focus |
| `toggle` | `boolean, MouseEvent` | Emitted after toggling; payload is the new checked state and the mouse event |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | — |
| `label` | Custom label content |
| `check-label` | Custom content next to the checkbox |
| `messages` | Custom validation message content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `clear` | — | Clears the checkbox value |
| `validate` | — | Triggers validation and returns the result |
| `focus` | — | Focuses the checkbox input element |
| `blur` | — | Blurs the checkbox input element |
| `toggle` | — | Toggles the checked state |
