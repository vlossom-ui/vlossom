# VsIndexView

현재 인덱스에 해당하는 자식 요소만 표시하는 컨테이너 컴포넌트로, keep-alive를 선택적으로 지원합니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- 현재 `v-model` 인덱스에 해당하는 자식 노드만 렌더링합니다.
- keep-alive를 통해 숨겨진 자식 컴포넌트의 상태를 보존할 수 있습니다.
- 반응형 `width` 및 `grid` 레이아웃을 위해 `vs-responsive`와 통합됩니다.
- `updateIndex`를 통해 프로그래밍 방식으로 표시 인덱스를 변경할 수 있습니다.
- 주석 노드와 빈 텍스트 노드를 자동으로 필터링합니다.

## Basic Usage

```html
<template>
    <vs-index-view v-model="currentIndex">
        <div>페이지 0</div>
        <div>페이지 1</div>
        <div>페이지 2</div>
    </vs-index-view>
</template>

<script setup>
import { ref } from 'vue';
const currentIndex = ref(0);
</script>
```

### Keep Alive

뷰 전환 시 컴포넌트 상태를 보존합니다.

```html
<template>
    <vs-index-view v-model="currentIndex" :keep-alive="true">
        <ComponentA />
        <ComponentB />
        <ComponentC />
    </vs-index-view>
</template>
```

### 반응형 Width

```html
<template>
    <vs-index-view v-model="currentIndex" width="50%">
        <div>뷰 A</div>
        <div>뷰 B</div>
    </vs-index-view>
</template>
```

## Props

| Prop         | Type                                     | Default | Required | Description                                               |
| ------------ | ---------------------------------------- | ------- | -------- | --------------------------------------------------------- |
| `modelValue` | `number`                                 | `0`     | -        | 현재 표시되는 자식의 인덱스 (v-model).                    |
| `keepAlive`  | `boolean`                                | `false` | -        | 자식을 `<KeepAlive>`로 감싸 상태를 보존합니다.             |
| `width`      | `string \| number \| Breakpoints`        | -       | -        | 컴포넌트 너비 (반응형 브레이크포인트 지원).                |
| `grid`       | `string \| number \| Breakpoints`        | -       | -        | 레이아웃의 그리드 열 span (반응형 브레이크포인트 지원).    |

## Types

```typescript
// StyleSet 인터페이스 없음 — 이 컴포넌트는 styleSet prop을 받지 않습니다.
```

## Events

| 이벤트              | 페이로드 | 설명                              |
| ------------------- | -------- | --------------------------------- |
| `update:modelValue` | `number` | 표시 인덱스가 변경될 때 발생합니다. |

## Slots

| 슬롯      | 설명                                         |
| --------- | -------------------------------------------- |
| `default` | 인덱스로 전환할 자식 요소들.                  |

## Methods

| 메서드        | 파라미터        | 설명                               |
| ------------- | --------------- | ---------------------------------- |
| `updateIndex` | `index: number` | 현재 인덱스를 프로그래밍 방식으로 설정합니다. |
