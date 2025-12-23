# VsOptions

옵션 리스트를 표시하는 컴포넌트입니다. 그룹핑 기능을 지원하며, 가상 렌더링을 통해 대량의 옵션을 효율적으로 표시할 수 있습니다.<br />
옵션 클릭 시 이벤트를 emit하며, 특정 옵션으로 스크롤하는 기능을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 옵션 리스트

```html
<template>
    <vs-options :options="options"  @click-option="onClickOption" />
</template>

<script setup>
const options = [
    { id: 1, name: '옵션 1' },
    { id: 2, name: '옵션 2' },
    { id: 3, name: '옵션 3' },
];
function onClickOption(option) {
    console.log('Selected:', option);
}
</script>
```

### optionLabel과 optionValue 사용

```html
<template>
    <vs-options
        :options="options"
        option-label="text"
        option-value="id"
    />
</template>

<script setup>
const options = [
    { id: 1, text: '옵션 1' },
    { id: 2, text: '옵션 2' },
    { id: 3, text: '옵션 3' },
];
</script>
```

### 문자열 배열 사용

```html
<template>
    <vs-options :options="options" />
</template>

<script setup>
const options = ['옵션 1', '옵션 2', '옵션 3'];
</script>
```

### 그룹핑 사용

```html
<template>
    <vs-options
        :options="options"
        :group-by="(option) => option.category"
    />
</template>

<script setup>
const options = [
    { id: 1, name: '옵션 1', category: 'A' },
    { id: 2, name: '옵션 2', category: 'A' },
    { id: 3, name: '옵션 3', category: 'B' },
    { id: 4, name: '옵션 4', category: 'B' },
];
</script>
```

### 그룹 순서 지정

```html
<template>
    <vs-options
        :options="options"
        :group-by="(option) => option.category"
        :group-order="['C', 'A', 'B']"
    />
</template>

<script setup>
const options = [
    { id: 1, name: '옵션 1', category: 'A' },
    { id: 2, name: '옵션 2', category: 'B' },
    { id: 3, name: '옵션 3', category: 'C' },
];
</script>
```

### 비활성화 옵션

```html
<template>
    <!-- 모든 옵션 비활성화 -->
    <vs-options :options="options" disabled />

    <!-- 특정 옵션만 비활성화 -->
    <vs-options
        :options="options"
        :disabled="(option) => option.id === 2"
    />
</template>

<script setup>
const options = [
    { id: 1, name: '옵션 1' },
    { id: 2, name: '옵션 2' },
    { id: 3, name: '옵션 3' },
];
</script>
```

### 커스텀 슬롯 사용

```html
<template>
    <vs-options :options="options">
        <template #header>
            <div>옵션 목록</div>
        </template>

        <template #group="{ group, groupIndex }">
            <div class="custom-group">
                <strong>{{ group.name || 'Ungrouped' }}</strong>
            </div>
        </template>

        <template #option="{ item, label, value, index, group, groupIndex }">
            <div class="custom-option">
                <span>{{ label }}</span>
                <span class="value">{{ value }}</span>
            </div>
        </template>

        <template #footer>
            <div>총 {{ options.length }}개</div>
        </template>
    </vs-options>
</template>

<script setup>
const options = [
    { id: 1, name: '옵션 1', category: 'A' },
    { id: 2, name: '옵션 2', category: 'A' },
    { id: 3, name: '옵션 3', category: 'B' },
];
</script>
```

### scrollToOption 메서드 사용

```html
<template>
    <vs-options ref="optionsRef" :options="options" />
    <button @click="scrollToFirst">첫 번째 옵션으로 스크롤</button>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { VsOptionsRef } from '@/components/vs-options/types';

const optionsRef = useTemplateRef<VsOptionsRef>('optionsRef');
const options = [
    { id: 1, name: '옵션 1' },
    { id: 2, name: '옵션 2' },
    { id: 3, name: '옵션 3' },
];

function scrollToFirst() {
    optionsRef.value?.scrollToOption(options[2]);
}
</script>
```

## Props

| Prop          | Type                                                                   | Default | Required | Description                             |
| ------------- | ---------------------------------------------------------------------- | ------- | -------- | --------------------------------------- |
| `colorScheme` | `ColorScheme`                                                          | -       | -        | 컴포넌트 색상 테마                      |
| `styleSet`    | `string \| VsOptionsStyleSet`                                          | -       | -        | 커스텀 스타일 설정 객체                 |
| `options`     | `any[]`                                                                | `[]`    | -        | 옵션 배열                               |
| `optionLabel` | `string`                                                               | `''`    | -        | 옵션에서 라벨을 추출할 속성명 또는 함수 |
| `optionValue` | `string`                                                               | `''`    | -        | 옵션에서 값을 추출할 속성명 또는 함수   |
| `groupBy`     | `(option: any, index: number) => string \| null` \| `null`             | `null`  | -        | 옵션을 그룹으로 분류하는 함수           |
| `groupOrder`  | `string[]`                                                             | `[]`    | -        | 그룹 표시 순서                          |
| `disabled`    | `boolean \| ((option: any, index: number, options: any[]) => boolean)` | `false` | -        | 옵션 비활성화 여부 (boolean 또는 함수)  |

## Events

| Event          | Parameters                                                                                                                                        | Description       |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| `click-option` | `{ id: string, item: any, label: string, value: any, disabled: boolean, index: number, groupedIndex: number, group: string, groupIndex: number }` | 옵션 클릭 시 발생 |

## Methods

컴포넌트에 ref로 접근하여 사용할 수 있는 메서드들입니다.

| Method           | Parameters    | Return | Description               |
| ---------------- | ------------- | ------ | ------------------------- |
| `scrollToOption` | `option: any` | -      | 특정 옵션으로 스크롤 이동 |

### scrollToOption 메서드 동작

- `option` 파라미터로 전달된 옵션 객체를 `computedOptions`에서 찾습니다.
- 찾은 옵션의 DOM 요소로 스크롤합니다.
- 옵션을 찾지 못하거나 DOM 요소가 없으면 아무 동작도 하지 않습니다.

## Types

```typescript
interface VsOptionsStyleSet {
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
    option?: {
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        padding?: string;
        opacity?: number;
    };
}

interface VsOptionsItem {
    id: string;
    item: any;
    label: string;
    value: any;
    disabled: boolean;
}

interface VsOptionsGroup {
    name: string;
    options: VsOptionsItem[];
}

interface VsOptionsRef extends ComponentPublicInstance<typeof VsOptions> {
    scrollToOption: (option: any) => void;
}
```

## Slots

| Slot     | Props                                                                                                                                             | Description               |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------- |
| `header` | -                                                                                                                                                 | 옵션 리스트 상단에 표시   |
| `footer` | -                                                                                                                                                 | 옵션 리스트 하단에 표시   |
| `group`  | `{ group: string, groupIndex: number, options: any[] }`                                                                                           | 그룹 헤더 커스텀 렌더링   |
| `option` | `{ id: string, item: any, label: string, value: any, disabled: boolean, index: number, groupedIndex: number, group: string, groupIndex: number }` | 옵션 아이템 커스텀 렌더링 |

## 특징

- **가상 렌더링**: vs-visible-render를 사용하여 대량의 옵션을 효율적으로 표시합니다.
- **그룹핑 지원**: groupBy 함수를 통해 옵션을 그룹으로 분류할 수 있습니다.
- **개별 비활성화**: disabled를 함수로 지정하여 각 옵션을 개별적으로 비활성화할 수 있습니다.
- **커스텀 슬롯**: header, footer, group, option 슬롯을 통해 UI를 커스터마이징할 수 있습니다.
- **스크롤 제어**: scrollToOption 메서드를 통해 특정 옵션으로 스크롤할 수 있습니다.
