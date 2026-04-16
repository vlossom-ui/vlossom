# VsLoading

웨이브 애니메이션을 적용한 5개의 수직 바로 구성된 애니메이션 로딩 인디케이터입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- 순차적인 웨이브 효과를 적용한 5개의 애니메이션 바를 표시합니다.
- `variables.color` 스타일 속성으로 색상을 커스터마이징할 수 있습니다.
- `variables.barWidth` 스타일 속성으로 바 너비를 커스터마이징할 수 있습니다.
- 크기 조정을 위한 `width` 및 `height` props를 지원합니다.
- 일관된 테마를 위한 색상 스킴을 지원합니다.

## Basic Usage

```html
<template>
    <vs-loading />
</template>
```

### 커스텀 크기

```html
<template>
    <vs-loading width="4rem" height="5rem" />
</template>
```

### 색상 스킴

```html
<template>
    <vs-loading color-scheme="green" />
</template>
```

## Props

| Prop          | Type                          | Default | Required | Description                          |
| ------------- | ----------------------------- | ------- | -------- | ------------------------------------ |
| `colorScheme` | `string`                      | -       | -        | 로딩 바의 색상 스킴.                 |
| `styleSet`    | `string \| VsLoadingStyleSet` | -       | -        | 컴포넌트의 커스텀 스타일 셋.         |
| `width`       | `string \| number`            | -       | -        | 로딩 컨테이너의 너비.                |
| `height`      | `string \| number`            | -       | -        | 로딩 컨테이너의 높이.                |

## Types

```typescript
interface VsLoadingStyleSet {
    variables?: {
        barWidth?: string;
        color?: string;
    };
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-loading
        :style-set="{
            variables: {
                color: '#ff6b6b',
                barWidth: '15%',
            },
            component: { width: '6rem', height: '8rem' },
        }"
    />
</template>
```

## Events

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## Slots

| 슬롯 | 설명 |
| ---- | ---- |

## Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
