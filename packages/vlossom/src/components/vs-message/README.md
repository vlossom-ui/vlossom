> 한국어: [README.ko.md](./README.ko.md)

# VsMessage

A message component for displaying validation or status messages. Supports `idle`, `info`, `success`, `warning`, and `error` states, showing an appropriate icon and color for each.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Message

```html
<template>
    <vs-message text="Please enter your email address." />
</template>
```

### State Variants

```html
<template>
    <vs-message state="info" text="This is an informational message." />
    <vs-message state="success" text="Saved successfully." />
    <vs-message state="warning" text="Please check again." />
    <vs-message state="error" text="An error occurred." />
</template>
```

### Size Adjustment via StyleSet

```html
<template>
    <vs-message
        state="info"
        text="Custom sized message"
        :style-set="{
            variables: {
                size: '1.2rem',
            },
        }"
    />
</template>
```

## Props

| Prop       | Type                          | Default  | Required | Description                                         |
| ---------- | ----------------------------- | -------- | -------- | --------------------------------------------------- |
| `state`    | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'idle'` | - | Message state (determines icon and color) |
| `text`     | `string`                      | `''`     | -        | Message text to display                             |
| `styleSet` | `string \| VsMessageStyleSet` | -        | -        | Custom style configuration object                   |

## Types

```typescript
interface VsMessageStyleSet {
    variables?: {
        size?: string; // icon size — must use variables for CSS variable binding
    };
    component?: CSSProperties;
}
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

## Features

- **State-specific icons**: Automatically displays the appropriate icon for each state
- **Color theme**: Applies a consistent color scheme based on the state
