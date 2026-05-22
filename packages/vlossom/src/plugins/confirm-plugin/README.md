> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# Confirm Plugin

**Available Version**: 2.0.0+

Displays a modal confirmation dialog with OK and Cancel buttons. Returns a `Promise<boolean>` that resolves to `true` when the user confirms, and `false` when the user cancels.

## Feature

- Opens a modal overlay with custom string or Vue component content
- Provides OK and Cancel buttons with configurable labels and styles
- Resolves `true` on OK (or Enter key) and `false` on Cancel (or Escape key)
- Supports swapping the button order via `swapButtons`
- Supports custom button container styling via `$buttons` CSSProperties
- Built on top of the Modal Plugin — all `ModalOptions` are inherited

## Basic Usage

Get the Vlossom instance via `useVlossom()` and call `confirm.open`:

```html
<template>
    <vs-button @click="handleDelete">Delete Item</vs-button>
</template>

<script setup>
import { useVlossom } from 'vlossom';

const $vs = useVlossom();

async function handleDelete() {
    const confirmed = await $vs.confirm.open('Are you sure you want to delete this item?');
    if (confirmed) {
        console.log('Deletion confirmed');
    } else {
        console.log('Deletion cancelled');
    }
}
</script>
```

### Using a Vue Component with Props

```html
<script setup>
import { useVlossom } from 'vlossom';
import ConfirmBody from './ConfirmBody.vue';

const $vs = useVlossom();

async function confirmDelete(item) {
    const ok = await $vs.confirm.open(ConfirmBody, {
        componentProps: { item, severity: 'high' },
        okText: 'Delete',
        cancelText: 'Cancel',
    });
}
</script>
```

### Custom Button Text and Style

```html
<script setup>
import { useVlossom } from 'vlossom';

const $vs = useVlossom();

function handleConfirm() {
    $vs.confirm.open('Do you want to proceed?', {
        okText: 'Yes, proceed',
        cancelText: 'No, go back',
        swapButtons: true,
        styleSet: {
            $buttons: { justifyContent: 'end', gap: '1rem' },
            $okButton: { padding: '0.5rem 2rem' },
            $cancelButton: { padding: '0.5rem 2rem' },
        },
    });
}
</script>
```

## Methods

| Method | Parameters                                                                     | Description                                                                                                                |
| ------ | ------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------- |
| `open` | `content: string \| Component, options?: ConfirmModalOptions` | Opens a confirmation modal with the given content and options. Returns `Promise<boolean>` resolving to `true` on OK or `false` on Cancel. |

## Types

```typescript
interface VsConfirmStyleSet extends VsModalNodeStyleSet {
    $buttons?: CSSProperties;
    $okButton?: Omit<VsButtonStyleSet, '$loading'>;
    $cancelButton?: Omit<VsButtonStyleSet, '$loading'>;
}

interface ConfirmModalOptions extends ModalOptions {
    styleSet?: VsConfirmStyleSet;
    colorScheme?: ColorScheme;
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}

interface ConfirmPlugin {
    open(content: string, options?: Omit<ConfirmModalOptions, 'componentProps'>): Promise<boolean>;
    open(content: Component, options?: ConfirmModalOptions): Promise<boolean>;
}
```

> [!NOTE]
> `VsConfirmStyleSet` extends `VsModalNodeStyleSet`. Refer to the [VsModal component docs](../../components/vs-modal/README.md) for available modal style options.
> `ConfirmModalOptions` extends `ModalOptions` from the [Modal Plugin](../modal-plugin/README.md).

## Caution

- The confirm plugin depends on the Modal Plugin. Ensure both are registered when setting up the Vlossom plugin.
- Pressing Enter resolves the promise with `true`; pressing Escape resolves with `false`.
- Clicking outside the modal (if `dimClose` is enabled) resolves with `false`.
