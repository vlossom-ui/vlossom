# VsMessage

idle, info, success, warning, error 등 다양한 UI 상태에 맞는 아이콘과 텍스트를 표시하는 작은 메시지 컴포넌트입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- `idle`, `info`, `success`, `warning`, `error` 5가지 상태를 지원합니다.
- 각 상태는 대응하는 아이콘을 렌더링하고 맞는 색상을 적용합니다.
- 아이콘과 텍스트 크기는 `variables.size` CSS 커스텀 속성으로 제어됩니다.
- 메시지 콘텐츠를 위한 `text` prop을 직접 받습니다.

## Basic Usage

```html
<template>
    <vs-message text="정보 메시지입니다." state="info" />
    <vs-message text="작업이 성공했습니다!" state="success" />
    <vs-message text="입력을 확인해 주세요." state="warning" />
    <vs-message text="오류가 발생했습니다." state="error" />
</template>
```

### 기본 상태

상태를 지정하지 않으면 `idle` 상태가 사용됩니다 (기본 색상).

```html
<template>
    <vs-message text="기본 idle 메시지." />
</template>
```

## Props

| Prop       | Type                                                          | Default  | Required | Description                                          |
| ---------- | ------------------------------------------------------------- | -------- | -------- | ---------------------------------------------------- |
| `styleSet` | `string \| VsMessageStyleSet`                                 | -        | -        | 컴포넌트의 커스텀 스타일 셋.                         |
| `state`    | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'`      | `'idle'` | -        | 아이콘과 색상을 결정하는 UI 상태.                    |
| `text`     | `string`                                                      | `''`     | -        | 표시할 메시지 텍스트.                                |

## Types

```typescript
interface VsMessageStyleSet {
    variables?: {
        size?: string;
    };
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-message
        text="커스텀 크기 메시지"
        state="info"
        :style-set="{
            variables: { size: '1rem' },
            component: { padding: '0.25rem 0' },
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
