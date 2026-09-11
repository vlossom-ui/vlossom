> For English documentation, see [README.md](./README.md).

# VsFileInput

클릭 또는 키보드(Enter/Space)로 파일 다이얼로그를 열고 선택된 파일을 칩으로 표시하는 인풋 형태의 파일 선택 컴포넌트입니다.

**사용 가능 버전**: 2.1.0+

## 기능

- 단일 및 복수 파일 선택 모드 지원
- 폴더 선택 모드 (`webkitdirectory`)
- 선택된 파일을 닫기 버튼이 있는 칩으로 표시
- `collapseChips`로 파일이 많을 때 칩 접기
- 클릭 및 키보드(Enter/Space) 파일 다이얼로그 열기
- 내장 유효성 검사 지원 (필수값, 파일 타입)
- `prepend` 슬롯으로 아이콘 커스터마이징 가능

## 기본 사용법

```html
<template>
    <vs-file-input v-model="files" label="첨부 파일" placeholder="파일을 선택하세요" />
</template>

<script setup>
import { ref } from 'vue';
const files = ref([]);
</script>
```

### 복수 파일 선택

```html
<template>
    <vs-file-input v-model="files" multiple label="첨부 파일" placeholder="파일을 선택하세요" />
</template>
```

### 파일 타입 제한

```html
<template>
    <!-- 이미지만 -->
    <vs-file-input v-model="files" accept="image/*" label="이미지" />

    <!-- PDF만 -->
    <vs-file-input v-model="files" accept=".pdf" label="PDF" />
</template>
```

### 칩 접기

```html
<template>
    <vs-file-input v-model="files" multiple collapse-chips label="첨부 파일" />
</template>
```

### 폼 연동

```html
<template>
    <vs-form ref="formRef">
        <vs-file-input v-model="files" label="필수 파일" required />
        <vs-button @click="formRef.validate()">제출</vs-button>
    </vs-form>
</template>
```

## Props

| Prop             | Type                                                    | Default  | Required | 설명                                                            |
| ---------------- | ------------------------------------------------------- | -------- | -------- | --------------------------------------------------------------- |
| `colorScheme`    | `string`                                                | -        | -        | 컴포넌트의 색상 스킴                                            |
| `styleSet`       | `string \| VsFileInputStyleSet`                         | -        | -        | 컴포넌트에 적용할 커스텀 스타일 세트                            |
| `disabled`       | `boolean`                                               | `false`  | -        | 컴포넌트 비활성화                                               |
| `hidden`         | `boolean`                                               | `false`  | -        | 컴포넌트 숨김                                                   |
| `id`             | `string`                                                | `''`     | -        | HTML id 속성                                                    |
| `label`          | `string`                                                | `''`     | -        | 레이블 텍스트                                                   |
| `noLabel`        | `boolean`                                               | `false`  | -        | 레이블 숨김                                                     |
| `noMessages`     | `boolean`                                               | `false`  | -        | 유효성 검사 메시지 숨김                                         |
| `required`       | `boolean`                                               | `false`  | -        | 필수 입력 필드로 지정                                           |
| `messages`       | `Message[]`                                             | `[]`     | -        | 유효성 검사 메시지                                              |
| `name`           | `string`                                                | `''`     | -        | HTML name 속성                                                  |
| `noDefaultRules` | `boolean`                                               | `false`  | -        | 내장 유효성 검사 규칙 비활성화                                  |
| `placeholder`    | `string`                                                | `''`     | -        | 파일이 없을 때 표시되는 플레이스홀더                            |
| `readonly`       | `boolean`                                               | `false`  | -        | 읽기 전용으로 설정                                              |
| `rules`          | `Rule[]`                                                | `[]`     | -        | 커스텀 유효성 검사 규칙                                         |
| `state`          | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'` | `'idle'` | -        | 유효성 검사 상태                                                |
| `width`          | `string \| number \| Breakpoints`                       | -        | -        | 반응형 너비                                                     |
| `grid`           | `string \| number \| Breakpoints`                       | -        | -        | 그리드 컬럼 스팬                                                |
| `accept`         | `string`                                                | `''`     | -        | 허용 파일 타입 (native accept 속성)                             |
| `collapseChips`  | `boolean`                                               | `false`  | -        | 파일이 2개 이상일 때 첫 번째 칩만 표시하고 나머지는 +N으로 축약 |
| `directory`      | `boolean`                                               | `false`  | -        | 폴더 선택 모드 활성화 (webkitdirectory)                         |
| `multiple`       | `boolean`                                               | `false`  | -        | 복수 파일 선택 허용                                             |
| `noClear`        | `boolean`                                               | `false`  | -        | 전체 클리어 버튼 숨김                                           |
| `size`           | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'`                  | `'md'`   | -        | 컴포넌트 크기                                                   |
| `modelValue`     | `File[]`                                                | `[]`     | -        | 선택된 파일 목록 (v-model)                                      |

## Types

```typescript
interface VsFileInputStyleSet extends CSSProperties {
    $prepend?: CSSProperties;
    $append?: CSSProperties;
    $chip?: VsChipStyleSet;
    $wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `$wrapper`는 [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types), `$chip`은 [VsChipStyleSet](../vs-chip/README.md#types)을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-file-input
        v-model="files"
        label="첨부 파일"
        :style-set="{ $chip: { backgroundColor: '#e0f2fe' } }"
    />
</template>
```

## Events

| Event               | Payload      | 설명                                      |
| ------------------- | ------------ | ----------------------------------------- |
| `update:modelValue` | `File[]`     | 선택 파일이 변경될 때 발생                |
| `update:changed`    | `boolean`    | changed 상태가 업데이트될 때 발생         |
| `update:valid`      | `boolean`    | 유효성 검사 상태가 업데이트될 때 발생     |
| `change`            | `File[]`     | 사용자 인터랙션으로 파일이 변경될 때 발생 |
| `focus`             | `FocusEvent` | 컴포넌트가 포커스를 받을 때 발생          |
| `blur`              | `FocusEvent` | 컴포넌트가 포커스를 잃을 때 발생          |
| `clear`             | `File[]`     | 전체 클리어 시 클리어 직전 값과 함께 발생 |

## Slots

| Slot       | 설명                                               |
| ---------- | -------------------------------------------------- |
| `label`    | 커스텀 레이블 콘텐츠                               |
| `prepend`  | prepend 영역 커스텀 콘텐츠 (기본 클립 아이콘 대체) |
| `append`   | append 영역 커스텀 콘텐츠                          |
| `messages` | 커스텀 유효성 검사 메시지                          |

## Methods

| Method     | Parameters | 설명                            |
| ---------- | ---------- | ------------------------------- |
| `focus`    | -          | 컴포넌트에 포커스               |
| `blur`     | -          | 컴포넌트 포커스 해제            |
| `validate` | -          | 유효성 검사 실행                |
| `clear`    | -          | 선택 파일 전체 클리어           |
| `reset`    | -          | 선택 파일을 초기값으로 되돌리기 |
