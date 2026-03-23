> English: [README.md](./README.md)

# VsTextarea

여러 줄의 텍스트를 입력할 수 있는 텍스트 영역 컴포넌트입니다. 문자열 수정자(modifiers)를 통해 입력값을 자동으로 변환할 수 있으며, 검증 기능을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 입력

```html
<template>
    <vs-textarea v-model="description" placeholder="내용을 입력하세요" />
</template>
```

### 라벨과 함께 사용

```html
<template>
    <vs-textarea v-model="content" label="설명" placeholder="내용을 입력하세요" />
</template>
```

### 필수 입력 필드

```html
<template>
    <vs-textarea v-model="content" label="필수 항목" placeholder="이 항목은 필수입니다" required />
</template>
```

### 문자열 수정자 (Modifiers)

```html
<template>
    <!-- 첫 글자만 대문자로 -->
    <vs-textarea v-model.capitalize="text" label="제목" />

    <!-- 전체 대문자로 -->
    <vs-textarea v-model.upper="code" label="코드" />

    <!-- 전체 소문자로 -->
    <vs-textarea v-model.lower="email" label="이메일" />
</template>
```

### 글자 수 제한 (min/max)

```html
<template>
    <vs-textarea
        v-model="description"
        label="상품 설명"
        placeholder="최소 10자, 최대 500자"
        :min="10"
        :max="500"
    />
</template>
```

### 비활성화 및 읽기 전용

```html
<template>
    <vs-textarea v-model="value1" label="비활성화" disabled />
    <vs-textarea v-model="value2" label="읽기 전용" readonly />
</template>
```

### 커스텀 검증 규칙

```html
<template>
    <vs-textarea v-model="comment" label="댓글" :rules="[noSwearWords]" />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const comment = ref('');

function noSwearWords(value: string) {
    const swearWords = ['금지어1', '금지어2'];
    if (swearWords.some((word) => value.includes(word))) {
        return '금지어가 포함되어 있습니다';
    }
    return '';
}
</script>
```

### 메서드 사용

```html
<template>
    <vs-textarea ref="textareaRef" v-model="value" label="내용" />
    <button @click="focusTextarea">Focus</button>
    <button @click="selectTextarea">Select</button>
    <button @click="clearTextarea">Clear</button>
</template>

<script setup lang="ts">
import { ref, useTemplateRef } from 'vue';
import type { VsTextareaRef } from '@/components';

const textareaRef = useTemplateRef('textareaRef');
const value = ref('');

function focusTextarea() {
    textareaRef.value?.focus();
}

function selectTextarea() {
    textareaRef.value?.select();
}

function clearTextarea() {
    textareaRef.value?.clear();
}
</script>
```

## Props

| Prop             | Type                              | Default                   | Required | Description                                     |
| ---------------- | --------------------------------- | ------------------------- | -------- | ----------------------------------------------- |
| `colorScheme`    | `ColorScheme`                     | -                         | -        | 컴포넌트 색상 테마                              |
| `styleSet`       | `string \| VsTextareaStyleSet`    | -                         | -        | 커스텀 스타일 설정 객체                         |
| `autocomplete`   | `boolean`                         | `false`                   | -        | 자동완성 활성화 여부                            |
| `changed`        | `boolean`                         | `false`                   | -        | 값 변경 여부 (v-model:changed)                  |
| `disabled`       | `boolean`                         | `false`                   | -        | 비활성화 상태                                   |
| `grid`           | `string \| number \| Breakpoints` | -                         | -        | 그리드 레이아웃 크기                            |
| `hidden`         | `boolean`                         | `false`                   | -        | 컴포넌트 숨김 여부                              |
| `id`             | `string`                          | -                         | -        | textarea 요소의 id                              |
| `label`          | `string`                          | -                         | -        | 입력 필드 라벨                                  |
| `max`            | `number \| string`                | `Number.MAX_SAFE_INTEGER` | -        | 최대 글자 수                                    |
| `messages`       | `Message<string>[]`               | `[]`                      | -        | 메시지 표시                                     |
| `min`            | `number \| string`                | `Number.MIN_SAFE_INTEGER` | -        | 최소 글자 수                                    |
| `modelValue`     | `string`                          | `''`                      | -        | v-model 바인딩 값                               |
| `modelModifiers` | `StringModifiers`                 | `{}`                      | -        | 문자열 수정자 (capitalize, upper, lower)        |
| `name`           | `string`                          | -                         | -        | textarea 요소의 name 속성                       |
| `noDefaultRules` | `boolean`                         | `false`                   | -        | 기본 검증 규칙 비활성화                         |
| `noLabel`        | `boolean`                         | `false`                   | -        | 라벨 영역 숨김                                  |
| `noMessages`     | `boolean`                         | `false`                   | -        | 메시지 영역 숨김                                |
| `placeholder`    | `string`                          | -                         | -        | 플레이스홀더 텍스트                             |
| `readonly`       | `boolean`                         | `false`                   | -        | 읽기 전용 상태                                  |
| `required`       | `boolean`                         | `false`                   | -        | 필수 입력 여부                                  |
| `rules`          | `Rule<string>[]`                  | `[]`                      | -        | 커스텀 검증 규칙                                |
| `state`          | `UIState`                         | `'idle'`                  | -        | 입력 상태 (idle, success, info, error, warning) |
| `valid`          | `boolean`                         | `false`                   | -        | 검증 통과 여부 (v-model:valid)                  |
| `width`          | `string \| number \| Breakpoints` | -                         | -        | 컴포넌트 너비                                   |

## Events

| Event               | Parameters          | Description                  |
| ------------------- | ------------------- | ---------------------------- |
| `update:modelValue` | `value: string`     | v-model 값 변경 시 발생      |
| `update:changed`    | `changed: boolean`  | 값 변경 여부 업데이트        |
| `update:valid`      | `valid: boolean`    | 검증 상태 업데이트           |
| `change`            | `value: string`     | 입력값 변경 시 발생          |
| `focus`             | `event: FocusEvent` | textarea 포커스 시 발생      |
| `blur`              | `event: FocusEvent` | textarea 포커스 해제 시 발생 |

## Exposed Methods

| Method     | Parameters | Return Type | Description                   |
| ---------- | ---------- | ----------- | ----------------------------- |
| `focus`    | -          | `void`      | textarea에 포커스 설정        |
| `blur`     | -          | `void`      | textarea의 포커스 제거        |
| `select`   | -          | `void`      | textarea 텍스트 전체 선택     |
| `clear`    | -          | `void`      | textarea 값 초기화            |
| `validate` | -          | `boolean`   | 유효성 검사 수행 및 결과 반환 |

## Types

```typescript
interface VsTextareaStyleSet {
    textarea?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> `wrapper`는 [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types)을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-textarea
        v-model="description"
        :style-set="{
            textarea: {
                minHeight: '10rem',
                padding: '1rem',
                border: '2px solid #333',
                backgroundColor: '#f5f5f5',
                borderRadius: '8px',
            },
        }"
    />
</template>
```

## Slots

| Slot       | Description          |
| ---------- | -------------------- |
| `label`    | 커스텀 라벨 콘텐츠   |
| `messages` | 커스텀 메시지 콘텐츠 |

## 특징

- **여러 줄 텍스트 입력**: 긴 텍스트나 설명을 입력하기에 적합한 textarea 요소 제공
- **문자열 수정자**: v-model의 capitalize, upper, lower 수정자로 입력값 자동 변환
- **글자 수 제한**: min/max 속성으로 최소/최대 글자 수 제한
- **검증 규칙**: 커스텀 검증 규칙과 기본 검증(required, min, max) 지원
- **텍스트 선택**: select() 메서드로 전체 텍스트 선택 가능
- **접근성**: aria-required 속성을 통한 스크린 리더 지원
