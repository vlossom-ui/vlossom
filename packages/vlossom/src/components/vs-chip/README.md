> 한국어: [README.ko.md](./README.ko.md)

# VsChip

A chip component for displaying small pieces of information or tags. Supports icons and a close button for versatile use cases.

**Available Version**: 2.0.0+

## Basic Usage

### Default Chip

```html
<template>
    <vs-chip>Default Chip</vs-chip>
</template>
```

### Chip with Icon

```html
<template>
    <vs-chip>
        <template #icon>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M20 6L9 17l-5-5"/>
            </svg>
        </template>
        Success
    </vs-chip>
</template>
```

### Closable Chip

```html
<template>
    <vs-chip closable @close="handleClose">Closable Chip</vs-chip>
</template>
```

### Style Variants

```html
<template>
    <vs-chip primary>Primary Chip</vs-chip>
    <vs-chip size="sm">Small Chip</vs-chip>
    <vs-chip size="lg">Large Chip</vs-chip>
    <vs-chip closable>Closable Chip</vs-chip>
</template>
```

## Props

| Prop          | Type                                   | Default | Required | Description                             |
| ------------- | -------------------------------------- | ------- | -------- | --------------------------------------- |
| `colorScheme` | `string`                               | -       | -        | Color scheme for the component          |
| `styleSet`    | `string \| VsChipStyleSet`             | -       | -        | Custom style configuration object       |
| `closable`    | `boolean`                              | `false` | -        | Show close button                       |
| `outline`     | `boolean`                              | `false` | -        | Apply outline style                     |
| `primary`     | `boolean`                              | `false` | -        | Apply primary style for key information |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | -       | -        | Chip size                               |

## Types

```typescript
interface VsChipStyleSet {
    variables?: {
        height?: string;
    };
    component?: CSSProperties;
    icon?: CSSProperties;
    closeButton?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-chip
        :style-set="{
            variables: {
                height: '3rem',
            },
            component: {
                backgroundColor: '#f3e5f5',
                border: '2px solid #9c27b0',
                borderRadius: '20px',
                color: '#7b1fa2',
            },
        }"
    >
        Custom Chip
    </vs-chip>
</template>
```

## Slots

| Slot      | Description                             |
| --------- | --------------------------------------- |
| `default` | Content to display inside the chip      |
| `icon`    | Icon to display at the left of the chip |

## Events

| Event   | Parameters | Description                              |
| ------- | ---------- | ---------------------------------------- |
| `close` | -          | Emitted when the close button is clicked |

## Features

- **Color theme**: Apply predefined color combinations via the `colorScheme` prop
- **Style customization**: Fine-tune styles via the `styleSet` prop
- **Icon support**: Add icons via the `icon` slot
- **Close functionality**: Show a close button and handle events via the `closable` prop
- **Size variants**: Adjust size via the `size` prop (`xs`, `sm`, `md`, `lg`, `xl`)
