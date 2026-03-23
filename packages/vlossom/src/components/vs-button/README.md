> 한국어: [README.ko.md](./README.ko.md)

# VsButton

A versatile button component supporting various styles and states. Provides loading state, size variants, and color schemes for consistent UI design.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Button

```html
<template>
    <vs-button>Default Button</vs-button>
</template>
```

### Style Variants

```html
<template>
    <vs-button primary>Primary Button</vs-button>
    <vs-button outline>Outline Button</vs-button>
    <vs-button ghost>Ghost Button</vs-button>
    <vs-button circle>⭕</vs-button>
</template>
```

### Size Variants

```html
<template>
    <vs-button size="xs">XS Button</vs-button>
    <vs-button size="sm">SM Button</vs-button>
    <vs-button>Default Button</vs-button>
    <vs-button size="lg">LG Button</vs-button>
    <vs-button size="xl">XL Button</vs-button>
</template>
```

### Loading State

```html
<template>
    <vs-button loading>Loading Button</vs-button>
</template>
```

### Disabled State

```html
<template>
    <vs-button disabled>Disabled Button</vs-button>
</template>
```

## Props

| Prop          | Type                                    | Default    | Required | Description                                       |
| ------------- | --------------------------------------- | ---------- | -------- | ------------------------------------------------- |
| `colorScheme` | `string`                                | -          | -        | Color scheme for the component                    |
| `styleSet`    | `string \| VsButtonStyleSet`            | -          | -        | Custom style configuration object                 |
| `circle`      | `boolean`                               | `false`    | -        | Apply circular button style                       |
| `disabled`    | `boolean`                               | `false`    | -        | Disable the button                                |
| `ghost`       | `boolean`                               | `false`    | -        | Apply ghost style with transparent background     |
| `loading`     | `boolean`                               | `false`    | -        | Show loading spinner                              |
| `outline`     | `boolean`                               | `false`    | -        | Apply outline style                               |
| `primary`     | `boolean`                               | `false`    | -        | Apply primary style for main actions              |
| `responsive`  | `boolean`                               | `false`    | -        | Apply responsive style                            |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | -          | -        | Button size                                       |
| `type`        | `'button' \| 'submit' \| 'reset'`       | `'button'` | -        | The `type` attribute of the HTML button element   |

## Types

```typescript
interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
```

> [!NOTE]
>
> `loading` uses [VsLoadingStyleSet](../vs-loading/README.md#types).

### StyleSet Example

```html
<template>
    <vs-button
        :style-set="{
            variables: {
                padding: '0 2rem',
            },
            component: {
                backgroundColor: '#e188e5',
                border: '2px solid #e188e5',
                borderRadius: '12px',
                color: '#fff',
                height: '4rem',
            },
            loading: {
                component: {
                    width: '50%',
                    height: '70%',
                },
            },
        }"
    >
        Custom Button
    </vs-button>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                        |
| --------- | ---------------------------------- |
| `default` | Content to display inside the button |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
