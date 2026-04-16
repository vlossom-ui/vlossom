> For English documentation, see [README.md](./README.md).

# VsSkeleton

콘텐츠가 로딩되는 동안 애니메이션 배경을 표시하는 스켈레톤 로딩 플레이스홀더 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 로딩 상태를 나타내는 애니메이션 깜빡임 배경
- 스켈레톤 위에 중앙 정렬되는 기본 슬롯 콘텐츠 지원
- `CSSProperties`를 통한 배경, 콘텐츠 영역, 루트 요소 커스터마이징 가능
- 일관된 테마를 위한 색상 스킴 지원

## 기본 사용법

```html
<template>
    <vs-skeleton style="width: 200px; height: 200px; border-radius: 50%;" />
</template>
```

### 콘텐츠 슬롯과 함께 사용

```html
<template>
    <vs-skeleton style="width: 100%; height: 4rem;">
        <span>로딩 중...</span>
    </vs-skeleton>
</template>
```

### 커스텀 크기 및 모양

```html
<template>
    <vs-skeleton
        :style-set="{
            component: { width: '150px', height: '150px', borderRadius: '50%' },
        }"
    />
</template>
```

## Props

| Prop          | Type                           | Default | Required | 설명                               |
| ------------- | ------------------------------ | ------- | -------- | ---------------------------------- |
| `colorScheme` | `string`                       | -       | -        | 컴포넌트의 색상 스킴               |
| `styleSet`    | `string \| VsSkeletonStyleSet`  | -       | -        | 컴포넌트에 적용할 커스텀 스타일 세트 |

## Types

```typescript
interface VsSkeletonStyleSet {
    background?: CSSProperties;
    content?: CSSProperties;
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-skeleton
        :style-set="{
            component: { width: '100%', height: '2rem', borderRadius: '0.5rem' },
            background: { backgroundColor: '#e0e0e0' },
            content: { color: '#999' },
        }"
    >
        로딩 중...
    </vs-skeleton>
</template>
```

## Events

| Event | Payload | 설명 |
| ----- | ------- | ---- |

## Slots

| Slot      | 설명                                             |
| --------- | ------------------------------------------------ |
| `default` | 스켈레톤 배경 위에 중앙 정렬되어 표시되는 콘텐츠 |

## Methods

| Method | Parameters | 설명 |
| ------ | ---------- | ---- |
