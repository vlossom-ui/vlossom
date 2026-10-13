> For English documentation, see [README.md](./README.md).

# useGroupedItems

**Available Version**: 2.2.0+

정규화된 옵션 목록을 `groupBy` 함수로 그룹화하고, 선택적인 `groupOrder`로 그룹 순서를 정합니다.

## 기능

- `groupBy`가 없으면 모든 항목을 담은 이름 없는 그룹 하나를 반환합니다
- `groupOrder`에 있는 그룹을 먼저, 나머지는 `items`에 처음 등장한 순서대로 배치합니다
- 그룹 이름이 비어 있는(`''`, `null`, `undefined`) 항목은 이름 없는 그룹으로 모아 맨 마지막에 둡니다
- `items`, `groupBy`, `groupOrder`가 바뀌면 반응형으로 다시 계산합니다

## 기본 사용법

```html
<template>
    <div v-for="group in groupedItems" :key="group.name">
        <strong>{{ group.name || '기타' }}</strong>
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

| 인자         | 타입                                                    | 기본값 | 필수 | 설명                                                                    |
| ------------ | ------------------------------------------------------- | ------ | ---- | ----------------------------------------------------------------------- |
| `items`      | `Ref<OptionItem[]>`                                     | —      | Yes  | 정규화된 옵션 목록. 예: `useOptionList`의 `computedOptions`.            |
| `groupBy`    | `Ref<((item: any, index: number) => string \| null) \| null>` | — | Yes  | 각 항목의 그룹 이름을 반환합니다. 원본 옵션(`item.item`)을 전달받습니다. |
| `groupOrder` | `Ref<string[]>`                                         | —      | Yes  | 먼저 배치할 그룹 이름 순서.                                             |

## Types

```typescript
interface GroupedItem {
    name: string; // 이름 없는 그룹은 ''
    items: OptionItem[];
}
```

## Return Refs

| RefType        | 타입                         | 설명                         |
| -------------- | ---------------------------- | ---------------------------- |
| `groupedItems` | `ComputedRef<GroupedItem[]>` | 순서가 정해진 그룹과 항목들. |

## Return Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |

## Hooks

| Hook | 설명 |
| ---- | ---- |

## Cautions

- 항목이 없는 그룹은 `groupOrder`에 있어도 포함되지 않습니다.
