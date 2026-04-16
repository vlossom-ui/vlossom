> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# Toast Plugin

**Available Version**: 2.0.0+

Displays brief, non-blocking notification toasts. Supports multiple severity levels (info, success, warning, error), configurable placement, and auto-close behavior.

## Feature

- Shows transient notifications with string or Vue component content
- Built-in severity methods: `info`, `success`, `warning`, `error` — each with a preset color scheme
- Configurable placement (top/bottom), alignment (left/center/right), and auto-close timeout
- `warning` and `error` also emit `console.warn` / `console.error`
- Optional custom logger callback for external logging
- Supports removing a specific toast by ID or clearing all toasts in a container

## Basic Usage

Inject `$vsToast` in your component and call a method:

```html
<template>
    <div class="flex gap-2">
        <vs-button @click="showInfo">Info</vs-button>
        <vs-button @click="showSuccess">Success</vs-button>
        <vs-button @click="showWarning">Warning</vs-button>
        <vs-button @click="showError">Error</vs-button>
    </div>
</template>

<script setup>
import { inject } from 'vue';

const $vsToast = inject('$vsToast');

function showInfo() {
    $vsToast.info('This is an info message.');
}
function showSuccess() {
    $vsToast.success('Operation completed successfully!');
}
function showWarning() {
    $vsToast.warning('Please check your input.');
}
function showError() {
    $vsToast.error('Something went wrong.');
}
</script>
```

### Custom Options

```html
<script setup>
import { inject } from 'vue';

const $vsToast = inject('$vsToast');

function showCustomToast() {
    $vsToast.show('Custom toast message', {
        placement: 'top',
        align: 'right',
        autoClose: true,
        timeout: 3000,
        primary: true,
    });
}
</script>
```

## Methods

| Method    | Parameters                                                                 | Description                                                                                        |
| --------- | -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `show`    | `message: string \| Component, options?: ToastOptions`      | Shows a toast with the given content and options.                                                  |
| `info`    | `message: string \| Component, options?: ToastOptions`      | Shows a toast with the `cyan` color scheme.                                                        |
| `success` | `message: string \| Component, options?: ToastOptions`      | Shows a toast with the `green` color scheme.                                                       |
| `warning` | `message: string \| Component, options?: ToastOptions`      | Shows a toast with the `yellow` color scheme and calls `console.warn`.                             |
| `error`   | `message: string \| Component, options?: ToastOptions`      | Shows a toast with the `red` color scheme and calls `console.error`.                               |
| `remove`  | `container: string, id: string`                                            | Removes the toast with the specified ID from the given container.                                  |
| `clear`   | `container?: string`                                                       | Removes all toasts from the given container (defaults to `'body'`).                                |

## Types

```typescript
interface ToastOptions {
    container?: string;
    colorScheme?: ColorScheme;
    styleSet?: string | VsToastStyleSet;
    align?: Alignment;
    autoClose?: boolean;
    placement?: Exclude<Placement, 'left' | 'right'>;
    primary?: boolean;
    timeout?: number;
    logger?: (message: string | Component) => string;
}

interface ToastPlugin {
    show(message: string | Component, options?: ToastOptions): void;
    info(message: string | Component, options?: ToastOptions): void;
    success(message: string | Component, options?: ToastOptions): void;
    warning(message: string | Component, options?: ToastOptions): void;
    error(message: string | Component, options?: ToastOptions): void;
    remove(container: string, id: string): void;
    clear(container?: string): void;
}
```

> [!NOTE]
> `styleSet` accepts a `VsToastStyleSet` object or a pre-registered style set name (string). Refer to the [VsToast component docs](../../components/vs-toast/README.md) for style set details.

## Caution

- When `container` is specified, the container element's `position` is automatically set to `relative` if it has no existing position style.
- The `placement` option does not support `'left'` or `'right'` — only `'top'` and `'bottom'` are valid.
- `warning` and `error` always call `console.warn` / `console.error` in addition to showing the toast, regardless of other options.
