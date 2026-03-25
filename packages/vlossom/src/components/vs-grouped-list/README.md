> 한국어: [README.ko.md](./README.ko.md)

# VsGroupedList

A component that lists items organized by groups. Supports grouping and uses virtual rendering to efficiently display large numbers of items.

> **Note**: The `items` prop must be in `OptionItem[]` format. Use the `useOptionList` composable to transform raw data into `OptionItem[]`.

**Available Version**: 2.0.0+

GitHub Wiki Link: <!-- GitHub wiki link -->

## Preview

<!-- Component image -->

## Basic Usage

### Default Item List

```html
<template>
    <vs-grouped-list :items="items" @click-item="onClickItem" />
</template>

<script setup>
import { ref } from 'vue';
const items = ref([
    { id: 'vs-1', item: { id: 1, name: 'Item 1' }, label: 'Item 1', value: 1, index: 0, disabled: false },
    { id: 'vs-2', item: { id: 2, name: 'Item 2' }, label: 'Item 2', value: 2, index: 1, disabled: false },
    { id: 'vs-3', item: { id: 3, name: 'Item 3' }, label: 'Item 3', value: 3, index: 2, disabled: false },
]);

function onClickItem(item) {
    console.log('Selected:', item);
}
</script>
```

### Grouping

```html
<template>
    <vs-grouped-list
        :items="items"
        :group-by="(item) => item.category"
    />
</template>
```

### Group Order

```html
<template>
    <vs-grouped-list
        :items="items"
        :group-by="(item) => item.category"
        :group-order="['C', 'A', 'B']"
    />
</template>
```

### Custom Slots

```html
<template>
    <vs-grouped-list :items="items">
        <template #header>
            <div>Item List</div>
        </template>

        <template #group="{ group, groupIndex }">
            <div class="custom-group">
                <strong>{{ group.name || 'Ungrouped' }}</strong>
            </div>
        </template>

        <template #item="{ item, label, value, index, group, groupIndex }">
            <div class="custom-item">
                <span>{{ label }}</span>
                <span class="value">{{ value }}</span>
            </div>
        </template>

        <template #footer>
            <div>Total: {{ items.length }}</div>
        </template>
    </vs-grouped-list>
</template>
```

### Using scrollToItem

```html
<template>
    <vs-grouped-list ref="groupedListRef" :items="items" />
    <button @click="scrollToFirst">Scroll to first item</button>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { VsGroupedListRef } from '@/components/vs-grouped-list/types';

const groupedListRef = useTemplateRef<VsGroupedListRef>('groupedListRef');
const items = ref([
    { id: 'vs-1', item: { id: 1, name: 'Item 1' }, label: 'Item 1', value: 1, index: 0, disabled: false },
]);

function scrollToFirst() {
    groupedListRef.value?.scrollToItem(items.value[0].id);
}
</script>
```

## Props

| Prop          | Type                                                      | Default | Required | Description                            |
| ------------- | --------------------------------------------------------- | ------- | -------- | -------------------------------------- |
| `colorScheme` | `ColorScheme`                                             | -       | -        | Color scheme for the component         |
| `styleSet`    | `string \| VsGroupedListStyleSet`                         | -       | -        | Custom style configuration object      |
| `items`       | `OptionItem[]`                                            | `[]`    | -        | Item array (OptionItem format)          |
| `groupBy`     | `(item: any, index: number) => string \| null` \| `null`  | `null`  | -        | Function to classify items into groups |
| `groupOrder`  | `string[]`                                                | `[]`    | -        | Specify display order of groups        |

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

## Events

| Event        | Payload                                                                          | Description               |
| ------------ | -------------------------------------------------------------------------------- | ------------------------- |
| `click-item` | `{ id, item, label, value, disabled, index, groupedIndex, group, groupIndex }` | Emitted when an item is clicked |

## Slots

| Slot     | Props                                                                      | Description                   |
| -------- | -------------------------------------------------------------------------- | ----------------------------- |
| `header` | -                                                                          | Displayed above the item list |
| `footer` | -                                                                          | Displayed below the item list |
| `group`  | `{ group: string, groupIndex: number, items: any[] }`                      | Custom group header rendering |
| `item`   | `OptionItem & { groupedIndex: number, group: string, groupIndex: number }` | Custom item rendering         |

## Methods

| Method         | Parameters   | Return    | Description                                  |
| -------------- | ------------ | --------- | -------------------------------------------- |
| `scrollToItem` | `id: string` | -         | Scroll to the item with the given id         |
| `hasScroll`    | -            | `boolean` | Returns whether the list is scrollable       |

## Features

- **Virtual rendering**: Uses vs-visible-render to efficiently display large numbers of items
- **Grouping support**: Classify items into groups via the `groupBy` function
- **Custom slots**: Customize the UI via `header`, `footer`, `group`, and `item` slots
- **Scroll control**: Scroll to a specific item via the `scrollToItem` method
