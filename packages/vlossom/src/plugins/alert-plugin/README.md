> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# Alert Plugin

**Available Version**: 2.0.0+

Displays a modal alert dialog with a single OK button. Returns a `Promise<void>` that resolves when the user closes the dialog.

## Feature

- Opens a modal overlay with custom string or Vue component content
- Provides a single OK button that resolves the returned promise
- Supports custom OK button text, color scheme, and style set
- Keyboard support: Enter and Escape keys also resolve the promise and close the dialog
- Built on top of the Modal Plugin — all `ModalOptions` are inherited

## Basic Usage

Inject `$vsAlert` in your component and call `open`:

```html
<template>
    <vs-button @click="showAlert">Show Alert</vs-button>
</template>

<script setup>
import { inject } from 'vue';

const $vsAlert = inject('$vsAlert');

async function showAlert() {
    await $vsAlert.open('This is an alert message.');
    console.log('Alert closed');
}
</script>
```

### Custom OK Text and Style

```html
<script setup>
import { inject } from 'vue';

const $vsAlert = inject('$vsAlert');

function showAlert() {
    $vsAlert.open('Operation completed successfully!', {
        okText: 'Got it',
        colorScheme: 'green',
        styleSet: {
            buttonsAlign: 'right',
            button: {
                variables: { padding: '0.5rem 2rem' },
            },
        },
    });
}
</script>
```

## Methods

| Method | Parameters                                                                | Description                                                                                       |
| ------ | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------- |
| `open` | `content: string \| Component, options?: AlertModalOptions` | Opens an alert modal with the given content and options. Returns `Promise<void>` that resolves when the user acknowledges the dialog. |

## Types

```typescript
interface VsAlertStyleSet extends VsModalNodeStyleSet {
    buttonsAlign?: Alignment;
    button?: Omit<VsButtonStyleSet, 'loading'>;
}

interface AlertModalOptions extends ModalOptions {
    styleSet?: VsAlertStyleSet;
    colorScheme?: ColorScheme;
    okText?: string;
}

interface AlertPlugin {
    open(content: string | Component, options?: AlertModalOptions): Promise<void>;
}
```

> [!NOTE]
> `VsAlertStyleSet` extends `VsModalNodeStyleSet`. Refer to the [VsModal component docs](../../components/vs-modal/README.md) for available modal style options.
> `AlertModalOptions` extends `ModalOptions` from the [Modal Plugin](../modal-plugin/README.md).

## Caution

- The alert plugin depends on the Modal Plugin. Ensure both are registered when setting up the Vlossom plugin.
- Pressing Escape or clicking outside the modal (if `dimClose` is enabled) also resolves the promise and closes the dialog.
