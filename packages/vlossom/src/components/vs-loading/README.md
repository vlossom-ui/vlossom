# VsLoading

An animated loading indicator composed of five vertical bars with a wave animation.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Displays five animated bars with a sequential wave effect.
- Customizable color via the `variables.color` style property.
- Customizable bar width via the `variables.barWidth` style property.
- Supports `width` and `height` props for sizing.
- Supports color schemes for consistent theming.

## Basic Usage

```html
<template>
    <vs-loading />
</template>
```

### Custom Size

```html
<template>
    <vs-loading width="4rem" height="5rem" />
</template>
```

### Color Scheme

```html
<template>
    <vs-loading color-scheme="green" />
</template>
```

## Props

| Prop          | Type                          | Default | Required | Description                                         |
| ------------- | ----------------------------- | ------- | -------- | --------------------------------------------------- |
| `colorScheme` | `string`                      | -       | -        | Color scheme for the loading bars.                  |
| `styleSet`    | `string \| VsLoadingStyleSet` | -       | -        | Custom style set for the component.                 |
| `width`       | `string \| number`            | -       | -        | Width of the loading container.                     |
| `height`      | `string \| number`            | -       | -        | Height of the loading container.                    |

## Types

```typescript
interface VsLoadingStyleSet {
    variables?: {
        barWidth?: string;
        color?: string;
    };
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-loading
        :style-set="{
            variables: {
                color: '#ff6b6b',
                barWidth: '15%',
            },
            component: { width: '6rem', height: '8rem' },
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
