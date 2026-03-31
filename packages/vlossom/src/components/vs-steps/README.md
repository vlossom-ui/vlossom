> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsSteps

A step indicator component that displays a sequence of steps with progress tracking.

**Available Version**: 2.0.0+

## Feature

- Displays a horizontal or vertical sequence of named steps
- Tracks progress with an animated progress bar between steps
- Supports disabled steps via a boolean or per-step function
- Keyboard navigation (arrow keys) between steps
- Customizable step, active step, label, progress, and active progress styles
- Responsive layout via `width` and `grid` props

## Basic Usage

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" />
</template>

<script setup>
import { ref } from 'vue';
const currentStep = ref(0);
const steps = ['Step 1', 'Step 2', 'Step 3', 'Step 4'];
</script>
```

### Vertical Layout

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" vertical height="12rem" />
</template>
```

### Without Labels

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" no-label />
</template>
```

### With Disabled Steps

```html
<template>
    <vs-steps
        v-model="currentStep"
        :steps="steps"
        :disabled="(step, index) => index === 2"
    />
</template>
```

## Props

| Prop          | Type                                                          | Default  | Required | Description                                           |
| ------------- | ------------------------------------------------------------- | -------- | -------- | ----------------------------------------------------- |
| `colorScheme` | `string`                                                      | -        | -        | Color scheme for the component                        |
| `styleSet`    | `string \| VsStepsStyleSet`                                   | -        | -        | Custom style set for the component                    |
| `width`       | `string \| number \| Breakpoints`                             | -        | -        | Responsive width                                      |
| `grid`        | `string \| number \| Breakpoints`                             | -        | -        | Grid column span                                      |
| `height`      | `string`                                                      | -        | -        | Height of the steps container (used in vertical mode) |
| `disabled`    | `boolean \| ((step: string, index: number) => boolean)`       | `false`  | -        | Disables steps; can be a boolean or per-step function |
| `gap`         | `string \| number`                                            | `''`     | -        | Gap size between step items                           |
| `noLabel`     | `boolean`                                                     | `false`  | -        | Hides step labels                                     |
| `steps`       | `string[]`                                                    | `[]`     | -        | Array of step label strings                           |
| `vertical`    | `boolean`                                                     | `false`  | -        | Displays steps vertically                             |
| `modelValue`  | `number`                                                      | `0`      | -        | Current step index (v-model)                          |

## Types

```typescript
interface VsStepsStyleSet {
    variables?: {
        stepSize?: string;
    };
    step?: CSSProperties;
    activeStep?: CSSProperties;
    label?: CSSProperties;
    activeLabel?: CSSProperties;
    progress?: CSSProperties;
    activeProgress?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-steps
        v-model="currentStep"
        :steps="steps"
        :style-set="{
            variables: { stepSize: '2rem' },
            step: { border: '2px solid #d1d5db' },
            activeStep: { backgroundColor: '#6366f1', borderColor: '#6366f1', color: '#fff' },
            progress: { backgroundColor: '#a5b4fc' },
            activeProgress: { backgroundColor: '#6366f1' },
        }"
    />
</template>
```

## Events

| Event               | Payload  | Description                            |
| ------------------- | -------- | -------------------------------------- |
| `update:modelValue` | `number` | Emitted when the active step changes   |
| `change`            | `number` | Emitted when the active step changes   |

## Slots

| Slot    | Description                                                                      |
| ------- | -------------------------------------------------------------------------------- |
| `step`  | Custom content for each step circle; receives `{ step, index, isSelected, isPrevious, isDisabled }` |
| `label` | Custom content for each step label; receives `{ step, index, isSelected, isPrevious, isDisabled }` |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
