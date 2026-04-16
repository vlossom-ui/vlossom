> For English documentation, see [README.md](./README.md).

# VsChip

선택적 아이콘과 닫기 버튼을 갖춘 태그, 라벨, 또는 상태 표시를 위한 소형 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- `closable` prop으로 닫기 버튼 활성화 및 `close` 이벤트 발생
- 시각적 지시자를 위한 선행 아이콘 슬롯
- 다양한 시각적 변형: `primary`, `outline`
- 5가지 크기 옵션: `xs`, `sm` (기본값), `md`, `lg`, `xl`
- CSSProperties를 통한 아이콘 및 닫기 버튼 개별 스타일 제어

## Basic Usage

```html
<template>
    <vs-chip>라벨</vs-chip>
</template>
```

### 닫기 가능한 Chip

```html
<template>
    <vs-chip closable @close="removeChip">제거 가능</vs-chip>
</template>
```

### 아이콘과 함께 사용

```html
<template>
    <vs-chip>
        <template #icon>★</template>
        추천
    </vs-chip>
</template>
```

### Primary와 Outline

```html
<template>
    <vs-chip primary>Primary</vs-chip>
    <vs-chip outline>Outline</vs-chip>
</template>
```

### 크기

```html
<template>
    <vs-chip size="xs">XS</vs-chip>
    <vs-chip size="sm">SM</vs-chip>
    <vs-chip size="md">MD</vs-chip>
    <vs-chip size="lg">LG</vs-chip>
    <vs-chip size="xl">XL</vs-chip>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | 컴포넌트 색상 테마 |
| `styleSet` | `string \| VsChipStyleSet` | | | 커스텀 스타일 세트 |
| `closable` | `boolean` | `false` | | 닫기 버튼 표시 |
| `outline` | `boolean` | `false` | | 외곽선 스타일 적용 |
| `primary` | `boolean` | `false` | | Primary 색상 테마 적용 |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'sm'` | | Chip 크기 |

## Types

```typescript
interface VsChipStyleSet {
    variables?: {
        height?: string;
    };
    component?: CSSProperties;
    icon?: CSSProperties;
    closeButton?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-chip
        closable
        :style-set="{
            variables: {
                height: '2rem',
            },
            component: {
                borderRadius: '0.25rem',
                backgroundColor: '#e8f5e9',
                color: '#2e7d32',
            },
            icon: {
                color: '#2e7d32',
            },
            closeButton: {
                opacity: '0.7',
            },
        }"
    >
        <template #icon>✓</template>
        활성
    </vs-chip>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `close` | — | 닫기 버튼이 클릭될 때 발생 |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | Chip 라벨 콘텐츠 |
| `icon` | 라벨 앞에 표시되는 선행 아이콘 |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
