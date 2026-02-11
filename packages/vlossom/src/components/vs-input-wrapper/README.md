# VsInputWrapper

입력 필드를 감싸는 래퍼 컴포넌트입니다.
라벨, 필수 표시, 메시지, 반응형 레이아웃, 흔들림 애니메이션 등의 기능을 제공하여 일관된 입력 필드 UI를 구성할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 입력 래퍼

```html
<template>
    <vs-input-wrapper label="이름">
        <input type="text" placeholder="이름을 입력하세요" />
    </vs-input-wrapper>
</template>
```

### 필수 입력 필드

```html
<template>
    <vs-input-wrapper label="이메일" required>
        <input type="email" placeholder="이메일을 입력하세요" />
    </vs-input-wrapper>
</template>
```

### 메시지가 있는 입력 필드

```html
<template>
    <vs-input-wrapper
        label="비밀번호"
        :messages="[
            { state: 'error', text: '비밀번호는 8자 이상이어야 합니다.' }
        ]"
    >
        <input type="password" placeholder="비밀번호를 입력하세요" />
    </vs-input-wrapper>
</template>
```

### 그룹 라벨 (fieldset/legend)

```html
<template>
    <vs-input-wrapper label="개인정보" group-label>
        <input type="text" placeholder="이름" />
        <input type="email" placeholder="이메일" />
    </vs-input-wrapper>
</template>
```

### 라벨과 메시지 숨기기

```html
<template>
    <vs-input-wrapper no-label no-messages>
        <input type="text" placeholder="라벨과 메시지가 없는 입력 필드" />
    </vs-input-wrapper>
</template>
```

## Props

| Prop          | Type                               | Default | Required | Description                        |
| ------------- | ---------------------------------- | ------- | -------- | ---------------------------------- |
| `disabled`    | `boolean`                          | `false` | -        | 입력 필드 비활성화                 |
| `hidden`      | `boolean`                          | `false` | -        | 입력 래퍼 숨김                     |
| `id`          | `string`                           | `''`    | -        | 입력 래퍼의 고유 ID                |
| `label`       | `string`                           | `''`    | -        | 입력 필드 라벨 텍스트              |
| `noLabel`     | `boolean`                          | `false` | -        | 라벨 표시 비활성화                 |
| `noMessages`  | `boolean`                          | `false` | -        | 메시지 표시 비활성화               |
| `required`    | `boolean`                          | `false` | -        | 필수 입력 필드 표시 (빨간 별표)    |
| `groupLabel`  | `boolean`                          | `false` | -        | fieldset/legend 구조로 라벨 렌더링 |
| `messages`    | `StateMessage<UIState>[]`          | `[]`    | -        | 표시할 메시지 배열                 |
| `shake`       | `boolean`                          | `false` | -        | 흔들림 애니메이션 트리거           |
| `width`       | `string \| number \| Breakpoints`  | -       | -        | 반응형 너비 설정                   |
| `grid`        | `string \| number \| Breakpoints`  | -       | -        | 그리드 레이아웃 설정               |
| `colorScheme` | `ColorScheme`                      | -       | -        | 컴포넌트 색상 테마                 |
| `styleSet`    | `string \| VsInputWrapperStyleSet` | -       | -        | 커스텀 스타일 설정 객체            |

## Types

```typescript
interface StateMessage<T extends string = UIState> {
    state: T;
    text: string;
}

type UIState = 'idle' | 'info' | 'success' | 'warning' | 'error';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

interface VsInputWrapperStyleSet {
    component?: CSSProperties;
    label?: CSSProperties;
    message?: CSSProperties;
    messageSize?: Size;
}
```

## Slots

| Slot       | Description                             |
| ---------- | --------------------------------------- |
| `default`  | 입력 필드 컴포넌트 (input, textarea 등) |
| `label`    | 커스텀 라벨 콘텐츠                      |
| `messages` | 커스텀 메시지 콘텐츠                    |

## 특징

- **라벨 관리**: 자동 라벨 렌더링 및 커스텀 라벨 슬롯 지원
- **필수 표시**: `required` prop으로 필수 입력 필드 시각적 표시
- **메시지 시스템**: 상태별 메시지 표시 (info, success, warning, error)
- **스타일 시스템**: `colorScheme`과 `styleSet`을 통한 세밀한 스타일 제어
- **반응형 레이아웃**: VsResponsive 기반 반응형 너비 및 그리드 지원
- **흔들림 애니메이션**: 유효성 검사 실패 시 시각적 피드백 제공
- **접근성**: fieldset/legend 구조 지원으로 스크린 리더 호환성
- **커스터마이징**: 라벨과 메시지 슬롯을 통한 완전한 커스터마이징 가능
