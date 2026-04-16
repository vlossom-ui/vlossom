# VsInputWrapper

라벨, 유효성 메시지 영역, 반응형 레이아웃 지원을 제공하는 폼 입력 레이아웃 래퍼 컴포넌트입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- 일관된 라벨 및 메시지 레이아웃으로 모든 폼 입력을 감쌉니다.
- 유효성 검사 실패 시 수평 흔들기 애니메이션을 지원합니다.
- 접근성 있는 그룹 입력을 위해 `fieldset`/`legend` 쌍으로 렌더링할 수 있습니다.
- 상태 인식 유효성 메시지 표시를 위해 `vs-message`와 통합됩니다.
- `width` 및 `grid` props를 통한 반응형 레이아웃을 지원합니다.

## Basic Usage

```html
<template>
    <vs-input-wrapper label="사용자명">
        <input type="text" placeholder="사용자명 입력" />
    </vs-input-wrapper>
</template>
```

### 메시지 사용

```html
<template>
    <vs-input-wrapper
        label="이메일"
        :messages="[{ state: 'error', text: '유효하지 않은 이메일 주소입니다' }]"
    >
        <input type="email" />
    </vs-input-wrapper>
</template>
```

### 그룹 라벨 (fieldset)

```html
<template>
    <vs-input-wrapper label="배송 주소" :group-label="true">
        <input type="text" placeholder="도로명" />
        <input type="text" placeholder="도시" />
    </vs-input-wrapper>
</template>
```

### 필수 필드

```html
<template>
    <vs-input-wrapper label="비밀번호" :required="true">
        <input type="password" />
    </vs-input-wrapper>
</template>
```

## Props

| Prop         | Type                                | Default | Required | Description                                                  |
| ------------ | ----------------------------------- | ------- | -------- | ------------------------------------------------------------ |
| `styleSet`   | `string \| VsInputWrapperStyleSet`  | -       | -        | 컴포넌트의 커스텀 스타일 셋.                                 |
| `width`      | `string \| number \| Breakpoints`   | -       | -        | 컴포넌트 너비.                                               |
| `grid`       | `string \| number \| Breakpoints`   | -       | -        | 레이아웃의 그리드 열 span.                                   |
| `disabled`   | `boolean`                           | `false` | -        | 라벨 및 메시지에 비활성화 스타일을 적용합니다.               |
| `hidden`     | `boolean`                           | `false` | -        | 전체 컴포넌트를 숨깁니다.                                    |
| `id`         | `string`                            | `''`    | -        | 라벨의 `for` 속성과 연결되는 `id`.                           |
| `label`      | `string`                            | `''`    | -        | 입력 위에 표시되는 라벨 텍스트.                              |
| `noLabel`    | `boolean`                           | `false` | -        | 라벨 영역을 숨깁니다.                                        |
| `noMessages` | `boolean`                           | `false` | -        | 메시지 영역을 숨깁니다.                                      |
| `required`   | `boolean`                           | `false` | -        | 라벨 옆에 필수 표시(*) 인디케이터를 보여줍니다.              |
| `groupLabel` | `boolean`                           | `false` | -        | 그룹 입력을 위해 `fieldset`/`legend`로 렌더링합니다.         |
| `messages`   | `StateMessage[]`                    | `[]`    | -        | 입력 아래에 표시되는 상태+텍스트 메시지 배열.                |
| `shake`      | `boolean`                           | `false` | -        | 수평 흔들기 애니메이션을 트리거합니다 (유효성 검사 실패 등). |

## Types

```typescript
interface VsInputWrapperStyleSet {
    component?: CSSProperties;
    label?: CSSProperties;
    messages?: CSSProperties;
    message?: VsMessageStyleSet;
}
```

> [!NOTE]
> `message`는 `VsMessageStyleSet`을 사용합니다. 자세한 내용은 [VsMessage README](../vs-message/README.md)를 참고하세요.

### StyleSet 사용 예시

```html
<template>
    <vs-input-wrapper
        label="스타일 적용 래퍼"
        :style-set="{
            component: { padding: '1rem', backgroundColor: '#f9f9f9' },
            label: { color: '#333', fontWeight: '600' },
            messages: { marginTop: '0.5rem' },
            message: { component: { fontSize: '0.75rem' } },
        }"
    >
        <input type="text" />
    </vs-input-wrapper>
</template>
```

## Events

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |

## Slots

| 슬롯       | 설명                                              |
| ---------- | ------------------------------------------------- |
| `default`  | 감쌀 폼 입력 또는 콘텐츠.                         |
| `label`    | 기본 라벨 텍스트를 대체하는 커스텀 라벨 콘텐츠.   |
| `messages` | 기본 메시지를 대체하는 커스텀 메시지 콘텐츠.      |

## Methods

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
