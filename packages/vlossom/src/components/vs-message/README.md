# VsMessage

A small message display component that shows an icon and text for different UI states: idle, info, success, warning, and error.

> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

**Available Version**: 2.0.0+

## Feature

- Supports five states: `idle`, `info`, `success`, `warning`, and `error`.
- Each state renders a corresponding icon and applies a matching color.
- Icon and text size are controlled via the `variables.size` CSS custom property.
- Directly accepts a `text` prop for the message content.

## Basic Usage

```html
<template>
    <vs-message text="This is an informational message." state="info" />
    <vs-message text="Operation successful!" state="success" />
    <vs-message text="Please check your input." state="warning" />
    <vs-message text="An error occurred." state="error" />
</template>
```

### Default State

When no state is specified, the `idle` state is used (default color).

```html
<template>
    <vs-message text="Default idle message." />
</template>
```

## Props

| Prop       | Type                                                          | Default  | Required | Description                                                   |
| ---------- | ------------------------------------------------------------- | -------- | -------- | ------------------------------------------------------------- |
| `styleSet` | `string \| VsMessageStyleSet`                                 | -        | -        | Custom style set for the component.                           |
| `state`    | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'`      | `'idle'` | -        | The UI state that determines the icon and color.              |
| `text`     | `string`                                                      | `''`     | -        | The message text to display.                                  |

## Types

```typescript
interface VsMessageStyleSet {
    variables?: {
        size?: string;
    };
    component?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-message
        text="Custom sized message"
        state="info"
        :style-set="{
            variables: { size: '1rem' },
            component: { padding: '0.25rem 0' },
        }"
    />
</template>
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
