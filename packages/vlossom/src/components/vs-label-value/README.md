> 한국어: [README.ko.md](./README.ko.md)

# VsLabelValue

A component that displays a label and value pair. Useful for form information, user profiles, and data display, with various styles and responsive layout support.

**Available Version**: 2.0.0+

## Basic Usage

### Default Label-Value

```html
<template>
    <vs-label-value>
        <template #label>Name</template>
        John Doe
    </vs-label-value>
</template>
```

### Primary Style

```html
<template>
    <vs-label-value primary>
        <template #label>Important Info</template>
        This is an important value
    </vs-label-value>
</template>
```

### Dense Style

```html
<template>
    <vs-label-value dense>
        <template #label>Compact Label</template>
        Small-sized value
    </vs-label-value>
</template>
```

### Responsive Layout

```html
<template>
    <!-- Stacks vertically below 768px container width when responsive -->
    <div class="max-w-md">
        <vs-label-value responsive>
            <template #label>Long Label Text</template>
            This is a long value to test responsive behavior.
            It will stack vertically on smaller screens.
        </vs-label-value>
    </div>
</template>
```

### StyleSet Example

```html
<template>
    <vs-label-value
        :style-set="{
            variables: {
                border: '2px solid #e91e63',
            },
            label: {
                backgroundColor: '#f5f5f5',
                color: '#333',
                fontWeight: 600,
            },
            value: {
                backgroundColor: '#fff',
                color: '#666',
                padding: '1rem 2rem',
            },
        }"
    >
        <template #label>Custom Style</template>
        Customized value
    </vs-label-value>
</template>
```

## Props

| Prop          | Type                             | Default | Required | Description                                     |
| ------------- | -------------------------------- | ------- | -------- | ----------------------------------------------- |
| `colorScheme` | `ColorScheme`                    | -       | -        | Color scheme for the component                  |
| `styleSet`    | `string \| VsLabelValueStyleSet` | -       | -        | Custom style configuration object               |
| `width`       | `string`                         | -       | -        | Component width (e.g. `'400px'`)                |
| `grid`        | `number`                         | -       | -        | Width based on 12-column grid system (1–12)     |
| `dense`       | `boolean`                        | `false` | -        | Apply compact style                             |
| `primary`     | `boolean`                        | `false` | -        | Apply emphasized primary style                  |
| `vertical`    | `boolean`                        | `false` | -        | Always stack label and value vertically         |
| `responsive`  | `boolean`                        | `false` | -        | Switch to vertical layout below 768px container |

## Types

```typescript
import type { CSSProperties } from 'vue';

interface VsLabelValueStyleSet {
    variables?: {
        border?: string;
    };
    component?: CSSProperties;
    label?: CSSProperties;
    value?: CSSProperties;
}
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot      | Description                          |
| --------- | ------------------------------------ |
| `label`   | Content to display in the label area |
| `default` | Content to display in the value area |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Features

- **Vertical/responsive layout**: `vertical` always stacks vertically; `responsive` switches to vertical below 768px container query
- **Flexible customization**: Style the label and value areas independently
- **Dense mode**: Compact style for space-constrained environments
- **Primary emphasis**: Primary style to highlight important information
- **Accessibility**: Appropriate color contrast and visual hierarchy
