# Color Palette

Vlossom's color tokens: 19 hues × 11 steps (50–950), plus three semantic tokens (`soft` / `base` / `strong`).

Hover a swatch to see its CSS variable name. Use the theme toggle in the top right to see how the tokens shift in dark mode.

<ColorPalette />

## Usage

Use the tokens directly as CSS variables, or pick a hue with a component's `colorScheme` prop.

```css
.my-element {
    background-color: var(--vs-blue-500);
    border-color: var(--vs-blue-strong);
}
```

```html
<template>
    <vs-button color-scheme="blue" primary>Blue Button</vs-button>
</template>
```

The **Color scheme** bar at the top of every component page applies a hue to all live demos on that page at once.
