> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# usePositioning

**Available Version**: 2.0.0+

Computes and maintains the absolute pixel position of an attachment element relative to a target CSS selector, with automatic viewport-overflow correction, scroll/resize tracking, and ResizeObserver support.

## Feature

- Positions the `attachment` element relative to the `target` element using `top`, `right`, `bottom`, `left`, `middle` placements and `start`, `center`, `end` alignment
- Automatically switches placement when there is insufficient space in the viewport
- Throttles position recomputation (30 ms interval) on scroll and resize events
- Uses `ResizeObserver` (when available) to reposition when either element changes size
- Accounts for page scroll offsets (`window.scrollX` / `window.scrollY`)
- Optionally matches the attachment width to the target width via `followWidth`

## Basic Usage

```html
<template>
    <button id="trigger" @click="toggleDropdown">Open</button>
    <div v-if="isVisible" ref="dropdownRef" class="dropdown">
        Dropdown content
    </div>
</template>

<script setup>
import { useTemplateRef } from 'vue';
import { usePositioning } from '@/composables';

const dropdownRef = useTemplateRef('dropdownRef');
const { isVisible, appear, disappear } = usePositioning('#trigger', dropdownRef);

function toggleDropdown() {
    isVisible.value ? disappear() : appear({ placement: 'bottom', align: 'start' });
}
</script>
```

## Args

| Arg          | Type                      | Default | Required | Description                                                             |
| ------------ | ------------------------- | ------- | -------- | ----------------------------------------------------------------------- |
| `target`     | `string`                  | —       | Yes      | CSS selector string identifying the target element to position against. |
| `attachment` | `TemplateRef<HTMLElement>` | —      | Yes      | Template ref of the element to be positioned.                           |

## Types

```typescript
interface AttachInfo {
    placement?: Placement;  // 'top' | 'right' | 'bottom' | 'left' | 'middle'
    align?: Alignment;      // 'start' | 'center' | 'end'
    margin?: number;        // gap in pixels between target and attachment
    followWidth?: boolean;  // if true, attachment width matches target width
}

type Placement = 'top' | 'right' | 'bottom' | 'left' | 'middle';
type Alignment = 'start' | 'center' | 'end';
```

## Return Refs

| RefType             | Type                          | Description                                                           |
| ------------------- | ----------------------------- | --------------------------------------------------------------------- |
| `isVisible`         | `Ref<boolean>`                | Whether the attachment is currently visible.                          |
| `computedPlacement` | `Ref<Placement \| null>`      | The actual placement used after viewport-overflow correction.         |

## Return Methods

| Method     | Parameters              | Description                                                                                    |
| ---------- | ----------------------- | ---------------------------------------------------------------------------------------------- |
| `appear`   | `attachInfo?: AttachInfo` | Shows the attachment and starts tracking scroll/resize to keep it positioned.                |
| `disappear`| —                       | Hides the attachment and stops all scroll/resize/ResizeObserver listeners.                     |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- The `attachment` element must be rendered in the DOM (i.e. `isVisible` should be `true`) before `computePosition` can measure it with `nextTick`.
- If `target` does not match any DOM element, positioning is silently skipped.
