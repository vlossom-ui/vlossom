> 한국어: [README.ko.md](./README.ko.md)

# VsProgress

A progress bar component that visually represents task completion status. Based on the HTML5 `<progress>` element, supports various style customizations and label display.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Progress

```html
<template>
    <vs-progress :value="50" :max="100" />
</template>
```

### With Label

```html
<template>
    <vs-progress :value="75" :max="100" label="Uploading file..." />
</template>

<script setup>
import { ref } from 'vue';
const progress = ref(75);
</script>
```

### With Color Theme

```html
<template>
    <vs-progress :value="60" :max="100" color-scheme="green" label="Uploading file..." />
</template>
```

## Props

| Prop          | Type                           | Default | Required | Description                               |
| ------------- | ------------------------------ | ------- | -------- | ----------------------------------------- |
| `colorScheme` | `ColorScheme`                  | -       | -        | Color scheme for the component            |
| `styleSet`    | `string \| VsProgressStyleSet` | -       | -        | Custom style configuration object         |
| `max`         | `number \| string`             | `100`   | -        | Maximum progress value                    |
| `value`       | `number \| string`             | `0`     | -        | Current progress value                    |
| `label`       | `string`                       | `''`    | -        | Label text to display on the progress bar |

## Types

```typescript
interface VsProgressStyleSet {
    variables?: {
        bar?: {
            backgroundColor?: string;
            border?: string;
            borderRadius?: string;
        };
        value?: {
            backgroundColor?: string;
        };
        label?: {
            textShadow?: string;
            fontColor?: string;
        };
    };
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-progress
        :value="75"
        :max="100"
        label="Uploading..."
        :style-set="{
            variables: {
                bar: {
                    backgroundColor: '#f0f0f0',
                    border: '2px solid #ddd',
                    borderRadius: '8px',
                },
                value: {
                    backgroundColor: '#4caf50',
                },
                label: {
                    fontColor: '#333',
                    textShadow: '0 0 4px rgba(0,0,0,0.3)',
                },
            },
            component: {
                width: '400px',
                height: '24px',
            },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
