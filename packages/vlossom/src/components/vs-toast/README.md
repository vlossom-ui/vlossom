> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsToast

A toast notification component with auto-close, hover pause, and a close button.

**Available Version**: 2.0.0+

## Feature

- Auto-closes after a configurable timeout (default 5 seconds)
- Pauses the auto-close timer when the mouse hovers over the toast
- Built-in close button that emits a `close` event
- Primary and non-primary visual variants
- Designed to be used with `VsToastView` for managing multiple toasts

## Basic Usage

```html
<template>
    <vs-toast @close="handleClose">
        Operation completed successfully!
    </vs-toast>
</template>
```

### With Custom Timeout

```html
<template>
    <vs-toast :timeout="3000" @close="handleClose">
        This toast closes in 3 seconds.
    </vs-toast>
</template>
```

### Manual Close Only

```html
<template>
    <vs-toast :auto-close="false" @close="handleClose">
        Click the X button to close.
    </vs-toast>
</template>
```

### Using VsToastView

`VsToastView` is the container component that renders all active toasts. Place it once at the app root.

```html
<template>
    <vs-toast-view />
</template>
```

Toasts are typically triggered via the `$vs.toast` plugin API.

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `string` | | | Color scheme for the component |
| `styleSet` | `string \| VsToastStyleSet` | | | Custom style set for the component |
| `autoClose` | `boolean` | `true` | | Automatically closes after `timeout` ms |
| `primary` | `boolean` | `true` | | Applies primary color to the toast |
| `timeout` | `number` | `5000` | | Milliseconds before auto-close |

## Types

```typescript
interface VsToastStyleSet {
    closeButton?: Omit<VsButtonStyleSet, 'loading'>;
    component?: CSSProperties;
}
```

> [!NOTE]
> `closeButton` uses [`VsButtonStyleSet`](../vs-button/README.md) (excluding `loading`).

### StyleSet Example

```html
<template>
    <vs-toast
        :style-set="{
            component: {
                backgroundColor: '#323232',
                color: '#ffffff',
                borderRadius: '0.5rem',
                padding: '0.75rem 1rem',
            },
            closeButton: {
                component: { color: '#ffffff' },
            },
        }"
    >
        Custom styled toast
    </vs-toast>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `close` | | Emitted when the toast should be closed (auto-close or close button click) |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Toast message content |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
