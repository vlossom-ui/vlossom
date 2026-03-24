> 한국어: [README.ko.md](./README.ko.md)

# VsProgress

A progress bar component that visually represents task completion status.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Progress

```html
<template>
    <vs-progress :value="60" />
</template>
```

### With Label

```html
<template>
    <vs-progress :value="75" label="75%" />
</template>
```

### Indeterminate (Unknown Progress)

```html
<template>
    <vs-progress indeterminate />
</template>
```

### StyleSet Example

```html
<template>
    <vs-progress
        :value="70"
        label="70%"
        :style-set="{
            variables: {
                backgroundColor: '#e3f2fd',
                valueColor: '#1976d2',
                fontColor: '#1976d2',
                borderRadius: '12px',
            },
        }"
    />
</template>
```

## Props

| Prop            | Type                           | Default | Required | Description                               |
| --------------- | ------------------------------ | ------- | -------- | ----------------------------------------- |
| `colorScheme`   | `ColorScheme`                  | -       | -        | Color scheme for the component            |
| `styleSet`      | `string \| VsProgressStyleSet` | -       | -        | Custom style configuration object         |
| `value`         | `number`                       | `0`     | -        | Progress value (0–100)                    |
| `label`         | `string`                       | `''`    | -        | Label text to display on the progress bar |
| `indeterminate` | `boolean`                      | `false` | -        | Show indeterminate animation              |

## Types

```typescript
interface VsProgressStyleSet {
    variables?: {
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        fontColor?: string;
        textShadow?: string;
        valueColor?: string;
    };
    component?: CSSProperties;
}
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
