> For English documentation, see [README.md](./README.md).

# VsRadio / VsRadioSet

목록에서 단일 옵션을 선택하는 라디오 버튼 컴포넌트(`VsRadio`)와 그룹 컴포넌트(`VsRadioSet`)입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- `VsRadio`: v-model을 지원하는 단일 라디오 버튼
- `VsRadioSet`: `options` 배열로부터 라디오 버튼 목록을 렌더링
- 값 변경을 조건부로 허용하는 `beforeChange` 비동기 콜백 지원
- 내장 유효성 검사 지원 (필수값 규칙, 커스텀 규칙)
- 키보드 접근성 및 focus/blur 이벤트 지원
- `VsRadioSet`의 수직 레이아웃 옵션

## 기본 사용법

### VsRadio

```html
<template>
    <vs-radio v-model="selected" :radio-value="'apple'" radio-label="사과" />
    <vs-radio v-model="selected" :radio-value="'banana'" radio-label="바나나" />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
</script>
```

### VsRadioSet

```html
<template>
    <vs-radio-set v-model="selected" :options="options" label="과일 선택" />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
const options = ['사과', '바나나', '체리'];
</script>
```

### 수직 레이아웃

```html
<template>
    <vs-radio-set v-model="selected" :options="options" vertical />
</template>
```

### beforeChange 사용

```html
<template>
    <vs-radio-set
        v-model="selected"
        :options="options"
        :before-change="confirmChange"
    />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
const options = ['사과', '바나나', '체리'];

async function confirmChange(from, to) {
    return confirm(`${from}에서 ${to}로 변경하시겠습니까?`);
}
</script>
```

## Props

### VsRadio

| Prop           | Type                                                              | Default  | Required | 설명                                               |
| -------------- | ----------------------------------------------------------------- | -------- | -------- | -------------------------------------------------- |
| `colorScheme`  | `string`                                                          | -        | -        | 컴포넌트의 색상 스킴                               |
| `styleSet`     | `string \| VsRadioStyleSet`                                       | -        | -        | 컴포넌트에 적용할 커스텀 스타일 세트               |
| `disabled`     | `boolean`                                                         | `false`  | -        | 라디오 입력 비활성화                               |
| `hidden`       | `boolean`                                                         | `false`  | -        | 컴포넌트 숨김                                      |
| `id`           | `string`                                                          | `''`     | -        | HTML id 속성                                       |
| `label`        | `string`                                                          | `''`     | -        | 입력 래퍼의 레이블 텍스트                          |
| `noLabel`      | `boolean`                                                         | `false`  | -        | 레이블 숨김                                        |
| `noMessages`   | `boolean`                                                         | `false`  | -        | 유효성 검사 메시지 숨김                            |
| `required`     | `boolean`                                                         | `false`  | -        | 필수 입력 필드로 지정                              |
| `messages`     | `Message[]`                                                       | `[]`     | -        | 유효성 검사 메시지                                 |
| `name`         | `string`                                                          | `''`     | -        | 라디오 버튼 그룹화를 위한 HTML name 속성           |
| `noDefaultRules` | `boolean`                                                       | `false`  | -        | 내장 유효성 검사 규칙 비활성화                     |
| `readonly`     | `boolean`                                                         | `false`  | -        | 읽기 전용으로 설정                                 |
| `rules`        | `Rule[]`                                                          | `[]`     | -        | 커스텀 유효성 검사 규칙                            |
| `state`        | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'`         | `'idle'` | -        | 유효성 검사 상태                                   |
| `beforeChange` | `(from: any, to: any, optionValue: any) => Promise<boolean> \| null` | `null` | -     | 값 변경 전 호출되는 비동기 콜백                    |
| `checked`      | `boolean`                                                         | `false`  | -        | 마운트 시 이 라디오를 미리 선택                    |
| `radioLabel`   | `string`                                                          | `''`     | -        | 라디오 원 옆에 표시되는 레이블                     |
| `radioValue`   | `any`                                                             | -        | Yes      | 이 라디오가 나타내는 값                            |
| `modelValue`   | `any`                                                             | `null`   | -        | 현재 선택된 값 (v-model)                           |
| `width`        | `string \| number \| Breakpoints`                                 | -        | -        | 컴포넌트의 너비                                    |
| `grid`         | `string \| number \| Breakpoints`                                 | -        | -        | 그리드 컬럼 스팬                                   |

### VsRadioSet

| Prop           | Type                                                              | Default  | Required | 설명                                               |
| -------------- | ----------------------------------------------------------------- | -------- | -------- | -------------------------------------------------- |
| `colorScheme`  | `string`                                                          | -        | -        | 컴포넌트의 색상 스킴                               |
| `styleSet`     | `string \| VsRadioSetStyleSet`                                    | -        | -        | 컴포넌트에 적용할 커스텀 스타일 세트               |
| `disabled`     | `boolean`                                                         | `false`  | -        | 모든 라디오 버튼 비활성화                          |
| `hidden`       | `boolean`                                                         | `false`  | -        | 컴포넌트 숨김                                      |
| `id`           | `string`                                                          | `''`     | -        | HTML id 속성                                       |
| `label`        | `string`                                                          | `''`     | -        | 그룹 레이블 텍스트                                 |
| `noLabel`      | `boolean`                                                         | `false`  | -        | 레이블 숨김                                        |
| `noMessages`   | `boolean`                                                         | `false`  | -        | 유효성 검사 메시지 숨김                            |
| `required`     | `boolean`                                                         | `false`  | -        | 필수 입력 필드로 지정                              |
| `messages`     | `Message[]`                                                       | `[]`     | -        | 유효성 검사 메시지                                 |
| `name`         | `string`                                                          | `''`     | -        | 모든 라디오가 공유하는 HTML name 속성              |
| `noDefaultRules` | `boolean`                                                       | `false`  | -        | 내장 유효성 검사 규칙 비활성화                     |
| `readonly`     | `boolean`                                                         | `false`  | -        | 모든 라디오를 읽기 전용으로 설정                   |
| `rules`        | `Rule[]`                                                          | `[]`     | -        | 커스텀 유효성 검사 규칙                            |
| `state`        | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'`         | `'idle'` | -        | 유효성 검사 상태                                   |
| `options`      | `any[]`                                                           | `[]`     | -        | 옵션 값 또는 객체의 배열                           |
| `optionLabel`  | `string`                                                          | -        | -        | 옵션이 객체일 때 레이블에 사용할 키 이름           |
| `optionValue`  | `string`                                                          | -        | -        | 옵션이 객체일 때 값에 사용할 키 이름               |
| `beforeChange` | `(from: any, to: any, optionValue: any) => Promise<boolean> \| null` | `null` | -     | 값 변경 전 호출되는 비동기 콜백                    |
| `vertical`     | `boolean`                                                         | `false`  | -        | 라디오 버튼을 수직으로 배치                        |
| `modelValue`   | `any`                                                             | `null`   | -        | 현재 선택된 값 (v-model)                           |
| `width`        | `string \| number \| Breakpoints`                                 | -        | -        | 컴포넌트의 너비                                    |
| `grid`         | `string \| number \| Breakpoints`                                 | -        | -        | 그리드 컬럼 스팬                                   |

## Types

```typescript
interface VsRadioStyleSet {
    variables?: {
        borderRadius?: string;
        radioColor?: string;
        radioSize?: string;
    };
    wrapper?: VsInputWrapperStyleSet;
}

interface VsRadioSetStyleSet {
    component?: CSSProperties;
    radio?: VsRadioStyleSet;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `wrapper`는 [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types)을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-radio-set
        v-model="selected"
        :options="options"
        :style-set="{
            component: { gap: '1rem' },
            radio: {
                variables: {
                    radioColor: '#6366f1',
                    radioSize: '1.2rem',
                },
            },
        }"
    />
</template>
```

## Events

### VsRadio

| Event               | Payload                   | 설명                               |
| ------------------- | ------------------------- | ---------------------------------- |
| `update:modelValue` | `any`                     | 선택 값이 변경될 때 발생           |
| `update:changed`    | `boolean`                 | changed 상태가 업데이트될 때 발생  |
| `update:valid`      | `boolean`                 | 유효성 검사 상태가 업데이트될 때 발생 |
| `change`            | `Event`                   | 라디오 선택이 변경될 때 발생       |
| `toggle`            | `boolean`                 | 라디오가 토글될 때 발생            |
| `focus`             | `FocusEvent`              | 라디오가 포커스를 받을 때 발생     |
| `blur`              | `FocusEvent`              | 라디오가 포커스를 잃을 때 발생     |

### VsRadioSet

| Event               | Payload                   | 설명                               |
| ------------------- | ------------------------- | ---------------------------------- |
| `update:modelValue` | `any`                     | 선택 값이 변경될 때 발생           |
| `update:changed`    | `boolean`                 | changed 상태가 업데이트될 때 발생  |
| `update:valid`      | `boolean`                 | 유효성 검사 상태가 업데이트될 때 발생 |
| `change`            | `any`                     | 선택이 변경될 때 발생              |
| `focus`             | `(option: any, event: FocusEvent)` | 라디오가 포커스를 받을 때 발생 |
| `blur`              | `(option: any, event: FocusEvent)` | 라디오가 포커스를 잃을 때 발생 |

## Slots

### VsRadio

| Slot           | 설명                                   |
| -------------- | -------------------------------------- |
| `label`        | 커스텀 레이블 콘텐츠                   |
| `radio-label`  | 라디오 옆에 표시되는 커스텀 레이블     |
| `messages`     | 커스텀 유효성 검사 메시지              |

### VsRadioSet

| Slot           | 설명                                                             |
| -------------- | ---------------------------------------------------------------- |
| `label`        | 커스텀 레이블 콘텐츠                                             |
| `radio-label`  | 각 라디오의 커스텀 레이블; `{ option, value, label }` 수신       |
| `messages`     | 커스텀 유효성 검사 메시지                                        |

## Methods

### VsRadio

| Method     | Parameters | 설명                       |
| ---------- | ---------- | -------------------------- |
| `clear`    | -          | 선택 값 초기화             |
| `validate` | -          | 유효성 검사 실행           |
| `focus`    | -          | 라디오 입력에 포커스       |
| `blur`     | -          | 라디오 입력에서 포커스 해제 |

### VsRadioSet

| Method     | Parameters | 설명                           |
| ---------- | ---------- | ------------------------------ |
| `focus`    | -          | 첫 번째 라디오 입력에 포커스   |
| `blur`     | -          | 첫 번째 라디오 입력 포커스 해제 |
| `validate` | -          | 유효성 검사 실행               |
| `clear`    | -          | 선택 값 초기화                 |
