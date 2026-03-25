> 한국어: [README.ko.md](./README.ko.md)

# VsToast & VsToastView

A toast notification component for displaying brief messages. `VsToast` is the individual toast item component, and `VsToastView` is a container component that groups toasts by position.

**Available Version**: 2.0.0+

> **Note**: Practical usage examples are provided via the `toast-plugin`. See the plugin documentation for details.

## VsToast

An individual toast message component. Supports auto-close, color schemes, and custom styles.

### Basic Usage

```html
<template>
    <!-- Default toast -->
    <vs-toast @close="handleClose">
        Toast message
    </vs-toast>

    <!-- Disable auto-close -->
    <vs-toast :auto-close="false" @close="handleClose">
        Message that requires manual close
    </vs-toast>

    <!-- Custom timeout -->
    <vs-toast :timeout="3000" @close="handleClose">
        Message that auto-closes after 3 seconds
    </vs-toast>
</template>
```

### Props

| Prop          | Type                        | Default | Required | Description                                                                |
| ------------- | --------------------------- | ------- | -------- | -------------------------------------------------------------------------- |
| `colorScheme` | `string`                    | -       | -        | Color scheme for the component                                             |
| `styleSet`    | `string \| VsToastStyleSet` | -       | -        | Custom style configuration object                                          |
| `autoClose`   | `boolean`                   | `true`  | -        | Whether to auto-close                                                      |
| `primary`     | `boolean`                   | `true`  | -        | Apply primary style                                                        |
| `timeout`     | `number`                    | `5000`  | -        | Auto-close delay in milliseconds (only applies when `autoClose` is `true`) |

### Types

```typescript
interface VsToastStyleSet {
    closeButton?: Omit<VsButtonStyleSet, 'loading'>;
    component?: CSSProperties;
}
```

> [!NOTE]
>
> `closeButton` uses [VsButtonStyleSet](../vs-button/README.md#types).

### StyleSet Example

```html
<template>
    <vs-toast
        :style-set="{
            closeButton: {
                component: {
                    color: '#ffffff',
                },
            },
            component: {
                borderRadius: '16px',
                padding: '1rem 4rem',
                height: '60px',
                backgroundColor: '#4caf50',
                border: '2px solid #2e7d32',
                color: '#ffffff',
            },
        }"
        @close="handleClose"
    >
        Custom style toast
    </vs-toast>
</template>
```

### Slots

| Slot      | Description                         |
| --------- | ----------------------------------- |
| `default` | Content to display inside the toast |

### Events

| Event   | Payload | Description                                                            |
| ------- | ------- | ---------------------------------------------------------------------- |
| `close` | -       | Emitted when the toast closes (via close button or auto-close timeout) |

---

## VsToastView

A container component that groups and renders multiple toasts by position. Automatically mounted via `toast-plugin`, placing each toast in the appropriate position based on its `placement` and `align` properties.

### Props

| Prop        | Type     | Default  | Required | Description                            |
| ----------- | -------- | -------- | -------- | -------------------------------------- |
| `container` | `string` | `'body'` | -        | Container selector where toasts render |

---

### Component Relationship

`VsToastView` uses `VsToast` internally to render each toast message.
When a toast is added via `toast-plugin`, `VsToastView` mounts automatically and displays the toast in the appropriate position.
