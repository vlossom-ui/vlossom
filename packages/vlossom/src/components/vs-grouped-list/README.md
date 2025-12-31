# VsGroupedList

props로 전달된 items를 group으로 묶어서 나열하는 컴포넌트입니다. 그룹핑 기능을 지원하며, 가상 렌더링을 통해 대량의 아이템을 효율적으로 표시할 수 있습니다.<br />
아이템 클릭 시 이벤트를 emit하며, 특정 아이템으로 스크롤하는 기능을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 아이템 리스트

```html
<template>
    <vs-grouped-list :items="items" @click-item="onClickItem" />
</template>

<script setup>
const items = [
    { id: 1, name: '아이템 1' },
    { id: 2, name: '아이템 2' },
    { id: 3, name: '아이템 3' },
];
function onClickItem(item) {
    console.log('Selected:', item);
}
</script>
```

### 그룹핑 사용

```html
<template>
    <vs-grouped-list
        :items="items"
        :group-by="(item) => item.category"
    />
</template>

<script setup>
const items = [
    { id: 1, name: '아이템 1', category: 'A' },
    { id: 2, name: '아이템 2', category: 'A' },
    { id: 3, name: '아이템 3', category: 'B' },
    { id: 4, name: '아이템 4', category: 'B' },
];
</script>
```

### 그룹 순서 지정

```html
<template>
    <vs-grouped-list
        :items="items"
        :group-by="(item) => item.category"
        :group-order="['C', 'A', 'B']"
    />
</template>

<script setup>
const items = [
    { id: 1, name: '아이템 1', category: 'A' },
    { id: 2, name: '아이템 2', category: 'B' },
    { id: 3, name: '아이템 3', category: 'C' },
];
</script>
```

### 커스텀 슬롯 사용

```html
<template>
    <vs-grouped-list :items="items">
        <template #header>
            <div>아이템 목록</div>
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
            <div>총 {{ items.length }}개</div>
        </template>
    </vs-grouped-list>
</template>

<script setup>
const items = [
    { id: 1, name: '아이템 1', category: 'A' },
    { id: 2, name: '아이템 2', category: 'A' },
    { id: 3, name: '아이템 3', category: 'B' },
];
</script>
```

### scrollToItem 메서드 사용

```html
<template>
    <vs-grouped-list ref="groupedListRef" :items="items" />
    <button @click="scrollToFirst">첫 번째 아이템으로 스크롤</button>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { VsGroupedListRef } from '@/components/vs-grouped-list/types';

const groupedListRef = useTemplateRef<VsGroupedListRef>('groupedListRef');
const items = [
    { id: 1, name: '아이템 1' },
    { id: 2, name: '아이템 2' },
    { id: 3, name: '아이템 3' },
];

function scrollToFirst() {
    groupedListRef.value?.scrollToItem(items[2]);
}
</script>
```

## Props

| Prop          | Type                                                     | Default | Required | Description                     |
| ------------- | -------------------------------------------------------- | ------- | -------- | ------------------------------- |
| `colorScheme` | `ColorScheme`                                            | -       | -        | 컴포넌트 색상 테마              |
| `styleSet`    | `string \| VsGroupedListStyleSet`                        | -       | -        | 커스텀 스타일 설정 객체         |
| `items`       | `OptionItem[]`                                           | `[]`    | -        | 아이템 배열 (OptionItem 형식)   |
| `groupBy`     | `(item: any, index: number) => string \| null` \| `null` | `null`  | -        | 아이템을 그룹으로 분류하는 함수 |
| `groupOrder`  | `string[]`                                               | `[]`    | -        | 그룹 표시 순서                  |

## Events

| Event        | Parameters                                                                                                                                        | Description         |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------- |
| `click-item` | `{ id: string, item: any, label: string, value: any, disabled: boolean, index: number, groupedIndex: number, group: string, groupIndex: number }` | 아이템 클릭 시 발생 |

## Methods

컴포넌트에 ref로 접근하여 사용할 수 있는 메서드들입니다.

| Method         | Parameters  | Return | Description                 |
| -------------- | ----------- | ------ | --------------------------- |
| `scrollToItem` | `item: any` | -      | 특정 아이템으로 스크롤 이동 |

### scrollToItem 메서드 동작

- `item` 파라미터로 전달된 아이템 객체를 `items`에서 찾습니다.
- 찾은 아이템의 DOM 요소로 스크롤합니다.
- 아이템을 찾지 못하거나 DOM 요소가 없으면 아무 동작도 하지 않습니다.

## Types

```typescript
interface VsGroupedListStyleSet {
    width?: string;
    height?: string;
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    padding?: string;
    opacity?: number;
    gap?: string;
    group?: {
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        padding?: string;
        opacity?: number;
    };
    item?: {
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        padding?: string;
        opacity?: number;
    };
}

interface VsGroupedListGroup {
    name: string;
    items: OptionItem[];
}

interface VsGroupedListRef extends ComponentPublicInstance<typeof VsGroupedList> {
    scrollToItem: (item: any) => void;
}
```

## Slots

| Slot     | Props                                                                      | Description               |
| -------- | -------------------------------------------------------------------------- | ------------------------- |
| `header` | -                                                                          | 아이템 리스트 상단에 표시 |
| `footer` | -                                                                          | 아이템 리스트 하단에 표시 |
| `group`  | `{ group: string, groupIndex: number, items: any[] }`                      | 그룹 헤더 커스텀 렌더링   |
| `item`   | `OptionItem & { groupedIndex: number, group: string, groupIndex: number }` | 아이템 커스텀 렌더링      |

## 특징

- **가상 렌더링**: vs-visible-render를 사용하여 대량의 아이템을 효율적으로 표시합니다.
- **그룹핑 지원**: groupBy 함수를 통해 아이템을 그룹으로 분류할 수 있습니다.
- **커스텀 슬롯**: header, footer, group, item 슬롯을 통해 UI를 커스터마이징할 수 있습니다.
- **스크롤 제어**: scrollToItem 메서드를 통해 특정 아이템으로 스크롤할 수 있습니다.
