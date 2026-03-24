> 한국어: [README.ko.md](./README.ko.md)

# Confirm Plugin

A plugin that shows a confirmation dialog and returns the result as `Promise<boolean>`. Uses `modal-plugin` internally to render the component.

## Usage

The Confirm plugin is accessed via the `useVlossom()` hook.

```ts
import { useVlossom } from '@/framework';

const $vs = useVlossom();
const result = await $vs.confirm.open('Are you sure you want to delete this?');
```

## API

### open(content, options?)

Displays a confirmation dialog and returns the user's response.

**Parameters**

- `content`: `string | Component` — Content to display in the dialog body
- `options`: `ConfirmModalOptions` — Dialog options (optional)

**Returns**

- `Promise<boolean>` — `true` if OK is clicked, `false` if Cancel or dismissed.

**Example**

```ts
const confirmed = await $vs.confirm.open('Are you sure you want to proceed?', {
    colorScheme: 'red',
    okText: 'Proceed',
    cancelText: 'Cancel',
    swapButtons: true,
});

if (confirmed) {
    // OK logic
} else {
    // Cancel logic
}
```

## Types

```ts
interface ConfirmModalOptions {
    container?: string;
    callbacks?: OverlayCallbacks;
    dimClose?: boolean;
    dimmed?: boolean;
    escClose?: boolean;
    focusLock?: boolean;
    hideScroll?: boolean;
    id?: string;
    size?: SizeProp | { width?: SizeProp; height?: SizeProp };

    colorScheme?: ColorScheme;
    styleSet?: string | VsConfirmStyleSet;
    okText?: string;
    cancelText?: string;
    swapButtons?: boolean;
}
```

## Example

```vue
<template>
    <vs-button @click="handleConfirm">Delete</vs-button>
</template>

<script setup lang="ts">
import { useVlossom } from '@/framework';

const $vs = useVlossom();

async function handleConfirm() {
    const confirmed = await $vs.confirm.open('This action cannot be undone. Are you sure?', {
        colorScheme: 'red',
        okText: 'Delete',
        cancelText: 'Cancel',
    });

    if (confirmed) {
        console.log('Executing delete');
    }
}
</script>
```
