> 한국어: [README.ko.md](./README.ko.md)

# Alert Plugin

A Promise-based plugin that shows a simple alert dialog and waits until the user clicks the OK button. Uses `modal-plugin` internally to render the dialog.

## Usage

The Alert plugin is accessed via the `useVlossom()` hook.

```ts
import { useVlossom } from '@/framework';

const $vs = useVlossom();
await $vs.alert.open('Operation completed successfully.');
```

## API

### open(content, options?)

Displays an alert dialog and waits until the user clicks the OK button.

**Parameters**

- `content`: `string | Component` — Content to display in the dialog body
- `options`: `AlertModalOptions` — Dialog options (optional)

**Returns**

- `Promise<void>` — Resolves when the dialog is closed via the OK button or a specified key press.

**Example**

```ts
await $vs.alert.open('Saved successfully.', {
    colorScheme: 'emerald',
    okText: 'OK',
});
```

## Types

```ts
interface AlertModalOptions extends ModalOptions {
    colorScheme?: ColorScheme;
    styleSet?: string | VsAlertStyleSet;
    okText?: string;
}
```

## Example

```vue
<template>
    <vs-button @click="handleAlert">View Result</vs-button>
</template>

<script setup lang="ts">
import { useVlossom } from '@/framework';

const $vs = useVlossom();

async function handleAlert() {
    await $vs.alert.open('All tasks have been completed.', {
        colorScheme: 'indigo',
        okText: 'Close',
    });
}
</script>
```
