# VsButton

버튼 역할을 하는 컴포넌트입니다.

**Available Version**: 2.0.0+

## 기본 사용법

<!-- 컴포넌트 이미지 -->

```vue
<template>
    <vs-button > 클릭하세요 </vs-button>
</template>
```

## Props

| Prop          | Type                         | Default  | Description                |
| ------------- | ---------------------------- | -------- | -------------------------- |
| `disabled`    | `boolean`                    | `false`  | 비활성화 상태              |
| `colorScheme` | `ColorScheme`                | -        | 색상 스키마 설정           |
| `styleSet`    | `string \| VsButtonStyleSet` | -        | 스타일 커스터마이징        |
| `dense`       | `boolean`                    | `false`  | 조밀한 크기                |
| `large`       | `boolean`                    | `false`  | 큰 크기                    |
| `primary`     | `boolean`                    | `false`  | 주요 버튼 스타일           |
| `outline`     | `boolean`                    | `false`  | 아웃라인 스타일            |
| `circle`      | `boolean`                    | `false`  | 원형 버튼                  |
| `loading`     | `boolean`                    | `false`  | 로딩 상태                  |
| `responsive`  | `boolean`                    | `false`  | 화면 너비에 따라 크기 변경 |
| `state`       | `UIState`                    | `'idle'` | 컴포넌트 상태              |

## Types

```typescript
interface VsButtonStyleSet {
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    height?: string;
    padding?: string;
    width?: string;
    circleSize?: string;
}
```
