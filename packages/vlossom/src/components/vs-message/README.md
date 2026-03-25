> 한국어: [README.ko.md](./README.ko.md)

# VsMessage

A message component for displaying validation or status messages. Supports `idle`, `info`, `success`, `warning`, and `error` states, showing an appropriate icon and color for each.

**Available Version**: 2.0.0+

## Basic Usage

### State Variants

```html
<template>
    <vs-message text="This is a default message." />
    <vs-message state="info" text="This is an informational message." />
    <vs-message state="success" text="Completed successfully." />
    <vs-message state="warning" text="Please proceed with caution." />
    <vs-message state="error" text="An error has occurred." />

    <!-- Size adjustment -->
    <vs-message :style-set="{ variables: { size: '1.5rem' } }" text="Large message" />

    <!-- Using a predefined StyleSet -->
    <vs-message style-set="myStyleSet" text="Custom styled message" />
</template>
```

## Props

| Prop       | Type                                                    | Default  | Required | Description                               |
| ---------- | ------------------------------------------------------- | -------- | -------- | ----------------------------------------- |
| `state`    | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'idle'` | -        | Message state (determines icon and color) |
| `text`     | `string`                                                | `''`     | -        | Message text to display                   |
| `styleSet` | `string \| VsMessageStyleSet`                           | -        | -        | Custom style configuration object         |

## Types

```typescript
interface VsMessageStyleSet {
    variables?: {
        size?: string;
    };
    component?: CSSProperties;
}
```

## Features

- **State-specific icons**: Automatically displays the appropriate icon for each state
- **Color theme**: Applies a consistent color scheme based on the state
