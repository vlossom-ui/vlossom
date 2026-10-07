> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsGroupedList

A scrollable list component that renders items with optional grouping, automatic virtual scrolling for large lists, and full slot customization.

**Available Version**: 2.0.0+

## Feature

- Renders a flat or grouped list from an `items` array of `OptionItem`
- Optional grouping via the `groupBy` function and `groupOrder` array
- Scrollable via the embedded `VsInnerScroll` component
- Automatically switches to virtual scrolling when there are more than 100 items, in both flat and grouped lists
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

### Virtual Scroll

When `items` has more than 100 entries, only the rows near the visible area are rendered. Group headers and items are virtualized together, and row heights are measured after rendering, so custom `group` and `item` slots with different heights work as well. Give the list a bounded height (for example `maxHeight`) so it can scroll.

```html
<template>
    <vs-grouped-list :items="largeList" :style-set="{ maxHeight: '300px' }" />

    <!-- render every item at once -->
    <vs-grouped-list :items="largeList" :style-set="{ maxHeight: '300px' }" no-virtual />
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `styleSet` | `string \| VsGroupedListStyleSet` | | | Custom style set for the component |
| `items` | `OptionItem[]` | `[]` | | Array of items to display |
| `groupBy` | `(item: any, index: number) => string` | | | Function that returns the group name for each item |
| `groupOrder` | `string[]` | | | Order in which groups should appear |
| `noVirtual` | `boolean` | `false` | | Disable automatic virtual scrolling and render every item |

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
| `click-item` | `OptionItem & { groupedIndex: number; group: VsGroupedListGroup; groupIndex: number }` | Emitted when an item is clicked |

## Slots

| Slot | Description |
| ---- | ----------- |
| `header` | Content for the scrollable list header |
| `footer` | Content for the scrollable list footer |
| `empty` | Content shown in the list body when `items` is empty |
| `group` | Custom render for a group header. Receives `{ group: string, groupIndex: number, items: OptionItem[] }` |
| `item` | Custom render for an item. Receives the `OptionItem` fields plus `{ groupedIndex, group, groupIndex }` |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `scrollToItem` | `id: string, offset?: number` | Scroll the list to the item with the given id, including items not yet rendered by virtual scrolling. `offset` shifts the scroll position up by the given pixels (default: `0`) |
| `hasScroll` | - | Returns `boolean` — `true` if the list has a scrollbar |
