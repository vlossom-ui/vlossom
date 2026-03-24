> 한국어: [README.ko.md](./README.ko.md)

# Toast Plugin

A plugin for displaying toast notifications.

## Usage

The Toast plugin is accessed via `useVlossom()`.

```typescript
import { useVlossom } from '@/framework';

const $vs = useVlossom();
$vs.toast.show('Toast message');
```

## API

### show(content, options?)

Displays a toast.

**Parameters:**

- `content`: `string | Component` — Content to display (string or Vue component)
- `options`: `ToastOptions` — Toast options (optional)

**Examples:**

```typescript
$vs.toast.show('Hello World');
$vs.toast.show(MyComponent, { placement: 'middle', align: 'center' });
$vs.toast.show('Message', { container: '#my-container' });
```

### info(content, options?)

Displays an info toast (cyan color).

```typescript
$vs.toast.info('Info message');
```

### success(content, options?)

Displays a success toast (green color).

```typescript
$vs.toast.success('Success message');
```

### warning(content, options?)

Displays a warning toast (yellow color).

```typescript
$vs.toast.warning('Warning message');
```

### error(content, options?)

Displays an error toast (red color).

```typescript
$vs.toast.error('Error message');
```

### remove(container, id)

Removes a specific toast.

**Parameters:**

- `container`: `string` — Container selector
- `id`: `string` — Toast ID

```typescript
$vs.toast.remove('body', 'toast-id-123');
```

### clear(container?)

Removes all toasts from a container.

**Parameters:**

- `container`: `string` — Container selector (default: `'body'`)

```typescript
$vs.toast.clear();
$vs.toast.clear('#my-container');
```

## Types

```typescript
interface ToastOptions {
    container?: string;
    colorScheme?: ColorScheme;
    styleSet?: string | VsToastStyleSet;
    align?: Alignment;
    autoClose?: boolean;
    placement?: 'top' | 'middle' | 'bottom';
    primary?: boolean;
    timeout?: number;
    logger?: (message: string | Component) => string;
}
```

## Example

```vue
<template>
    <div>
        <vs-button @click="showToast">Show Toast</vs-button>
        <vs-button @click="showPrimaryToast">Primary Toast</vs-button>
        <vs-button @click="showErrorToast">Error Toast</vs-button>
        <vs-button @click="clearToast">Clear Toasts</vs-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useVlossom } from '@/framework';

export default defineComponent({
    setup() {
        const $vs = useVlossom();

        function showToast() {
            $vs.toast.show('Toast message', { placement: 'middle', align: 'center' });
        }

        function showPrimaryToast() {
            $vs.toast.show('Primary Toast', { primary: true });
        }

        function showErrorToast() {
            $vs.toast.error('An error occurred');
        }

        function clearToast() {
            $vs.toast.clear();
        }

        return { showToast, showPrimaryToast, showErrorToast, clearToast };
    },
});
</script>
```
