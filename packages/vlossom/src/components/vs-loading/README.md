> 한국어: [README.ko.md](./README.ko.md)

# VsLoading

An animated loading indicator component. Displays a series of animated bars. Supports flexible size configuration and color customization.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Loading

```html
<template>
    <vs-loading />
</template>
```

### Custom Size

```html
<template>
    <vs-loading width="2rem" height="2rem" />
    <vs-loading width="4rem" height="4rem" />
    <vs-loading width="6rem" height="6rem" />
    <vs-loading width="8rem" height="8rem" />
</template>
```

### StyleSet Example

```html
<template>
    <vs-loading
        :style-set="{
            variables: {
                color: '#e91e63',
                barWidth: '15%',
            },
            component: {
                width: '4rem',
                height: '4rem',
            },
        }"
    />
</template>
```

## Props

| Prop          | Type                          | Default | Required | Description                       |
| ------------- | ----------------------------- | ------- | -------- | --------------------------------- |
| `colorScheme` | `ColorScheme`                 | -       | -        | Color scheme for the component    |
| `styleSet`    | `string \| VsLoadingStyleSet` | -       | -        | Custom style configuration object |
| `width`       | `string \| number`            | -       | -        | Loading indicator width (default 8rem)  |
| `height`      | `string \| number`            | -       | -        | Loading indicator height (default 10rem) |

## Types

```typescript
interface VsLoadingStyleSet {
    variables?: {
        color?: string;
        barWidth?: string;
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
