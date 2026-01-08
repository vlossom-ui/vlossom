# VsMessage

다양한 상태와 메시지를 표시하는 메시지 컴포넌트입니다.
info, success, warning, error 상태를 지원하며, 각 상태에 맞는 아이콘과 색상을 자동으로 적용합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 상태별 메시지

```html
<template>
    <vs-message text="기본 메시지입니다." />
    <vs-message state="info" text="정보 메시지입니다." />
    <vs-message state="success" text="성공적으로 완료되었습니다." />
    <vs-message state="warning" text="주의가 필요합니다." />
    <vs-message state="error" text="오류가 발생했습니다." />
</template>
```

### 크기 조정

```html
<template>
    <vs-message size="xs" text="XS 메시지" />
    <vs-message size="sm" text="SM 메시지" />
    <vs-message text="기본 크기 메시지" />
    <vs-message size="lg" text="LG 메시지" />
    <vs-message size="xl" text="XL 메시지" />
</template>
```

## Props

| Prop    | Type                                                    | Default  | Required | Description                        |
| ------- | ------------------------------------------------------- | -------- | -------- | ---------------------------------- |
| `state` | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'idle'` | -        | 메시지의 상태 (아이콘과 색상 결정) |
| `size`  | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                   | -        | -        | 메시지와 아이콘의 크기             |
| `text`  | `string`                                                | `''`     | -        | 표시할 메시지 텍스트               |

## 특징

- **상태별 아이콘**: 각 상태에 맞는 적절한 아이콘을 자동으로 표시
- **색상 테마**: 상태에 따라 일관된 색상 스키마 적용
