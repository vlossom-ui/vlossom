> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsThemeButton

A toggle button that switches the application between light and dark themes.

**Available Version**: 2.0.0+

## Feature

- Toggles the global Vlossom theme between light and dark modes
- Animated sun/moon icon transition on theme change
- Delegates all button behavior to `VsToggle`
- Supports loading and disabled states
- Customizable size and icon color through `styleSet`

## Basic Usage

```html
<template>
    <vs-theme-button />
</template>
```

### With Custom Size

```html
<template>
    <vs-theme-button
        :style-set="{
            variables: { width: '3rem', height: '3rem', iconColor: '#ff9800' },
        }"
    />
</template>
```

### Disabled State

```html
<template>
    <vs-theme-button disabled />
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsThemeButtonStyleSet` | | | Custom style set for the component |
| `circle` | `boolean` | `false` | | Renders the button as a circle |
| `disabled` | `boolean` | `false` | | Disables the button |
| `ghost` | `boolean` | `false` | | Applies ghost (transparent) style |
| `loading` | `boolean` | `false` | | Shows loading indicator |
| `outline` | `boolean` | `false` | | Applies outline style |
| `primary` | `boolean` | `false` | | Applies primary color style |
| `responsive` | `boolean` | `false` | | Makes the button responsive |
| `size` | `Size` | `'md'` | | Button size (`xs`, `sm`, `md`, `lg`, `xl`) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | | HTML button type |

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
> `button` uses [`VsToggleStyleSet`](../vs-toggle/README.md).

### StyleSet Example

```html
<template>
    <vs-theme-button
        :style-set="{
            variables: {
                width: '2.5rem',
                height: '2.5rem',
                iconColor: '#ff9800',
            },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `change` | `boolean` | Emitted when the theme changes. Payload is `true` for dark mode |

## Slots

| Slot | Description |
| ---- | ----------- |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
