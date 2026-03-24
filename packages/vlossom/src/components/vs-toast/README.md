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

| Prop          | Type                       | Default | Required | Description                       |
| ------------- | -------------------------- | ------- | -------- | --------------------------------- |
| `colorScheme` | `ColorScheme`              | -       | -        | Color scheme for the component    |
| `styleSet`    | `string \| VsToastStyleSet` | -      | -        | Custom style configuration object |
| `primary`     | `boolean`                  | `false` | -        | Apply primary style               |

## Types

```typescript
interface VsToastStyleSet {
    variables?: {
        backgroundColor?: string;
        border?: string;
        fontColor?: string;
    };
    component?: CSSProperties;
}
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots (VsToast)

| Slot      | Description                        |
| --------- | ---------------------------------- |
| `default` | Content to display inside the toast |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
