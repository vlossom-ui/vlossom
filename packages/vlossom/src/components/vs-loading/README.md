# VsLoading

로딩 상태를 나타내는 인라인 애니메이션 컴포넌트입니다.

**Available Version**: 2.0.0+

## 기본 사용법

```vue
<template>
    <vs-loading />
    <vs-loading width="100px" height="50px" />
    <vs-loading :width="200" :height="100" />
</template>
```

## Props

| Prop          | Type                          | Default | Required | Description                       |
| ------------- | ----------------------------- | ------- | -------- | --------------------------------- |
| `colorScheme` | `ColorScheme`                 | -       | -        | 색상 스키마 설정                  |
| `styleSet`    | `string \| VsLoadingStyleSet` | -       | -        | 스타일 커스터마이징               |
| `width`       | `string \| number`            | -       | -        | 로딩 컴포넌트의 너비 (기본 8rem)  |
| `height`      | `string \| number`            | -       | -        | 로딩 컴포넌트의 높이 (기본 10rem) |

## Types

```typescript
interface VsLoadingStyleSet {
    color?: string; // 로딩 바의 색상
    width?: string; // 로딩 컴포넌트의 전체 너비
    height?: string; // 로딩 컴포넌트의 전체 높이
    barWidth?: string; // 개별 로딩 바의 너비
}
```
