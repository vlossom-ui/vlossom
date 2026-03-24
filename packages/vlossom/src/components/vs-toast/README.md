> 한국어: [README.ko.md](./README.ko.md)

# VsToast & VsToastView

A toast notification component for displaying brief messages. `VsToastView` is the container that renders toasts, and `VsToast` is used as inline toast content. Programmatic control is available via the `toast-plugin`.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Setup VsToastView

Add `VsToastView` once at the app level:

```html
<!-- App.vue -->
<template>
    <div>
        <router-view />
        <vs-toast-view />
    </div>
</template>
```

### Programmatic (toast-plugin)

```typescript
import { useVlossom } from '@/framework';

const $vs = useVlossom();

// Default toast
$vs.toast.show('Saved successfully.');

// Typed toasts
$vs.toast.info('This is an informational message.');
$vs.toast.success('Operation completed successfully.');
$vs.toast.warning('Please check again before proceeding.');
$vs.toast.error('An error occurred.');
```

> See [Toast Plugin](../../plugins/toast-plugin/README.md) for full programmatic API.

### StyleSet Example

```html
<template>
    <vs-toast-view
        :style-set="{
            component: {
                backgroundColor: '#1f2937',
                color: '#ffffff',
                borderRadius: '8px',
            },
        }"
    />
</template>
```

## Props (VsToast)

| Prop          | Type                        | Default | Required | Description                                                          |
| ------------- | --------------------------- | ------- | -------- | -------------------------------------------------------------------- |
| `colorScheme` | `ColorScheme`               | -       | -        | Color scheme for the component                                       |
| `styleSet`    | `string \| VsToastStyleSet` | -       | -        | Custom style configuration object                                    |
| `autoClose`   | `boolean`                   | `true`  | -        | Whether to auto-close                                                |
| `primary`     | `boolean`                   | `true`  | -        | Apply primary style                                                  |
| `timeout`     | `number`                    | `5000`  | -        | Auto-close delay in milliseconds (only applies when `autoClose` is `true`) |

## Types

```typescript
interface VsToastStyleSet {
    closeButton?: Omit<VsButtonStyleSet, 'loading'>;
    component?: CSSProperties;
}
```

> [!NOTE]
>
> `closeButton` uses [VsButtonStyleSet](../vs-button/README.md#types).

## Events

| Event   | Payload | Description                                                              |
| ------- | ------- | ------------------------------------------------------------------------ |
| `close` | -       | Emitted when the toast closes (via close button or auto-close timeout)   |

## Slots (VsToast)

| Slot      | Description                        |
| --------- | ---------------------------------- |
| `default` | Content to display inside the toast |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
