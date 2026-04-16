# VsInput

유효성 검사, 지우기 버튼, prepend/append 슬롯, 폼 통합을 갖춘 기능이 풍부한 텍스트 입력 컴포넌트입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- `text`, `email`, `number`, `password`, `search`, `tel`, `url` 등 다양한 입력 타입을 지원합니다.
- 호버/포커스 시 나타나는 내장 지우기 버튼을 제공합니다.
- 커스텀 규칙 및 내장 `required`, `min`, `max` 검사를 포함한 폼 유효성 검사를 지원합니다.
- 아이콘 또는 추가 콘텐츠를 위한 prepend 및 append 슬롯 영역을 제공합니다.
- `width` 및 `grid` props를 통한 반응형 레이아웃을 지원합니다.

## Basic Usage

```html
<template>
    <vs-input v-model="text" label="이름" placeholder="이름을 입력하세요" />
</template>

<script setup>
import { ref } from 'vue';
const text = ref('');
</script>
```

### 입력 타입

```html
<template>
    <vs-input v-model="email" type="email" label="이메일" />
    <vs-input v-model="password" type="password" label="비밀번호" />
    <vs-input v-model="count" type="number" label="수량" :min="0" :max="100" />
</template>
```

### Prepend 및 Append 사용

```html
<template>
    <vs-input v-model="value" label="검색">
        <template #prepend>
            <span>🔍</span>
        </template>
        <template #append>
            <span>이동</span>
        </template>
    </vs-input>
</template>
```

### 유효성 검사

```html
<template>
    <vs-input
        v-model="value"
        label="필수 입력 필드"
        :required="true"
        :rules="[v => !!v || '필수 입력 항목입니다']"
    />
</template>
```

### 비활성화 및 읽기 전용

```html
<template>
    <vs-input v-model="value" label="비활성화" :disabled="true" />
    <vs-input v-model="value" label="읽기 전용" :readonly="true" />
</template>
```

## Props

| Prop              | Type                                              | Default  | Required | Description                                                          |
| ----------------- | ------------------------------------------------- | -------- | -------- | -------------------------------------------------------------------- |
| `colorScheme`     | `string`                                          | -        | -        | 컴포넌트의 색상 스킴.                                                |
| `styleSet`        | `string \| VsInputStyleSet`                       | -        | -        | 컴포넌트의 커스텀 스타일 셋.                                         |
| `modelValue`      | `string \| number \| null`                        | `null`   | -        | 바인딩 값 (v-model).                                                 |
| `type`            | `'email' \| 'number' \| 'password' \| 'search' \| 'tel' \| 'text' \| 'url'` | `'text'` | - | HTML 입력 타입.              |
| `label`           | `string`                                          | `''`     | -        | 입력 위에 표시되는 라벨 텍스트.                                      |
| `placeholder`     | `string`                                          | `''`     | -        | 입력의 플레이스홀더 텍스트.                                          |
| `disabled`        | `boolean`                                         | `false`  | -        | 입력을 비활성화합니다.                                               |
| `readonly`        | `boolean`                                         | `false`  | -        | 입력을 읽기 전용으로 설정합니다.                                     |
| `required`        | `boolean`                                         | `false`  | -        | 필드를 필수로 표시합니다 (유효성 검사 추가).                         |
| `noClear`         | `boolean`                                         | `false`  | -        | 지우기 버튼을 숨깁니다.                                              |
| `autocomplete`    | `boolean`                                         | `false`  | -        | 브라우저 자동완성을 활성화합니다.                                    |
| `noLabel`         | `boolean`                                         | `false`  | -        | 라벨 영역을 숨깁니다.                                                |
| `noMessages`      | `boolean`                                         | `false`  | -        | 메시지 영역을 숨깁니다.                                              |
| `hidden`          | `boolean`                                         | `false`  | -        | 전체 컴포넌트를 숨깁니다.                                            |
| `id`              | `string`                                          | `''`     | -        | 입력 요소의 `id` 속성.                                               |
| `name`            | `string`                                          | `''`     | -        | 입력 요소의 `name` 속성.                                             |
| `messages`        | `Message[]`                                       | `[]`     | -        | 입력 아래에 표시할 외부 메시지 (상태 + 텍스트).                      |
| `rules`           | `Rule[]`                                          | `[]`     | -        | 변경 시 적용되는 유효성 검사 규칙.                                   |
| `noDefaultRules`  | `boolean`                                         | `false`  | -        | 내장 required/min/max 규칙을 비활성화합니다.                         |
| `state`           | `UIState`                                         | `'idle'` | -        | 외부 유효성 상태 (`idle`, `info`, `success`, `warning`, `error`).    |
| `min`             | `string \| number`                                | -        | -        | 최솟값 (number 타입) 또는 최소 길이 (text 타입).                     |
| `max`             | `string \| number`                                | -        | -        | 최댓값 (number 타입) 또는 최대 길이 (text 타입).                     |
| `width`           | `string \| number \| Breakpoints`                 | -        | -        | 컴포넌트 너비.                                                       |
| `grid`            | `string \| number \| Breakpoints`                 | -        | -        | 레이아웃의 그리드 열 span.                                           |
| `changed`         | `boolean`                                         | `false`  | -        | 값 변경 여부를 반영하는 v-model 바인딩.                              |
| `valid`           | `boolean`                                         | `false`  | -        | 현재 유효성 상태를 반영하는 v-model 바인딩.                          |

## Types

```typescript
interface VsInputStyleSet {
    prepend?: CSSProperties;
    append?: CSSProperties;
    input?: CSSProperties;
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `wrapper`는 `VsInputWrapperStyleSet`을 사용합니다. 자세한 내용은 [VsInputWrapper README](../vs-input-wrapper/README.md)를 참고하세요.

### StyleSet 사용 예시

```html
<template>
    <vs-input
        v-model="value"
        label="스타일 적용 입력"
        :style-set="{
            component: { borderRadius: '20px', height: '3rem' },
            input: { fontSize: '1rem' },
            prepend: { backgroundColor: '#eee', padding: '0 0.5rem' },
            append: { backgroundColor: '#eee', padding: '0 0.5rem' },
            wrapper: { label: { color: 'blue' } },
        }"
    />
</template>
```

## Events

| 이벤트              | 페이로드                   | 설명                                          |
| ------------------- | -------------------------- | --------------------------------------------- |
| `update:modelValue` | `string \| number \| null` | 입력 값이 변경될 때 발생합니다.               |
| `update:changed`    | `boolean`                  | 변경 상태가 업데이트될 때 발생합니다.         |
| `update:valid`      | `boolean`                  | 유효성 상태가 업데이트될 때 발생합니다.       |
| `change`            | -                          | 값이 확정된 후 발생합니다.                    |
| `focus`             | `FocusEvent`               | 입력이 포커스를 받을 때 발생합니다.           |
| `blur`              | `FocusEvent`               | 입력이 포커스를 잃을 때 발생합니다.           |

## Slots

| 슬롯       | 설명                                              |
| ---------- | ------------------------------------------------- |
| `label`    | 기본 라벨을 대체하는 커스텀 라벨 콘텐츠.          |
| `prepend`  | 입력 박스 왼쪽에 표시되는 콘텐츠.                 |
| `append`   | 입력 박스 오른쪽에 표시되는 콘텐츠.               |
| `messages` | 입력 아래의 커스텀 메시지 콘텐츠.                 |

## Methods

| 메서드     | 파라미터 | 설명                                        |
| ---------- | -------- | ------------------------------------------- |
| `focus`    | -        | 입력 요소에 포커스를 줍니다.                |
| `blur`     | -        | 입력 요소의 포커스를 해제합니다.            |
| `validate` | -        | 유효성 검사를 실행하고 결과를 반환합니다.   |
| `clear`    | -        | 입력 값을 초기화합니다.                     |
| `select`   | -        | 입력 요소의 모든 텍스트를 선택합니다.       |
