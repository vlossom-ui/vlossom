> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsChip

A compact element for displaying tags, labels, or status indicators with optional icon and close button.

**Available Version**: 2.0.0+

## Feature

- Optional close button via `closable` prop that emits a `close` event
- Optional leading icon slot for visual indicators
- Multiple visual variants: `primary`, `outline`
- Five size options: `xs`, `sm` (default), `md`, `lg`, `xl`
- Separate style control for icon and close button via CSSProperties

## Basic Usage

```html
<template>
    <vs-chip>Label</vs-chip>
</template>
```

### Closable Chip

```html
<template>
    <vs-chip closable @close="removeChip">Removable</vs-chip>
</template>
```

### With Icon

```html
<template>
    <vs-chip>
        <template #icon>★</template>
        Featured
    </vs-chip>
</template>
```

### Primary and Outline

```html
<template>
    <vs-chip primary>Primary</vs-chip>
    <vs-chip outline>Outline</vs-chip>
</template>
```

### Sizes

```html
<template>
    <vs-chip size="xs">XS</vs-chip>
    <vs-chip size="sm">SM</vs-chip>
    <vs-chip size="md">MD</vs-chip>
    <vs-chip size="lg">LG</vs-chip>
    <vs-chip size="xl">XL</vs-chip>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | Color scheme for the component |
| `styleSet` | `string \| VsChipStyleSet` | | | Custom style set |
| `closable` | `boolean` | `false` | | Shows a close button |
| `outline` | `boolean` | `false` | | Applies outlined style |
| `primary` | `boolean` | `false` | | Applies primary color scheme |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | | Chip size |

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
        closable
        :style-set="{
            variables: {
                height: '2rem',
            },
            component: {
                borderRadius: '0.25rem',
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
            },
            icon: {
                color: '#2e7d32',
            },
            closeButton: {
                opacity: '0.7',
            },
        }"
    >
        <template #icon>✓</template>
        Active
    </vs-chip>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `close` | — | Emitted when the close button is clicked |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Chip label content |
| `icon` | Leading icon displayed before the label |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
