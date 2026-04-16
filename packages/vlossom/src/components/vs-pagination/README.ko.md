> For English documentation, see [README.md](./README.md).

# VsPagination

여러 페이지를 탐색할 수 있는 페이지네이션 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 현재 페이지 인덱스(0-based)를 v-model로 바인딩 지원
- `showingLength`로 표시할 페이지 버튼 수 설정 가능
- `edgeButtons`로 첫 페이지/마지막 페이지 이동 버튼 활성화 가능
- Ghost 및 Outline 버튼 스타일 옵션 지원
- `pageButton`과 `controlButton`으로 버튼 스타일 커스터마이징 가능
- 프로그래밍 방식 탐색 메서드: `goFirst`, `goLast`, `goPrev`, `goNext`, `setPage`

## 기본 사용법

```html
<template>
    <vs-pagination v-model="page" :length="10" />
</template>

<script setup>
import { ref } from 'vue';
const page = ref(0);
</script>
```

### Edge 버튼 사용

```html
<template>
    <vs-pagination v-model="page" :length="20" :showing-length="5" edge-buttons />
</template>
```

### Ghost 및 Outline 스타일 적용

```html
<template>
    <vs-pagination v-model="page" :length="10" ghost outline />
</template>
```

## Props

| Prop            | Type                            | Default | Required | 설명                                                   |
| --------------- | ------------------------------- | ------- | -------- | ------------------------------------------------------ |
| `colorScheme`   | `string`                        | -       | -        | 컴포넌트의 색상 스킴                                   |
| `styleSet`      | `string \| VsPaginationStyleSet` | -       | -        | 컴포넌트에 적용할 커스텀 스타일 세트                   |
| `disabled`      | `boolean`                       | `false` | -        | 모든 페이지네이션 버튼을 비활성화                      |
| `edgeButtons`   | `boolean`                       | `false` | -        | 첫 페이지 및 마지막 페이지 이동 버튼 표시              |
| `ghost`         | `boolean`                       | `false` | -        | 버튼에 ghost 스타일 적용                               |
| `length`        | `number`                        | `1`     | Yes      | 전체 페이지 수 (0보다 커야 함)                         |
| `outline`       | `boolean`                       | `false` | -        | 버튼에 outline 스타일 적용                             |
| `showingLength` | `number`                        | `10`    | -        | 한 번에 표시할 페이지 버튼 수                          |
| `modelValue`    | `number`                        | `0`     | -        | 현재 페이지 인덱스 (0-based), `v-model`과 함께 사용   |

## Types

```typescript
interface VsPaginationStyleSet {
    variables?: {
        selectedButtonBackgroundColor?: string;
        selectedButtonFontColor?: string;
    };
    component?: CSSProperties;
    pageButton?: Omit<VsButtonStyleSet, 'loading'>;
    controlButton?: Omit<VsButtonStyleSet, 'loading'>;
}
```

> [!NOTE]
> `pageButton`과 `controlButton`은 [VsButtonStyleSet](../vs-button/README.md#types)(`loading` 제외)을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-pagination
        v-model="page"
        :length="10"
        :style-set="{
            variables: {
                selectedButtonBackgroundColor: '#4f46e5',
                selectedButtonFontColor: '#ffffff',
            },
            component: { gap: '0.25rem' },
        }"
    />
</template>
```

## Events

| Event               | Payload  | 설명                               |
| ------------------- | -------- | ---------------------------------- |
| `update:modelValue` | `number` | 현재 페이지가 변경될 때 발생       |
| `change`            | `number` | 현재 페이지가 변경될 때 발생       |

## Slots

| Slot    | 설명                                             |
| ------- | ------------------------------------------------ |
| `first` | "첫 페이지" 버튼 커스텀 아이콘                  |
| `last`  | "마지막 페이지" 버튼 커스텀 아이콘              |
| `prev`  | "이전 페이지" 버튼 커스텀 아이콘                |
| `next`  | "다음 페이지" 버튼 커스텀 아이콘                |
| `page`  | 각 페이지 버튼 커스텀 콘텐츠; `{ page: number }` 수신 |

## Methods

| Method      | Parameters         | 설명                               |
| ----------- | ------------------ | ---------------------------------- |
| `goFirst`   | -                  | 첫 번째 페이지로 이동              |
| `goLast`    | -                  | 마지막 페이지로 이동               |
| `goPrev`    | -                  | 이전 페이지로 이동                 |
| `goNext`    | -                  | 다음 페이지로 이동                 |
| `setPage`   | `page: number`     | 지정한 페이지 인덱스로 이동        |
