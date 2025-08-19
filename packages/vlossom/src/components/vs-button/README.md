# VsButton

다양한 스타일과 상태를 지원하는 버튼 컴포넌트입니다. 로딩 상태, 크기 변형, 색상 테마 등을 제공하여 사용자 인터페이스의 일관성을 유지할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 버튼

```html
<template>
    <vs-button>기본 버튼</vs-button>
</template>
```

### 다양한 스타일의 버튼

```html
<template>
    <vs-button primary>Primary 버튼</vs-button>
    <vs-button outline>Outline 버튼</vs-button>
    <vs-button ghost>Ghost 버튼</vs-button>
    <vs-button circle>⭕</vs-button>
</template>
```

### 크기 변형

```html
<template>
    <vs-button small>Small 버튼</vs-button>
    <vs-button>기본 버튼</vs-button>
    <vs-button large>Large 버튼</vs-button>
</template>
```

### 로딩 상태

```html
<template>
    <vs-button loading>로딩 버튼</vs-button>
</template>
```

### 비활성화 상태

```html
<template>
    <vs-button disabled>비활성화된 버튼</vs-button>
</template>
```

## Props

| Prop          | Type                              | Default    | Required | Description                             |
| ------------- | --------------------------------- | ---------- | -------- | --------------------------------------- |
| `colorScheme` | `string`                          | -          | -        | 버튼의 색상 테마                        |
| `styleSet`    | `string \| VsButtonStyleSet`      | -          | -        | 커스텀 스타일 설정 객체                 |
| `circle`      | `boolean`                         | `false`    | -        | 원형 버튼 스타일 적용                   |
| `disabled`    | `boolean`                         | `false`    | -        | 버튼 비활성화                           |
| `ghost`       | `boolean`                         | `false`    | -        | 투명 배경의 고스트 스타일 적용          |
| `large`       | `boolean`                         | `false`    | -        | 큰 크기 버튼                            |
| `loading`     | `boolean`                         | `false`    | -        | 로딩 상태 표시                          |
| `outline`     | `boolean`                         | `false`    | -        | 아웃라인 스타일 적용                    |
| `primary`     | `boolean`                         | `false`    | -        | 주요 액션을 위한 프라이머리 스타일 적용 |
| `responsive`  | `boolean`                         | `false`    | -        | 반응형 스타일 적용                      |
| `small`       | `boolean`                         | `false`    | -        | 작은 크기 버튼                          |
| `type`        | `'button' \| 'submit' \| 'reset'` | `'button'` | -        | HTML button 요소의 type 속성            |

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
    loading?: VsLoadingStyleSet;
}
```

## Slots

| Slot      | Description               |
| --------- | ------------------------- |
| `default` | 버튼 내부에 표시할 콘텐츠 |

## 특징

- **다양한 스타일 지원**: `primary`, `outline`, `ghost`, `circle` 등 다양한 스타일 옵션 제공
- **크기 변형**: `small`, `large` 속성을 통한 크기 조절
- **로딩 상태**: `loading` 속성으로 로딩 스피너 표시
