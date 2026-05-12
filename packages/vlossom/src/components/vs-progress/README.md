> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsProgress

A progress bar component that displays the completion status of a task.

**Available Version**: 2.0.0+

## Feature

- Uses the native HTML `<progress>` element for accessibility
- Supports numeric `value` and `max` props for flexible progress representation
- Optional `label` text displayed over the progress bar
- Color scheme support for consistent theming
- Customizable bar, value indicator, and label styles via `variables`

## Basic Usage

```html
<template>
    <vs-progress :value="50" :max="100" />
</template>
```

### With Label

```html
<template>
    <vs-progress :value="75" :max="100" label="75%" />
</template>
```

### With Color Scheme

```html
<template>
    <vs-progress :value="30" :max="100" color-scheme="blue" />
</template>
```

## Props

| Prop          | Type                          | Default | Required | Description                                         |
| ------------- | ----------------------------- | ------- | -------- | --------------------------------------------------- |
| `colorScheme` | `string`                      | -       | -        | Color scheme for the component                      |
| `styleSet`    | `string \| VsProgressStyleSet` | -       | -        | Custom style set for the component                  |
| `max`         | `number \| string`            | `1`     | -        | Maximum value of the progress bar (must be > 0)     |
| `value`       | `number \| string`            | `0`     | -        | Current value of the progress bar (must be >= 0)    |
| `label`       | `string`                      | `''`    | -        | Text label displayed over the progress bar          |

## Types

```typescript
interface VsProgressStyleSet extends CSSProperties {
    $barBackgroundColor?: string;
    $barBorder?: string;
    $barBorderRadius?: string;
    $valueBackgroundColor?: string;
    $labelTextShadow?: string;
    $labelFontColor?: string;

}
```

### StyleSet Example

```html
<template>
    <vs-progress
        :value="60"
        :max="100"
        label="60%"
        :style-set="{
            $barBackgroundColor: '#e5e7eb',
            $barBorderRadius: '0.5rem',
            $valueBackgroundColor: '#6366f1',
            $labelFontColor: '#ffffff',
            height: '1.5rem',
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
