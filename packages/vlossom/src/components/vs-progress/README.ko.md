> For English documentation, see [README.md](./README.md).

# VsProgress

작업의 완료 상태를 표시하는 프로그레스 바 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 접근성을 위해 네이티브 HTML `<progress>` 요소 사용
- 유연한 진행률 표현을 위한 `value` 및 `max` prop 지원
- 프로그레스 바 위에 표시되는 선택적 `label` 텍스트 지원
- 일관된 테마를 위한 색상 스킴 지원
- `variables`를 통해 바, 값 표시기, 레이블 스타일 커스터마이징 가능

## 기본 사용법

```html
<template>
    <vs-progress :value="50" :max="100" />
</template>
```

### 레이블과 함께 사용

```html
<template>
    <vs-progress :value="75" :max="100" label="75%" />
</template>
```

### 색상 스킴 적용

```html
<template>
    <vs-progress :value="30" :max="100" color-scheme="blue" />
</template>
```

## Props

| Prop          | Type                          | Default | Required | 설명                                                |
| ------------- | ----------------------------- | ------- | -------- | --------------------------------------------------- |
| `colorScheme` | `string`                      | -       | -        | 컴포넌트의 색상 스킴                                |
| `styleSet`    | `string \| VsProgressStyleSet` | -       | -        | 컴포넌트에 적용할 커스텀 스타일 세트                |
| `max`         | `number \| string`            | `1`     | -        | 프로그레스 바의 최대값 (0보다 커야 함)              |
| `value`       | `number \| string`            | `0`     | -        | 프로그레스 바의 현재 값 (0 이상이어야 함)           |
| `label`       | `string`                      | `''`    | -        | 프로그레스 바 위에 표시되는 텍스트 레이블           |

## Types

```typescript
interface VsProgressStyleSet {
    variables?: {
        bar?: {
            backgroundColor?: string;
            border?: string;
            borderRadius?: string;
        };
        value?: {
            backgroundColor?: string;
        };
        label?: {
            textShadow?: string;
            fontColor?: string;
        };
    };
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-progress
        :value="60"
        :max="100"
        label="60%"
        :style-set="{
            variables: {
                bar: { backgroundColor: '#e5e7eb', borderRadius: '0.5rem' },
                value: { backgroundColor: '#6366f1' },
                label: { fontColor: '#ffffff' },
            },
            component: { height: '1.5rem' },
        }"
    />
</template>
```

## Events

| Event | Payload | 설명 |
| ----- | ------- | ---- |

## Slots

| Slot | 설명 |
| ---- | ---- |

## Methods

| Method | Parameters | 설명 |
| ------ | ---------- | ---- |
