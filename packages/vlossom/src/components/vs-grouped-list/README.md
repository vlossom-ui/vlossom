> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsGroupedList

A scrollable list component that renders items with optional grouping, automatic virtual scroll for large lists, and full slot customization.

**Available Version**: 2.0.0+

## Feature

- Renders a flat or grouped list from an `items` array of `OptionItem`
- Optional grouping via the `groupBy` function and `groupOrder` array
- Scrollable via the embedded `VsInnerScroll` component
- Automatically switches to virtual scroll when `items.length >= 100` — no configuration needed
- Virtual scroll measures each item's actual DOM height, so variable-height items are supported
- Full slot customization for group headers and individual items
- Exposes `scrollToItem` and `hasScroll` methods for programmatic control

## Basic Usage

```html
<template>
    <vs-grouped-list :items="items" @click-item="onClickItem" />
</template>

<script setup>
const items = [
    { id: '1', label: 'Apple', item: { category: 'fruit' } },
    { id: '2', label: 'Banana', item: { category: 'fruit' } },
    { id: '3', label: 'Carrot', item: { category: 'vegetable' } },
];

function onClickItem(item) {
    console.log('Clicked:', item.label);
}
</script>
```

### Grouped List

```html
<template>
    <vs-grouped-list
        :items="items"
        :group-by="(item) => item.category"
        :group-order="['fruit', 'vegetable']"
    >
        <template #group="{ group }">
            <div class="group-header">{{ group.toUpperCase() }}</div>
        </template>
        <template #item="{ label }">
            <div class="list-item">{{ label }}</div>
        </template>
    </vs-grouped-list>
</template>
```

### With Custom Height and Scrolling

```html
<template>
    <vs-grouped-list
        :items="longList"
        :style-set="{ maxHeight: '300px' }"
        @click-item="handleClick"
    />
</template>
```

### Large List (Virtual Scroll)

Virtual scroll activates automatically when `items.length >= 100`. No additional props are required. The component measures each item's real DOM height, so rows with different heights are handled correctly.

```html
<template>
    <div style="height: 400px;">
        <vs-grouped-list
            ref="listRef"
            :items="largeItems"
            @click-item="onClickItem"
        />
    </div>
</template>

<script setup>
import { ref } from 'vue';

const listRef = ref(null);

function scrollToSelected(id) {
    listRef.value?.scrollToItem(id);
}
</script>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `styleSet` | `string \| VsGroupedListStyleSet` | | | Custom style set for the component |
| `items` | `OptionItem[]` | `[]` | | Array of items to display |
| `groupBy` | `(item: any, index: number) => string` | | | Function that returns the group name for each item |
| `groupOrder` | `string[]` | | | Order in which groups should appear |

## Types

```typescript
interface VsGroupedListStyleSet extends CSSProperties {
    $header?: CSSProperties;
    $content?: CSSProperties;
    $footer?: CSSProperties;
    $group?: CSSProperties;
    $item?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-grouped-list
        :items="items"
        :style-set="{
            maxHeight: '400px',
            $group: { backgroundColor: '#f0f0f0', fontWeight: 'bold', padding: '0.5rem 1rem' },
            $item: { padding: '0.4rem 1.2rem' },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `click-item` | `OptionItem & { itemIndex: number; group: VsGroupedListGroup; groupIndex: number }` | Emitted when an item is clicked |

## Slots

| Slot | Description |
| ---- | ----------- |
| `header` | Content for the scrollable list header |
| `footer` | Content for the scrollable list footer |
| `empty` | Content shown in the list body when `items` is empty |
| `group` | Custom render for a group header. Receives `{ group: string, groupIndex: number, items: OptionItem[] }` |
| `item` | Custom render for an item. Receives the `OptionItem` fields plus `{ itemIndex, group, groupIndex }` |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `scrollToItem` | `id: string, offset?: number` | Scroll the list to the item with the given id. `offset` shifts the scroll position up by the given pixels (default: `0`). Works in both virtual and regular rendering modes. |
| `hasScroll` | - | Returns `boolean` — `true` if the list has a scrollbar |
