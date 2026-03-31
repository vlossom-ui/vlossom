> For English documentation, see [README.md](./README.md).

# VsTextarea

유효성 검사, 문자열 수정자, 최소/최대 길이 제약을 지원하는 다중 행 텍스트 입력 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 완전한 유효성 검사 지원을 갖춘 다중 행 텍스트 입력
- `v-model.trim` 스타일의 수정자로 적용되는 문자열 수정자 (trim, lowercase, uppercase 등)
- 기본 규칙을 포함한 최소/최대 길이 유효성 검사
- 레이블, 메시지, 상태 표시를 위해 `VsInputWrapper`와 통합
- 자동완성 및 읽기 전용 모드

## 기본 사용법

```html
<template>
    <vs-textarea v-model="text" label="설명" placeholder="설명을 입력하세요..." />
</template>

<script setup>
import { ref } from 'vue';
const text = ref('');
</script>
```

### 유효성 검사

```html
<template>
    <vs-textarea
        v-model="text"
        label="소개"
        required
        :min="10"
        :max="200"
        :messages="[{ state: 'info', text: '10~200자를 입력하세요' }]"
    />
</template>
```

### 읽기 전용 모드

```html
<template>
    <vs-textarea v-model="text" label="메모" readonly />
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트 색상 스키마 |
| `styleSet` | `string \| VsTextareaStyleSet` | | | 컴포넌트 커스텀 스타일 세트 |
| `autocomplete` | `boolean` | `false` | | 브라우저 자동완성 활성화 |
| `changed` | `boolean` | `false` | | changed 상태의 v-model |
| `disabled` | `boolean` | `false` | | textarea 비활성화 |
| `grid` | `string \| number \| Breakpoints` | | | 그리드 열 스팬 |
| `hidden` | `boolean` | `false` | | 컴포넌트 숨김 |
| `id` | `string` | `''` | | HTML `id` 속성 |
| `label` | `string` | `''` | | 레이블 텍스트 |
| `max` | `number \| string` | | | 최대 글자 수 |
| `messages` | `Message[]` | `[]` | | 유효성 검사 메시지 |
| `min` | `number \| string` | | | 최소 글자 수 |
| `modelValue` | `string` | `''` | | v-model 값 |
| `modelModifiers` | `StringModifiers` | `{}` | | 문자열 수정자 플래그 |
| `name` | `string` | `''` | | HTML `name` 속성 |
| `noDefaultRules` | `boolean` | `false` | | 내장 min/max/required 규칙 비활성화 |
| `noLabel` | `boolean` | `false` | | 레이블 영역 숨김 |
| `noMessages` | `boolean` | `false` | | 메시지 영역 숨김 |
| `placeholder` | `string` | `''` | | 플레이스홀더 텍스트 |
| `readonly` | `boolean` | `false` | | 읽기 전용 모드 |
| `required` | `boolean` | `false` | | 필수 입력 필드로 표시 |
| `rules` | `Rule[]` | `[]` | | 커스텀 유효성 검사 규칙 |
| `state` | `UIState` | `'idle'` | | UI 상태 (`idle`, `success`, `warning`, `error`) |
| `valid` | `boolean` | `false` | | valid 상태의 v-model |
| `width` | `string \| number \| Breakpoints` | | | 컴포넌트 너비 |

## 타입

```typescript
interface VsTextareaStyleSet {
    textarea?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `wrapper`는 [`VsInputWrapperStyleSet`](../vs-input-wrapper/README.ko.md)을 사용합니다.

### StyleSet 예시

```html
<template>
    <vs-textarea
        v-model="text"
        label="설명"
        :style-set="{
            textarea: {
                minHeight: '6rem',
                fontFamily: 'monospace',
                fontSize: '0.875rem',
            },
        }"
    />
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `update:modelValue` | `string` | 값 변경 시 발생 |
| `update:changed` | `boolean` | changed 상태 업데이트 시 발생 |
| `update:valid` | `boolean` | valid 상태 업데이트 시 발생 |
| `change` | `string` | 값 변경 시 발생 |
| `focus` | `FocusEvent` | 포커스 시 발생 |
| `blur` | `FocusEvent` | 포커스 해제 시 발생 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `label` | 커스텀 레이블 내용 |
| `messages` | 커스텀 메시지 내용 |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
| `focus` | | textarea에 포커스 |
| `blur` | | textarea의 포커스 해제 |
| `validate` | | 유효성 검사 실행 |
| `clear` | | 값 초기화 |
| `select` | | textarea의 모든 텍스트 선택 |
