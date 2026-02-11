# VsInput

다양한 타입과 검증 기능을 지원하는 입력 컴포넌트입니다. text, email, password, number 등 여러 input 타입을 제공하며, 문자열 수정자(modifiers)를 통해 입력값을 자동으로 변환할 수 있습니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 입력

```html
<template>
    <vs-input v-model="value" placeholder="텍스트를 입력하세요" />
</template>
```

### 라벨과 함께 사용

```html
<template>
    <vs-input v-model="name" label="이름" placeholder="이름을 입력하세요" />
</template>
```

### 다양한 타입

```html
<template>
    <vs-input v-model="email" type="email" label="이메일" placeholder="email@example.com" />
    <vs-input v-model="password" type="password" label="비밀번호" placeholder="비밀번호 입력" />
    <vs-input v-model="age" type="number" label="나이" placeholder="나이 입력" />
    <vs-input v-model="phone" type="tel" label="전화번호" placeholder="010-0000-0000" />
</template>
```

### 필수 입력 필드

```html
<template>
    <vs-input v-model="email" type="email" label="이메일" placeholder="email@example.com" required />
</template>
```

### 문자열 수정자 (Modifiers)

```html
<template>
    <!-- 첫 글자만 대문자로 -->
    <vs-input v-model.capitalize="name" label="이름" />

    <!-- 전체 대문자로 -->
    <vs-input v-model.upper="code" label="코드" />

    <!-- 전체 소문자로 -->
    <vs-input v-model.lower="username" label="사용자명" />
</template>
```

### Prepend/Append 슬롯

```html
<template>
    <!-- 앞에 아이콘 추가 -->
    <vs-input v-model="search" placeholder="검색어 입력">
        <template #prepend> 🔍 </template>
    </vs-input>

    <!-- 뒤에 단위 추가 -->
    <vs-input v-model="price" type="number" placeholder="가격 입력">
        <template #append>
            <span style="padding: 0 0.5rem">원</span>
        </template>
    </vs-input>
</template>
```

### 숫자 입력 (min/max)

```html
<template>
    <vs-input v-model="age" type="number" label="나이" placeholder="나이 입력" :min="0" :max="120" />
</template>
```

### 비활성화 및 읽기 전용

```html
<template>
    <vs-input v-model="value1" label="비활성화" disabled />
    <vs-input v-model="value2" label="읽기 전용" readonly />
</template>
```

### Clear 버튼 제거

```html
<template>
    <vs-input v-model="value" label="Clear 버튼 없음" no-clear />
</template>
```

### 메서드 사용

```html
<template>
    <vs-input ref="inputRef" v-model="value" label="이름" />
    <button @click="focusInput">Focus</button>
    <button @click="selectInput">Select</button>
    <button @click="clearInput">Clear</button>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { VsInputRef } from '@/components';

const inputRef = useTemplateRef('inputRef');
const value = ref('');

function focusInput() {
    inputRef.value?.focus();
}

function selectInput() {
    inputRef.value?.select();
}

function clearInput() {
    inputRef.value?.clear();
}
</script>
```

## Props

| Prop             | Type                                                                        | Default                   | Required | Description                                     |
| ---------------- | --------------------------------------------------------------------------- | ------------------------- | -------- | ----------------------------------------------- |
| `colorScheme`    | `ColorScheme`                                                               | -                         | -        | 컴포넌트 색상 테마                              |
| `styleSet`       | `string \| VsInputStyleSet`                                                 | -                         | -        | 커스텀 스타일 설정 객체                         |
| `autocomplete`   | `boolean`                                                                   | `false`                   | -        | 자동완성 활성화 여부                            |
| `changed`        | `boolean`                                                                   | `false`                   | -        | 값 변경 여부 (v-model:changed)                  |
| `disabled`       | `boolean`                                                                   | `false`                   | -        | 입력 필드 비활성화                              |
| `grid`           | `string \| number \| Breakpoints`                                           | -                         | -        | 그리드 레이아웃 크기                            |
| `hidden`         | `boolean`                                                                   | `false`                   | -        | 컴포넌트 숨김 여부                              |
| `id`             | `string`                                                                    | -                         | -        | input 요소의 id                                 |
| `label`          | `string`                                                                    | -                         | -        | 입력 필드 라벨                                  |
| `max`            | `number \| string`                                                          | `Number.MAX_SAFE_INTEGER` | -        | 숫자 타입의 최대값                              |
| `messages`       | `Message<InputValueType>[]`                                                 | `[]`                      | -        | 메시지 표시                                     |
| `min`            | `number \| string`                                                          | `Number.MIN_SAFE_INTEGER` | -        | 숫자 타입의 최소값                              |
| `modelValue`     | `string \| number \| null`                                                  | `null`                    | -        | v-model 바인딩 값                               |
| `modelModifiers` | `StringModifiers`                                                           | `{}`                      | -        | 문자열 수정자 (capitalize, upper, lower)        |
| `name`           | `string`                                                                    | -                         | -        | input 요소의 name 속성                          |
| `noClear`        | `boolean`                                                                   | `false`                   | -        | clear 버튼 숨김                                 |
| `noDefaultRules` | `boolean`                                                                   | `false`                   | -        | 기본 검증 규칙 비활성화                         |
| `noLabel`        | `boolean`                                                                   | `false`                   | -        | 라벨 영역 숨김                                  |
| `noMessages`     | `boolean`                                                                   | `false`                   | -        | 메시지 영역 숨김                                |
| `placeholder`    | `string`                                                                    | -                         | -        | 플레이스홀더 텍스트                             |
| `readonly`       | `boolean`                                                                   | `false`                   | -        | 읽기 전용 상태                                  |
| `required`       | `boolean`                                                                   | `false`                   | -        | 필수 입력 여부                                  |
| `rules`          | `Rule<InputValueType>[]`                                                    | `[]`                      | -        | 커스텀 검증 규칙                                |
| `state`          | `UIState`                                                                   | `'idle'`                  | -        | 입력 상태 (idle, success, info, error, warning) |
| `type`           | `'text' \| 'email' \| 'password' \| 'number' \| 'tel' \| 'url' \| 'search'` | `'text'`                  | -        | input 타입                                      |
| `valid`          | `boolean`                                                                   | `false`                   | -        | 검증 통과 여부 (v-model:valid)                  |
| `width`          | `string \| number \| Breakpoints`                                           | -                         | -        | 컴포넌트 너비                                   |

## Events

| Event               | Parameters              | Description             |
| ------------------- | ----------------------- | ----------------------- |
| `update:modelValue` | `value: InputValueType` | v-model 값 변경 시 발생 |
| `update:changed`    | `changed: boolean`      | 값 변경 여부 업데이트   |
| `update:valid`      | `valid: boolean`        | 검증 상태 업데이트      |
| `change`            | `value: InputValueType` | 입력값 변경 시 발생     |

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
> `wrapper`는 [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types)을 사용합니다.

## Slots

| Slot       | Description                  |
| ---------- | ---------------------------- |
| `label`    | 커스텀 라벨 콘텐츠           |
| `prepend`  | 입력 필드 앞에 표시할 콘텐츠 |
| `append`   | 입력 필드 뒤에 표시할 콘텐츠 |
| `messages` | 커스텀 메시지 콘텐츠         |

## 특징

- **다양한 Input 타입 지원**: text, email, password, number, tel, url, search 등 다양한 타입 제공
- **문자열 수정자**: v-model의 capitalize, upper, lower 수정자로 입력값 자동 변환
- **숫자 입력 검증**: type="number"일 때 min/max 속성으로 범위 제한
- **Clear 버튼**: 입력값을 빠르게 지울 수 있는 clear 버튼 제공 (비활성화 가능)
- **Prepend/Append 슬롯**: 입력 필드 앞뒤에 아이콘이나 텍스트 추가 가능
- **검증 규칙**: 커스텀 검증 규칙과 기본 검증(required, min, max) 지원
- **타입 안전성**: number 타입은 숫자로, text 타입은 문자열로 자동 변환
