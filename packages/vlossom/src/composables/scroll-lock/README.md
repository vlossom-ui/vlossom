> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useScrollLock

**Available Version**: 2.0.0+

Prevents scrolling on a container element (defaults to `body`) by setting `overflow: hidden` and compensating for scrollbar width on non-touch devices.

## Feature

- Locks scroll by setting `overflow: hidden` on the target container
- On non-touch devices, adds `paddingRight` / `paddingBottom` to compensate for the scrollbar gutter (fixed at `8px`)
- Saves the original overflow and padding values before locking and restores them on unlock
- Uses `requestAnimationFrame` for smooth style application/restoration
- Tracks locked state via the reactive `isLocked` ref

## Basic Usage

```html
<script setup>
import { useScrollLock } from '@/composables';

const { isLocked, lock, unlock } = useScrollLock('body');

function openModal() {
    lock();
}

function closeModal() {
    unlock();
}
</script>
```

## Args

| Arg         | Type     | Default   | Required | Description                                        |
| ----------- | -------- | --------- | -------- | -------------------------------------------------- |
| `container` | `string` | `'body'`  | No       | CSS selector for the element to lock scrolling on. |

## Types

```typescript
interface ScrollLockState {
    overflow: string;
    paddingRight: string;
    paddingBottom: string;
}
```

## Return Refs

| RefType    | Type           | Description                                         |
| ---------- | -------------- | --------------------------------------------------- |
| `isLocked` | `Ref<boolean>` | `true` while the container scroll is locked.        |

## Return Methods

| Method   | Parameters | Description                                                                                       |
| -------- | ---------- | ------------------------------------------------------------------------------------------------- |
| `lock`   | —          | Saves the current overflow/padding state and applies scroll-lock styles via `requestAnimationFrame`. |
| `unlock` | —          | Restores the saved overflow/padding state via `requestAnimationFrame`.                            |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- The composable queries the container element at call time. If the DOM is not ready when `useScrollLock` is called, `containerElement` will be `null` and `lock`/`unlock` will be no-ops.
- Scrollbar compensation is skipped on touch devices to avoid layout shifts.
- Calling `lock` when already locked, or `unlock` when already unlocked, is a no-op.
