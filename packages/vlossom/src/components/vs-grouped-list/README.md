> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# VsGroupedList

A scrollable list component that renders items with optional grouping, virtual visibility rendering for performance, and full slot customization.

**Available Version**: 2.0.0+

## Feature

- Renders a flat or grouped list from an `items` array of `OptionItem`
- Optional grouping via the `groupBy` function and `groupOrder` array
- Virtualized visibility rendering via `VsVisibleRender` for large lists
- Scrollable via the embedded `VsInnerScroll` component
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
        :style-set="{ variables: { height: '300px' } }"
        @click-item="handleClick"
    />
</template>
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
interface VsGroupedListStyleSet {
    variables?: {
        gap?: string;
        height?: string;
    };
    header?: CSSProperties;
    content?: CSSProperties;
    footer?: CSSProperties;
    group?: CSSProperties;
    item?: CSSProperties;
}
```

### StyleSet Example

```html
<template>
    <vs-grouped-list
        :items="items"
        :style-set="{
            variables: { height: '400px', gap: '4px' },
            group: { backgroundColor: '#f0f0f0', fontWeight: 'bold', padding: '0.5rem 1rem' },
            item: { padding: '0.4rem 1.2rem' },
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
| `group` | Custom render for a group header. Receives `{ group: string, groupIndex: number, items: OptionItem[] }` |
| `item` | Custom render for an item. Receives the `OptionItem` fields plus `{ groupedIndex, group, groupIndex }` |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `scrollToItem` | `id: string` | Scroll the list to the item with the given id |
| `hasScroll` | - | Returns `boolean` — `true` if the list has a scrollbar |
