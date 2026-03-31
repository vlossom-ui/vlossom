> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useOverlayCallback

**Available Version**: 2.0.0+

Manages the active/inactive lifecycle of an overlay component and registers its callbacks in the global overlay callback store so other parts of the app can trigger them.

## Feature

- Generates a unique overlay id from the provided `id` ref or an auto-generated fallback
- Registers callbacks in `useOverlayCallbackStore` when the overlay is activated
- Removes callbacks from the store when deactivated, with a brief `isUnmounting` window matching `ANIMATION_DURATION`
- Exposes simple `activate` / `deactivate` methods for controlling visibility

## Basic Usage

```html
<template>
    <div v-if="isActivated || isUnmounting" class="vs-modal">
        <!-- modal content -->
    </div>
</template>

<script setup>
import { ref, toRefs } from 'vue';
import { useOverlayCallback } from '@/composables';

const props = defineProps({ id: { type: String, default: '' } });
const { id } = toRefs(props);

const callbacks = ref({
    onBeforeOpen: () => console.log('before open'),
    onOpen: () => console.log('opened'),
});

const { overlayId, isActivated, isUnmounting, activate, deactivate } = useOverlayCallback(id, callbacks);
</script>
```

## Args

| Arg         | Type                      | Default    | Required | Description                                                                    |
| ----------- | ------------------------- | ---------- | -------- | ------------------------------------------------------------------------------ |
| `id`        | `Ref<string>`             | —          | Yes      | Reactive ref for the overlay id. Falls back to an auto-generated id when empty.|
| `callbacks` | `Ref<OverlayCallbacks>`   | `ref({})` | No       | Object containing optional lifecycle callbacks for the overlay.                |

## Types

```typescript
interface OverlayCallbacks {
    onBeforeOpen?: () => void;
    onOpen?: () => void;
    onBeforeClose?: () => void;
    onClose?: () => void;
}
```

## Return Refs

| RefType        | Type              | Description                                                                          |
| -------------- | ----------------- | ------------------------------------------------------------------------------------ |
| `overlayId`    | `ComputedRef<string>` | The resolved overlay id (prop value or auto-generated).                          |
| `isActivated`  | `Ref<boolean>`    | `true` while the overlay is active.                                                  |
| `isUnmounting` | `Ref<boolean>`    | `true` during the closing animation window (`ANIMATION_DURATION` ms after deactivation). |

## Return Methods

| Method       | Parameters | Description                                                               |
| ------------ | ---------- | ------------------------------------------------------------------------- |
| `activate`   | —          | Sets `isActivated` to `true` and registers callbacks in the store.        |
| `deactivate` | —          | Sets `isActivated` to `false` and removes callbacks from the store.       |

## Hooks

| Hook    | Description                                                                            |
| ------- | -------------------------------------------------------------------------------------- |
| `watch` | Watches `isActivated` to push/remove callbacks from `useOverlayCallbackStore`.         |

## Cautions
