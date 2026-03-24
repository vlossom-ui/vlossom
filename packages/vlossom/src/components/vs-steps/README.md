> 한국어: [README.ko.md](./README.ko.md)

# VsSteps

A step indicator component for guiding users through multi-step processes. Visually represents steps with progress indication and supports both horizontal and vertical layouts.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Steps

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" />
    <div class="mt-4">
        <vs-button :disabled="currentStep <= 0" @click="currentStep--">Previous</vs-button>
        <vs-button :disabled="currentStep >= steps.length - 1" @click="currentStep++">Next</vs-button>
    </div>
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
    <vs-steps v-model="currentStep" :steps="steps" vertical />
</template>
```

### Using Labels

```html
<template>
    <vs-steps
        v-model="currentStep"
        :steps="steps"
        :labels="['Start', 'Review', 'Complete', 'Done']"
    />
</template>
```

### Clickable Steps

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" clickable />
</template>
```

### Disabled State

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" disabled />
</template>
```

## Props

| Prop          | Type                        | Default | Required | Description                                           |
| ------------- | --------------------------- | ------- | -------- | ----------------------------------------------------- |
| `modelValue`  | `number`                    | -       | -        | Current step index (0-based, v-model)                 |
| `colorScheme` | `ColorScheme`               | -       | -        | Color scheme for the component                        |
| `styleSet`    | `string \| VsStepsStyleSet` | -       | -        | Custom style configuration object                     |
| `steps`       | `string[]`                  | `[]`    | -        | Array of step labels                                  |
| `labels`      | `string[]`                  | `[]`    | -        | Labels displayed below each step                      |
| `clickable`   | `boolean`                   | `false` | -        | Allow clicking steps to navigate directly             |
| `disabled`    | `boolean`                   | `false` | -        | Disable all step interactions                         |
| `vertical`    | `boolean`                   | `false` | -        | Apply vertical layout                                 |

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
    progressActive?: CSSProperties;
}
```

## Events

| Event               | Payload  | Description                              |
| ------------------- | -------- | ---------------------------------------- |
| `update:modelValue` | `number` | Emitted when the v-model value changes   |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
