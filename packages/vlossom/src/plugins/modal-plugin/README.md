> 한국어: [README.ko.md](./README.ko.md)

# Modal Plugin

A plugin for displaying modals programmatically.

## Usage

The Modal plugin is accessed via `useVlossom()`.

```typescript
import { useVlossom } from '@/framework';

const $vs = useVlossom();
const modalId = $vs.modal.open('Modal content');
```

## API

### open(content, options?)

Displays a modal.

**Parameters:**

- `content`: `string | Component` — Content to display (string or Vue component)
- `options`: `ModalOptions` — Modal options (optional)

**Returns:**

- `string` — The ID of the created modal

**Examples:**

```typescript
// String modal
const modalId = $vs.modal.open('Hello World');

// Component modal
const modalId = $vs.modal.open(MyComponent, { size: 'large' });

// With container
const modalId = $vs.modal.open('Message', { container: '#my-container' });

// With options
const modalId = $vs.modal.open('Content', {
    dimClose: true,
    escClose: true,
    size: { width: '500px', height: '300px' },
});
```

### emit(eventName, ...args)

Emits an event to the last overlay.

**Parameters:**

- `eventName`: `string` — Event name
- `...args`: `any[]` — Event arguments

**Returns:**

- `Promise<any>` — The return value of the event handler

```typescript
$vs.modal.emit('update', { data: 'value' });
```

### emitWithId(id, eventName, ...args)

Emits an event to a specific modal by ID.

**Parameters:**

- `id`: `string` — Modal ID
- `eventName`: `string` — Event name
- `...args`: `any[]` — Event arguments

**Returns:**

- `Promise<any>` — The return value of the event handler

```typescript
$vs.modal.emitWithId('modal-id-123', 'update', { data: 'value' });
```

### close(container?)

Closes the last modal.

**Parameters:**

- `container`: `string` — Container selector (default: `'body'`)

```typescript
$vs.modal.close();
$vs.modal.close('#my-container');
```

### closeWithId(container, id)

Closes a specific modal by ID.

**Parameters:**

- `container`: `string` — Container selector
- `id`: `string` — Modal ID

```typescript
$vs.modal.closeWithId('body', 'modal-id-123');
```

### clear(container?)

Removes all modals from a container.

**Parameters:**

- `container`: `string` — Container selector (default: `'body'`)

```typescript
$vs.modal.clear();
$vs.modal.clear('#my-container');
```

## Types

```typescript
interface ModalOptions {
    container?: string;
    colorScheme?: ColorScheme;
    styleSet?: string | VsModalNodeStyleSet;
    callbacks?: OverlayCallbacks;
    dimClose?: boolean;
    dimmed?: boolean;
    escClose?: boolean;
    focusLock?: boolean;
    hideScroll?: boolean;
    id?: string;
    size?: SizeProp | { width?: SizeProp; height?: SizeProp };
}
```

## Example

```vue
<template>
    <div>
        <vs-button @click="showModal">Show Modal</vs-button>
        <vs-button @click="showComponentModal">Component Modal</vs-button>
        <vs-button @click="closeModal">Close Modal</vs-button>
        <vs-button @click="clearModal">Clear All Modals</vs-button>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { useVlossom } from '@/framework';
import MyModalComponent from './MyModalComponent.vue';

export default defineComponent({
    setup() {
        const $vs = useVlossom();
        let currentModalId = '';

        function showModal() {
            currentModalId = $vs.modal.open('Modal content', {
                dimClose: true,
                escClose: true,
                size: 'medium',
            });
        }

        function showComponentModal() {
            currentModalId = $vs.modal.open(MyModalComponent, {
                dimClose: true,
                escClose: true,
                size: { width: '600px', height: '400px' },
                callbacks: {
                    onClose: () => {
                        console.log('Modal closed');
                    },
                },
            });
        }

        function closeModal() {
            if (currentModalId) {
                $vs.modal.closeWithId('body', currentModalId);
            } else {
                $vs.modal.close();
            }
        }

        function clearModal() {
            $vs.modal.clear();
        }

        return { showModal, showComponentModal, closeModal, clearModal };
    },
});
</script>
```
