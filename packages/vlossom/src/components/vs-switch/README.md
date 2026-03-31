> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsSwitch

A toggle switch component that supports single and multiple value binding with label customization.

**Available Version**: 2.0.0+

## Feature

- Supports single and multiple (`multiple`) toggle value binding via v-model
- Customizable ON/OFF labels through props or named slots
- Integrated with `VsInputWrapper` for label, message, and validation support
- Provides `beforeChange` hook to intercept toggle transitions asynchronously
- Fully accessible with keyboard focus and ARIA attributes

## Basic Usage

```html
<template>
    <vs-switch v-model="isOn" label="Enable feature" />
</template>

<script setup>
import { ref } from 'vue';
const isOn = ref(false);
</script>
```

### Custom Labels

```html
<template>
    <vs-switch v-model="isOn" true-label="YES" false-label="NO" />
</template>
```

### With beforeChange Hook

```html
<template>
    <vs-switch v-model="isOn" :before-change="confirmChange" />
</template>

<script setup>
import { ref } from 'vue';
const isOn = ref(false);
async function confirmChange(from, to) {
    return confirm(`Switch from ${from} to ${to}?`);
}
</script>
```

### Multiple Mode

```html
<template>
    <vs-switch v-model="selected" :true-value="'apple'" multiple />
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsSwitchStyleSet` | | | Custom style set for the component |
| `beforeChange` | `(from: any, to: any) => Promise<boolean> \| null` | `null` | | Async hook called before the switch changes. Return `false` to cancel |
| `checked` | `boolean` | `false` | | Initial checked state |
| `disabled` | `boolean` | `false` | | Disables the switch |
| `falseLabel` | `string` | `'OFF'` | | Label displayed when the switch is OFF |
| `falseValue` | `any` | `false` | | Value used when switch is OFF |
| `grid` | `string \| number \| Breakpoints` | | | Grid column span |
| `hidden` | `boolean` | `false` | | Hides the component |
| `id` | `string` | `''` | | HTML `id` attribute |
| `label` | `string` | `''` | | Label text above the switch |
| `messages` | `Message[]` | `[]` | | Validation messages |
| `modelValue` | `any` | `false` | | v-model value |
| `multiple` | `boolean` | `false` | | Enables multiple-value binding mode |
| `name` | `string` | `''` | | HTML `name` attribute |
| `noDefaultRules` | `boolean` | `false` | | Disables default validation rules |
| `noMessages` | `boolean` | `false` | | Hides the message area |
| `readonly` | `boolean` | `false` | | Makes the switch read-only |
| `required` | `boolean` | `false` | | Marks the field as required |
| `rules` | `Rule[]` | `[]` | | Custom validation rules |
| `state` | `UIState` | `'idle'` | | UI state (`idle`, `success`, `warning`, `error`) |
| `trueLabel` | `string` | `'ON'` | | Label displayed when the switch is ON |
| `trueValue` | `any` | `true` | | Value used when switch is ON |
| `width` | `string \| number \| Breakpoints` | | | Component width |

## Types

```typescript
interface VsSwitchStyleSet {
    variables?: {
        handleColor?: string;
        handleSize?: string;
    };
    switchButton?: CSSProperties;
    activeSwitchButton?: CSSProperties;
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `wrapper` uses [`VsInputWrapperStyleSet`](../vs-input-wrapper/README.md).

### StyleSet Example

```html
<template>
    <vs-switch
        v-model="isOn"
        :style-set="{
            variables: { handleColor: '#ffffff', handleSize: '1.4rem' },
            switchButton: { borderRadius: '0.25rem' },
            activeSwitchButton: { backgroundColor: '#4caf50' },
            component: { minHeight: '2.5rem' },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `any` | Emitted when the switch value changes |
| `update:changed` | `boolean` | Emitted when the changed state updates |
| `update:valid` | `boolean` | Emitted when the valid state updates |
| `change` | `any` | Emitted on value change |
| `focus` | `FocusEvent` | Emitted on focus |
| `blur` | `FocusEvent` | Emitted on blur |

## Slots

| Slot | Description |
| ---- | ----------- |
| `label` | Custom label content |
| `true-label` | Custom content shown when the switch is ON |
| `false-label` | Custom content shown when the switch is OFF |
| `messages` | Custom message content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `focus` | | Focuses the switch input |
| `blur` | | Blurs the switch input |
| `validate` | | Triggers validation |
| `clear` | | Clears the value |
