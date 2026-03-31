> For English documentation, see [README.md](./README.md).

# VsTabs

애니메이션 인디케이터, 스크롤 버튼, 세로 레이아웃을 지원하는 탭 내비게이션 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 선택된 탭을 추적하는 애니메이션 활성 탭 인디케이터
- 탭 목록 오버플로우 시 자동 또는 수동 스크롤 버튼
- 세로 탭 레이아웃 지원
- 탭 간 키보드 내비게이션
- Dense 및 Primary 시각적 변형
- 반응형 너비 및 그리드 레이아웃 지원

## 기본 사용법

```html
<template>
    <vs-tabs v-model="activeTab" :tabs="tabs" />
</template>

<script setup>
import { ref } from 'vue';
const activeTab = ref(0);
const tabs = ['탭 1', '탭 2', '탭 3'];
</script>
```

### 커스텀 탭 내용

```html
<template>
    <vs-tabs v-model="activeTab" :tabs="tabs">
        <template #tab="{ tab, index }">
            <span>{{ index + 1 }}. {{ tab }}</span>
        </template>
    </vs-tabs>
</template>
```

### 세로 탭

```html
<template>
    <vs-tabs v-model="activeTab" :tabs="tabs" vertical />
</template>
```

### 비활성화된 탭

```html
<template>
    <vs-tabs v-model="activeTab" :tabs="tabs" :disabled="(tab) => tab === '탭 2'" />
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트 색상 스키마 |
| `styleSet` | `string \| VsTabsStyleSet` | | | 컴포넌트 커스텀 스타일 세트 |
| `dense` | `boolean` | `false` | | 탭 높이 축소 |
| `disabled` | `boolean \| (tab: string, index: number) => boolean` | `false` | | 전체 또는 특정 탭 비활성화 |
| `grid` | `string \| number \| Breakpoints` | | | 그리드 열 스팬 |
| `height` | `string \| number` | `'auto'` | | 탭 바의 높이 |
| `modelValue` | `number` | `0` | | 활성 탭의 인덱스, v-model |
| `primary` | `boolean` | `false` | | Primary 색상 스타일 적용 |
| `scrollButtons` | `'hide' \| 'show' \| 'auto'` | `'auto'` | | 스크롤 버튼 표시 여부 |
| `tabs` | `string[]` | `[]` | | 탭 레이블 목록 |
| `vertical` | `boolean` | `false` | | 세로 방향으로 탭 렌더링 |
| `width` | `string \| number \| Breakpoints` | | | 컴포넌트 너비 |

## 타입

```typescript
interface VsTabsStyleSet {
    variables?: {
        gap?: string;
        divider?: CSSProperties['border'] & {};
    };
    tab?: CSSProperties;
    activeTab?: CSSProperties;
    scrollButton?: Omit<VsButtonStyleSet, 'loading'>;
}
```

> [!NOTE]
> `scrollButton`은 [`VsButtonStyleSet`](../vs-button/README.ko.md)을 사용합니다(`loading` 제외).

### StyleSet 예시

```html
<template>
    <vs-tabs
        v-model="activeTab"
        :tabs="tabs"
        :style-set="{
            variables: { gap: '0.5rem', divider: '2px solid #e0e0e0' },
            tab: { borderRadius: '0.25rem', padding: '0.5rem 1.25rem' },
            activeTab: { backgroundColor: '#1976d2', color: '#ffffff' },
        }"
    />
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `update:modelValue` | `number` | 활성 탭 인덱스 변경 시 발생 |
| `change` | `number` | 선택된 탭 변경 시 발생 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `tab` | 커스텀 탭 아이템 내용. `{ tab: string, index: number }` 수신 |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
| `goPrev` | | 이전 탭으로 이동 |
| `goNext` | | 다음 탭으로 이동 |
