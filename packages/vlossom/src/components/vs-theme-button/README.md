> 한국어: [README.ko.md](./README.ko.md)

# VsThemeButton

A dedicated button component for toggling the Vlossom framework's Light/Dark theme. Uses `VsToggle` internally and visually shows the current theme state with sun and moon icons.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Theme Button

```html
<template>
    <vs-theme-button @change="handleThemeChange" />
</template>

<script setup>
const handleThemeChange = (isDark) => {
    console.log('Theme changed to:', isDark ? 'Dark' : 'Light');
};
</script>
```

### StyleSet Example

```html
<template>
    <vs-theme-button :style-set="themeButtonStyle" />
</template>

<script setup>
const themeButtonStyle = {
    variables: {
        width: '3.5rem',
        height: '3.5rem',
        iconColor: '#fcd34d',
    },
    button: {
        component: {
            backgroundColor: '#1f2937',
            border: '2px solid #374151',
            borderRadius: '0.5rem',
        },
    },
};
</script>
```

## Props

| Prop          | Type                              | Default | Required | Description                           |
| ------------- | --------------------------------- | ------- | -------- | ------------------------------------- |
| `colorScheme` | `ColorScheme`                     | -       | -        | Color scheme for the component        |
| `styleSet`    | `string \| VsThemeButtonStyleSet` | -       | -        | Custom style configuration object     |

**Props inherited from VsToggle**: `circle`, `disabled`, `ghost`, `loading`, `outline`, `primary`, `size`

> **Note**: Supports all styling props from VsToggle. See [VsToggle README](../vs-toggle/README.md) for details.

## Types

```typescript
interface VsThemeButtonStyleSet {
    variables?: {
        width?: string;
        height?: string;
        iconColor?: string;
    };
    button?: VsToggleStyleSet;
}
```

> [!NOTE]
>
> `button` uses [VsToggleStyleSet](../vs-toggle/README.md#types).

## Events

| Event    | Payload   | Description                                       |
| -------- | --------- | ------------------------------------------------- |
| `change` | `boolean` | Emitted on theme change (`true`: Dark, `false`: Light) |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
