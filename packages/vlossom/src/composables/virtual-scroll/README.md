> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useVirtualScroll

**Available Version**: 2.1.0+

Computes the visible window of a large list so only the rows in view are rendered. It resolves which element actually scrolls on its own, so the same call works whether the list scrolls itself, an ancestor scrolls, or the page scrolls.

## Feature

- Renders only the items in view plus a small overscan, regardless of how many items exist
- Resolves the scroll container automatically: the given element, its nearest scrollable ancestor, or the window
- Item offsets are relative to the content element, so they stay correct even when the scroll container starts far above the list
- Supports variable-height items through `measureElement`
- Supports both rendering strategies — absolutely positioned items (`start`) and leading/trailing spacers (`paddingStart` / `paddingEnd`)
- `scrollToIndex` and `scrollIntoView` scroll whichever container is in use

## Basic Usage

Absolute positioning — each item is placed inside a spacer sized to `totalSize`.

```html
<template>
    <div ref="containerRef" style="height: 400px; overflow: auto;">
        <div ref="contentRef" :style="{ position: 'relative', height: `${totalSize}px` }">
            <div
                v-for="item in virtualItems"
                :key="item.key"
                :data-index="item.index"
                :ref="(el) => measureElement(el as HTMLElement)"
                :style="{ position: 'absolute', top: 0, width: '100%', transform: `translateY(${item.start}px)` }"
            >
                {{ rows[item.index].label }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useVirtualScroll, VIRTUAL_SCROLL_THRESHOLD } from 'vlossom';

const rows = ref([]);
const containerRef = ref(null);
const contentRef = ref(null);

const { virtualItems, totalSize, measureElement } = useVirtualScroll({
    enabled: computed(() => rows.value.length >= VIRTUAL_SCROLL_THRESHOLD),
    count: computed(() => rows.value.length),
    estimateSize: 40,
    getScrollContainer: () => containerRef.value,
    getContentElement: () => contentRef.value,
});
</script>
```

Spacers — for layouts where items cannot leave the normal flow, such as a table or grid whose rows share column tracks.

```html
<template>
    <tbody ref="contentRef">
        <tr v-if="paddingStart > 0" :style="{ height: `${paddingStart}px` }" />
        <tr v-for="item in virtualItems" :key="item.key" :data-index="item.index">
            <td>{{ rows[item.index].label }}</td>
        </tr>
        <tr v-if="paddingEnd > 0" :style="{ height: `${paddingEnd}px` }" />
    </tbody>
</template>
```

## Args

`useVirtualScroll` takes a single options object.

| Arg | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `enabled` | `Ref<boolean>` | | Yes | When `false`, nothing is virtualized and `virtualItems` is empty |
| `count` | `Ref<number>` | | Yes | Total number of items |
| `estimateSize` | `MaybeRef<number>` | | Yes | Estimated item size in pixels, used until an item is measured |
| `getScrollContainer` | `() => HTMLElement \| null` | | Yes | Where scroll container resolution starts. Resolution walks up from this element |
| `getContentElement` | `() => HTMLElement \| null` | | Yes | The element items are laid out in. Its position inside the scroll container becomes the offset baseline |
| `overscan` | `number` | `5` | | Extra items rendered above and below the visible range |
| `getItemKey` | `(index: number) => string` | | | Stable key per item. Defaults to the index |

## Types

```typescript
interface VsVirtualItem {
    index: number;
    key: string;
    // Offset relative to the content element
    start: number;
    size: number;
}
```

Exported constants: `VIRTUAL_SCROLL_THRESHOLD` (`100`) and `DEFAULT_VIRTUAL_OVERSCAN` (`5`).

## Return Refs

| RefType | Type | Description |
| ---- | ---- | ----------- |
| `virtualItems` | `ComputedRef<VsVirtualItem[]>` | Items to render, in order |
| `totalSize` | `ComputedRef<number>` | Height of the full list in pixels |
| `paddingStart` | `ComputedRef<number>` | Space before the first rendered item |
| `paddingEnd` | `ComputedRef<number>` | Space after the last rendered item |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `measureElement` | `element: HTMLElement \| null` | Registers an item element so its real height is measured. The element must carry `data-index` |
| `scrollToIndex` | `index: number, offset?: number` | Scrolls the item at `index` to the top. `offset` leaves the given pixels of space above it |
| `scrollIntoView` | `element: HTMLElement, offset?: number` | Scrolls an already rendered element to the top. Use this when items are not virtualized |

## Hooks

| Hook | Description |
| ---- | ----------- |
| `onMounted` | Resolves the scroll container and starts listening for resize and scroll |
| `onBeforeUnmount` | Disconnects observers and removes listeners |

## Cautions

- `getScrollContainer` must return an element that either scrolls itself or sits inside something that scrolls. An element with `overflow: auto` but no bounded height does not scroll, and resolution correctly moves on to the ancestor or the window.
- Items rendered through `measureElement` must set `data-index` to `item.index`, otherwise measured sizes are attributed to the wrong item.
- `virtualItems[].start` is already relative to the content element. Do not subtract the scroll position from it again.
- Deciding when to turn virtualization on is left to the caller. `VIRTUAL_SCROLL_THRESHOLD` is the shared default, not an automatic behavior.
- Items are not measured until they render, so `totalSize` shifts as the user scrolls through unmeasured items. This is expected for variable-height content.
