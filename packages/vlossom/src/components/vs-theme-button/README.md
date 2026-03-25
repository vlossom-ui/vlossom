> 한국어: [README.ko.md](./README.ko.md)

# VsThemeButton

A dedicated button component for toggling the Vlossom framework's Light/Dark theme. Uses `VsToggle` internally and visually shows the current theme state with sun and moon icons.

**Available Version**: 2.0.0+

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

## Props

| Prop          | Type                              | Default | Required | Description                       |
| ------------- | --------------------------------- | ------- | -------- | --------------------------------- |
| `colorScheme` | `ColorScheme`                     | -       | -        | Color scheme for the component    |
| `styleSet`    | `string \| VsThemeButtonStyleSet` | -       | -        | Custom style configuration object |

**Props inherited from VsToggle**: `circle`, `disabled`, `ghost`, `loading`, `outline`, `primary`, `size`

> **Note**: Supports all styling props from VsToggle. See [VsToggle README](../vs-toggle/README.md) for details.

## Events

| Event    | Parameters | Description                                            |
| -------- | ---------- | ------------------------------------------------------ |
| `change` | `boolean`  | Emitted on theme change (`true`: Dark, `false`: Light) |

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

## Features

- **Auto theme detection**: Automatically reflects the current theme of the Vlossom framework
- **Visual feedback**: Shows current theme state with sun (☀️) and moon (🌙) icons
- **Animation effect**: Smooth icon transition animation
- **VsToggle based**: Fully supports all VsToggle features and styling options
- **Framework integration**: Automatically calls `useVlossom().toggleTheme()`
- **Event emission**: Detect theme changes via the `change` event

### Style Customization

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

## Notes

- This component is tightly coupled to the Vlossom framework
- Manages the global theme state via the `useVlossom()` hook
- Theme changes are immediately reflected across the entire application
