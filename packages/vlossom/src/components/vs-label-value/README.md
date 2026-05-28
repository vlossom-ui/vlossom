# VsLabelValue

A two-column display component that pairs a label cell with a value cell, useful for detail views and data tables.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Side-by-side label and value layout with a configurable border.
- Primary color mode highlights the label area with the primary color scheme.
- Configurable size (`xs`, `sm`, `md`, `lg`, `xl`) controls padding and font size.
- Vertical mode stacks label and value cells vertically.
- Responsive vertical mode switches to vertical layout on small containers.

## Basic Usage

```html
<template>
    <vs-label-value>
        <template #label>Name</template>
        John Doe
    </vs-label-value>
</template>
```

### Primary Mode

```html
<template>
    <vs-label-value :primary="true">
        <template #label>Status</template>
        Active
    </vs-label-value>
</template>
```

### Vertical Layout

```html
<template>
    <vs-label-value :vertical="true">
        <template #label>Description</template>
        A long description text goes here.
    </vs-label-value>
</template>
```

### Sizes

```html
<template>
    <vs-label-value size="xs">
        <template #label>ID</template>
        12345
    </vs-label-value>
</template>
```

### Responsive Vertical

Switch to vertical layout on small containers automatically.

```html
<template>
    <vs-label-value :responsive="true">
        <template #label>Address</template>
        123 Main Street
    </vs-label-value>
</template>
```

## Props

| Prop          | Type                             | Default | Required | Description                                                       |
| ------------- | -------------------------------- | ------- | -------- | ----------------------------------------------------------------- |
| `colorScheme` | `string`                         | -       | -        | Color scheme for the component.                                   |
| `styleSet`    | `string \| VsLabelValueStyleSet` | -       | -        | Custom style set for the component.                               |
| `width`       | `string \| number \| Breakpoints`| -       | -        | Width of the component.                                           |
| `grid`        | `string \| number \| Breakpoints`| -       | -        | Grid column span for layout.                                      |
| `size`        | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'`  | -        | Component size (controls min-height, padding, and font size).     |
| `primary`     | `boolean`                        | `false` | -        | Applies primary color scheme to the label cell.                   |
| `vertical`    | `boolean`                        | `false` | -        | Stacks label and value cells vertically.                          |
| `responsive`  | `boolean`                        | `false` | -        | Automatically switches to vertical layout in narrow containers.   |

## Types

```typescript
interface VsLabelValueStyleSet extends CSSProperties {
    $border?: string;
    $label?: CSSProperties;
    $value?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-label-value
        :style-set="{
            $border: '2px solid #007bff',
            borderRadius: '8px',
            $label: { backgroundColor: '#e7f0ff', color: '#007bff', fontWeight: '700' },
            $value: { padding: '0 1.5rem' },
        }"
    >
        <template #label>Project</template>
        Vlossom UI
    </vs-label-value>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                      |
| --------- | -------------------------------- |
| `default` | The value cell content.          |
| `label`   | The label cell content.          |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
