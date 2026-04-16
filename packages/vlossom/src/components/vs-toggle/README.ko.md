> For English documentation, see [README.md](./README.md).

# VsToggle

`VsButton`을 래핑하여 활성/비활성 상태를 토글하는 상태 저장 버튼 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 토글 상태를 위한 Boolean v-model 바인딩
- 모든 상태 변경 시 `toggle` 이벤트 발생
- 모든 `VsButton` props 상속 (size, ghost, outline, primary, circle, loading 등)
- 노출된 `toggle` 메서드를 통한 프로그래밍 방식 토글
- 완전한 색상 스키마 지원

## 기본 사용법

```html
<template>
    <vs-toggle v-model="isActive">
        토글
    </vs-toggle>
</template>

<script setup>
import { ref } from 'vue';
const isActive = ref(false);
</script>
```

### 다양한 변형

```html
<template>
    <vs-toggle v-model="a" primary>Primary</vs-toggle>
    <vs-toggle v-model="b" outline>Outline</vs-toggle>
    <vs-toggle v-model="c" ghost>Ghost</vs-toggle>
    <vs-toggle v-model="d" circle>⭐</vs-toggle>
</template>
```

### 비활성화 상태

```html
<template>
    <vs-toggle v-model="isActive" disabled>비활성화</vs-toggle>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트 색상 스키마 |
| `styleSet` | `string \| VsToggleStyleSet` | | | 컴포넌트 커스텀 스타일 세트 |
| `circle` | `boolean` | `false` | | 버튼을 원형으로 렌더링 |
| `disabled` | `boolean` | `false` | | 토글 비활성화 |
| `ghost` | `boolean` | `false` | | 고스트(투명) 스타일 적용 |
| `loading` | `boolean` | `false` | | 로딩 인디케이터 표시 |
| `modelValue` | `boolean` | `false` | | 토글 상태의 v-model |
| `outline` | `boolean` | `false` | | 아웃라인 스타일 적용 |
| `primary` | `boolean` | `false` | | Primary 색상 스타일 적용 |
| `responsive` | `boolean` | `false` | | 버튼을 반응형으로 설정 |
| `size` | `Size` | `'md'` | | 버튼 크기 (`xs`, `sm`, `md`, `lg`, `xl`) |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | | HTML 버튼 타입 |

## 타입

```typescript
interface VsToggleStyleSet extends VsButtonStyleSet {}
```

> [!NOTE]
> `VsToggleStyleSet`은 [`VsButtonStyleSet`](../vs-button/README.ko.md)을 상속합니다. `VsButtonStyleSet`의 모든 속성을 사용할 수 있습니다.

```typescript
interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
```

### StyleSet 예시

```html
<template>
    <vs-toggle
        v-model="isActive"
        :style-set="{
            component: { borderRadius: '0.25rem', minWidth: '6rem' },
            variables: { padding: '0.5rem 1.5rem' },
        }"
    >
        토글
    </vs-toggle>
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `update:modelValue` | `boolean` | 토글 상태 변경 시 발생 |
| `toggle` | `boolean` | 모든 토글 시 새로운 상태와 함께 발생 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 버튼 내용 |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
| `toggle` | | 상태를 프로그래밍 방식으로 토글 |
