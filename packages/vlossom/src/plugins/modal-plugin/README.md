> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# Modal Plugin

**Available Version**: 2.0.0+

Programmatically opens and manages modal dialogs. Supports mounting any string or Vue component as modal content, custom callbacks, keyboard handling, and multi-modal stacking.

## Feature

- Opens modals with string or Vue component content
- Supports custom callbacks for events (e.g. button clicks, keyboard shortcuts)
- Multiple modals can be stacked inside the same or different containers
- Provides imperative API to emit events, close specific modals, or clear all modals
- Configurable overlay behavior: dim, dim-close, focus lock, scroll hiding, size
- All Alert, Confirm, and Prompt plugins are built on top of this plugin

## Basic Usage

Inject `$vsModal` in your component and call `open`:

```html
<template>
    <vs-button @click="openModal">Open Modal</vs-button>
</template>

<script setup>
import { inject } from 'vue';

const $vsModal = inject('$vsModal');

function openModal() {
    const modalId = $vsModal.open('Hello from modal!', {
        dimClose: true,
        size: 'sm',
    });
}
</script>
```

### Using a Vue Component as Content

```html
<script setup>
import { inject } from 'vue';
import MyModalContent from './MyModalContent.vue';

const $vsModal = inject('$vsModal');

function openModal() {
    const modalId = $vsModal.open(MyModalContent, {
        callbacks: {
            'modal-submit': (data) => {
                console.log('Submitted:', data);
                $vsModal.close();
            },
        },
    });
}
</script>
```

### Closing a Modal by ID

```html
<script setup>
import { inject } from 'vue';

const $vsModal = inject('$vsModal');
let currentModalId = null;

function openModal() {
    currentModalId = $vsModal.open('Are you sure?', {
        dimmed: true,
        escClose: true,
    });
}

function closeModal() {
    if (currentModalId) {
        $vsModal.closeWithId('body', currentModalId);
    }
}
</script>
```

## Methods

| Method          | Parameters                                                                 | Description                                                                                                   |
| --------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------- |
| `open`          | `content: string \| Component, options?: ModalOptions`      | Opens a modal with the given content and options. Returns the modal's unique string ID.                       |
| `emit`          | `eventName: string, ...args: any[]`                                        | Emits a named event on the most recently opened modal's callback store.                                       |
| `emitWithId`    | `id: string, eventName: string, ...args: any[]`                            | Emits a named event on a specific modal by its ID.                                                            |
| `close`         | `container?: string`                                                       | Closes the most recently opened modal in the given container (defaults to `'body'`). Returns `Promise<boolean>` indicating whether the modal actually closed (a `beforeClose` hook can abort by resolving `false`). |
| `closeWithId`   | `container: string, id: string`                                            | Closes a specific modal by its container and ID. Returns `Promise<boolean>` indicating whether the modal actually closed. |
| `clear`         | `container?: string`                                                       | Closes all modals in the given container (defaults to `'body'`). Bypasses `beforeClose`.                       |

## Types

```typescript
interface ModalOptions {
    beforeClose?: () => Promise<boolean> | boolean;
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

interface ModalPlugin {
    open(content: string | Component, options?: ModalOptions): string;
    emit(eventName: string, ...args: any[]): void | Promise<void>;
    emitWithId(id: string, eventName: string, ...args: any[]): void | Promise<void>;
    close(container?: string): Promise<boolean>;
    closeWithId(container: string, id: string): Promise<boolean>;
    clear(container?: string): void;
}
```

### Aborting close with `beforeClose`

Pass a `beforeClose` hook in `ModalOptions` to gate ESC, dim-click, and `close`/`closeWithId` calls. Resolve `false` to keep the modal open.

```html
<script setup>
import { inject } from 'vue';

const $vsModal = inject('$vsModal');

function openModal() {
    $vsModal.open('Unsaved changes — close anyway?', {
        dimClose: true,
        escClose: true,
        beforeClose: async () => window.confirm('Discard changes?'),
    });
}
</script>
```

> [!NOTE]
> `styleSet` accepts a `VsModalNodeStyleSet` object or a pre-registered style set name (string). Refer to the [VsModal component docs](../../components/vs-modal/README.md) for style set details.

## Caution

- When `container` is specified, the container element's `position` is automatically set to `relative` if it has no existing position style. This ensures the modal overlay is positioned correctly.
- The modal ID returned by `open` can be used with `closeWithId` to close a specific modal in a multi-modal scenario.
- `emit` targets the last opened modal. Use `emitWithId` for precise targeting when multiple modals are open.
