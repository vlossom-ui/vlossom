> 한국어 문서는 [README.ko.md](./README.ko.md)를 참고하세요.

# useGroupedItems

**Available Version**: 2.2.0+

Groups a normalized option list by a `groupBy` function and orders the groups with an optional `groupOrder`.

## Feature

- Returns a single unnamed group containing every item when `groupBy` is not set
- Orders groups by `groupOrder` first, then by first appearance in `items`
- Collects items whose group name is empty (`''`, `null`, `undefined`) into an unnamed group placed last
- Recomputes reactively when `items`, `groupBy`, or `groupOrder` changes

## Basic Usage

```html
<template>
    <div v-for="group in groupedItems" :key="group.name">
        <strong>{{ group.name || 'Others' }}</strong>
        <div v-for="item in group.items" :key="item.id">{{ item.label }}</div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useOptionList, useGroupedItems } from '@/composables';

const options = ref([
    { name: 'Apple', category: 'Fruits' },
    { name: 'Carrot', category: 'Vegetables' },
    { name: 'Banana', category: 'Fruits' },
]);
const { computedOptions } = useOptionList(options, ref('name'), ref(''), ref(false));

const groupBy = ref((option) => option.category);
const groupOrder = ref(['Vegetables']);
const { groupedItems } = useGroupedItems(computedOptions, groupBy, groupOrder);
// [{ name: 'Vegetables', items: [Carrot] }, { name: 'Fruits', items: [Apple, Banana] }]
</script>
```

## Args

| Arg          | Type                                                    | Default | Required | Description                                                                 |
| ------------ | ------------------------------------------------------- | ------- | -------- | --------------------------------------------------------------------------- |
| `items`      | `Ref<OptionItem[]>`                                     | —       | Yes      | Normalized option list, e.g. `computedOptions` from `useOptionList`.        |
| `groupBy`    | `Ref<((item: any, index: number) => string \| null) \| null>` | — | Yes      | Returns the group name of each item. Receives the original option (`item.item`). |
| `groupOrder` | `Ref<string[]>`                                         | —       | Yes      | Group names to place first, in order.                                       |

## Types

```typescript
interface GroupedItem {
    name: string; // '' for the unnamed group
    items: OptionItem[];
}
```

## Return Refs

| RefType        | Type                         | Description                     |
| -------------- | ---------------------------- | ------------------------------- |
| `groupedItems` | `ComputedRef<GroupedItem[]>` | Ordered groups and their items. |

## Return Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |

## Hooks

| Hook | Description |
| ---- | ----------- |

## Cautions

- Groups with no items are not included, even if they are listed in `groupOrder`.
