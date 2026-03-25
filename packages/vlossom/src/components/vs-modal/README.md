> 한국어: [README.ko.md](./README.ko.md)

# VsModal & VsModalNode & VsModalView

A modal dialog component. `VsModal` is a declarative component using v-model, `VsModalNode` is an individual modal node component, and `VsModalView` is a container component that groups and renders multiple modals.

**Available Version**: 2.0.0+

> **Note**: Practical usage examples are provided via the `modal-plugin`. See the plugin documentation for details.

## VsModal

A declarative component that manages modal open/close state using v-model.

### Basic Usage

```html
<template>
    <!-- Default modal -->
    <vs-modal v-model="isOpen" @open="handleOpen" @close="handleClose">
        <div>
            <h2>Modal Title</h2>
            <p>Modal content</p>
        </div>
        <vs-button color-scheme="red" @click="isOpen = false">Close</vs-button>
    </vs-modal>

    <!-- Close when dimmed background is clicked -->
    <vs-modal v-model="isOpen" dim-close dimmed>
        <div>Modal content</div>
    </vs-modal>

    <!-- Close with ESC key -->
    <vs-modal v-model="isOpen" esc-close>
        <div>Modal content</div>
    </vs-modal>

    <!-- Custom container -->
    <vs-modal v-model="isOpen" container="#my-container">
        <div>Modal content</div>
    </vs-modal>

    <!-- Custom size -->
    <vs-modal v-model="isOpen" size="lg">
        <div>Large modal</div>
    </vs-modal>
</template>
```

### Props

| Prop          | Type                                                  | Default  | Required | Description                                            |
| ------------- | ----------------------------------------------------- | -------- | -------- | ------------------------------------------------------ |
| `colorScheme` | `string`                                              | -        | -        | Color scheme for the component                         |
| `styleSet`    | `string \| VsModalNodeStyleSet`                       | -        | -        | Custom style configuration object                      |
| `container`   | `string`                                              | `'body'` | -        | Container selector where the modal is rendered         |
| `escClose`    | `boolean`                                             | `true`   | -        | Whether to close the modal with the ESC key            |
| `size`        | `SizeProp \| { width?: SizeProp; height?: SizeProp }` | -        | -        | Modal size                                             |
| `callbacks`   | `OverlayCallbacks`                                    | `{}`     | -        | Overlay callback functions                             |
| `dimClose`    | `boolean`                                             | `true`   | -        | Whether to close when the dimmed background is clicked |
| `dimmed`      | `boolean`                                             | `false`  | -        | Whether to show the dimmed background                  |
| `focusLock`   | `boolean`                                             | `false`  | -        | Whether to lock keyboard focus inside the modal        |
| `hideScroll`  | `boolean`                                             | `false`  | -        | Whether to hide the scrollbar                          |
| `id`          | `string`                                              | `''`     | -        | Modal ID                                               |
| `modelValue`  | `boolean`                                             | `false`  | -        | Modal open/close state (v-model)                       |

### Types

```typescript
import type { CSSProperties } from 'vue';

interface VsModalNodeStyleSet {
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
}

type SizeProp = Size | string | number;

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface OverlayCallbacks<T = void> {
    [eventName: string]: (...args: any[]) => T | Promise<T>;
}
```

> [!NOTE]
>
> `dimmed` uses [VsDimmedStyleSet](../vs-dimmed/README.md#types).

### Slots

| Slot      | Description                         |
| --------- | ----------------------------------- |
| `default` | Content to display inside the modal |

### Events

| Event               | Parameters | Description                            |
| ------------------- | ---------- | -------------------------------------- |
| `update:modelValue` | `boolean`  | Emitted when the v-model value changes |
| `open`              | -          | Emitted when the modal opens           |
| `close`             | -          | Emitted when the modal closes          |

### Features

- **v-model support**: Manages modal open/close state via the `modelValue` prop with two-way binding
- **Plugin integration**: Uses `modal-plugin` internally to display the modal
- **Container targeting**: The `container` prop lets you specify the container where the modal renders
- **Closing**: The `escClose` and `dimClose` props provide automatic closing on ESC key press and dimmed area clicks

---

## VsModalNode

A component that renders an individual modal node. Provides dimmed background, focus trap, and scroll management.

### Basic Usage

```html
<template>
    <vs-modal-node
        :color-scheme
        :style-set
        :dim-close
        :dimmed
        :esc-close
        :size
        @close
    >
        <div>Modal content</div>
    </vs-modal-node>
</template>
```

### Props

| Prop          | Type                                                  | Default | Required | Description                                            |
| ------------- | ----------------------------------------------------- | ------- | -------- | ------------------------------------------------------ |
| `colorScheme` | `string`                                              | -       | -        | Color scheme for the component                         |
| `styleSet`    | `string \| VsModalNodeStyleSet`                       | -       | -        | Custom style configuration object                      |
| `escClose`    | `boolean`                                             | `true`  | -        | Whether to close the modal with the ESC key            |
| `size`        | `SizeProp \| { width?: SizeProp; height?: SizeProp }` | -       | -        | Modal size                                             |
| `callbacks`   | `OverlayCallbacks`                                    | `{}`    | -        | Overlay callback functions                             |
| `dimClose`    | `boolean`                                             | `false` | -        | Whether to close when the dimmed background is clicked |
| `dimmed`      | `boolean`                                             | `false` | -        | Whether to show the dimmed background                  |
| `focusLock`   | `boolean`                                             | `false` | -        | Whether to lock keyboard focus inside the modal        |
| `hideScroll`  | `boolean`                                             | `false` | -        | Whether to hide the scrollbar                          |
| `id`          | `string`                                              | `''`    | -        | Modal ID                                               |

### Types

```typescript
import type { CSSProperties } from 'vue';

interface VsModalNodeStyleSet {
    component?: CSSProperties;
    dimmed?: VsDimmedStyleSet;
}

type SizeProp = Size | string | number;

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface OverlayCallbacks<T = void> {
    [eventName: string]: (...args: any[]) => T | Promise<T>;
}
```

### Slots

| Slot      | Description                         |
| --------- | ----------------------------------- |
| `default` | Content to display inside the modal |

### Events

| Event          | Parameters | Description                             |
| -------------- | ---------- | --------------------------------------- |
| `close`        | -          | Emitted when the modal closes           |
| `click-dimmed` | -          | Emitted when the dimmed area is clicked |

### Features

- **Size configuration**: The `size` prop accepts `Size` type values (`xs`, `sm`, `md`, `lg`, `xl`) or direct size values (string, number)
- **Dimmed background**: The `dimmed` prop shows a dimmed background overlay
- **Focus management**: Uses the `vs-focus-trap` component to restrict focus inside the modal
- **Scroll management**: Uses the `vs-inner-scroll` component to manage scrolling inside the modal
- **Auto size calculation**: When `size` is a `Size` type, the modal size is automatically calculated using predefined size ratios

---

## VsModalView

A container component that groups and renders multiple modals. Automatically mounted via `modal-plugin`, rendering each modal appropriately based on its properties.

### Props

| Prop        | Type     | Default  | Required | Description                            |
| ----------- | -------- | -------- | -------- | -------------------------------------- |
| `container` | `string` | `'body'` | -        | Container selector where modals render |

### Features

- **Automatic rendering**: Automatically renders when a modal is added via `modal-plugin`
- **Transition effects**: Uses `TransitionGroup` for smooth animations when modals are added or removed
- **Fixed positioning**: Applies `position: fixed` style when `container` is `'body'`

---

### Component Relationship

`VsModalView` uses `VsModalNode` internally to render each modal.
When a modal is added via `modal-plugin`, `VsModalView` mounts automatically and displays the modal in the appropriate container.

`VsModal` manages modal open/close state using v-model and uses `modal-plugin` internally to display the modal.
