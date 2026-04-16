> For English documentation, see [README.md](./README.md).

# VsSelect

검색, 그룹화, 유효성 검사를 지원하는 단일 및 다중 선택 드롭다운 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 단일 및 다중 선택 모드 지원
- 대소문자 구분 및 정규식 옵션을 포함한 내장 검색 기능
- `groupBy` 함수를 통한 옵션 그룹화
- 다중 선택 모드의 전체 선택 체크박스
- 다중 선택 모드에서 선택 값을 닫기 버튼이 있는 칩으로 표시
- 내장 유효성 검사 지원 (필수값, 최소/최대 선택 수)
- 드롭다운 목록 내 키보드 탐색
- 옵션, 선택된 옵션, 칩 스타일 커스터마이징 가능

## 기본 사용법

```html
<template>
    <vs-select v-model="selected" :options="options" label="과일 선택" />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
const options = ['사과', '바나나', '체리'];
</script>
```

### 다중 선택

```html
<template>
    <vs-select v-model="selected" :options="options" multiple label="과일 선택 (복수)" />
</template>
```

### 검색 기능 사용

```html
<template>
    <vs-select v-model="selected" :options="options" :search="true" label="검색하여 선택" />
</template>
```

### 커스텀 레이블이 있는 객체 옵션

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        option-label="name"
        option-value="id"
        label="사람 선택"
    />
</template>

<script setup>
import { ref } from 'vue';
const selected = ref(null);
const options = [
    { id: 1, name: '앨리스' },
    { id: 2, name: '밥' },
];
</script>
```

## Props

| Prop              | Type                                                             | Default               | Required | 설명                                                    |
| ----------------- | ---------------------------------------------------------------- | --------------------- | -------- | ------------------------------------------------------- |
| `colorScheme`     | `string`                                                         | -                     | -        | 컴포넌트의 색상 스킴                                    |
| `styleSet`        | `string \| VsSelectStyleSet`                                     | -                     | -        | 컴포넌트에 적용할 커스텀 스타일 세트                    |
| `disabled`        | `boolean`                                                        | `false`               | -        | 셀렉트 비활성화                                         |
| `hidden`          | `boolean`                                                        | `false`               | -        | 컴포넌트 숨김                                           |
| `id`              | `string`                                                         | `''`                  | -        | HTML id 속성                                            |
| `label`           | `string`                                                         | `''`                  | -        | 셀렉트 레이블 텍스트                                    |
| `noLabel`         | `boolean`                                                        | `false`               | -        | 레이블 숨김                                             |
| `noMessages`      | `boolean`                                                        | `false`               | -        | 유효성 검사 메시지 숨김                                 |
| `required`        | `boolean`                                                        | `false`               | -        | 필수 입력 필드로 지정                                   |
| `messages`        | `Message[]`                                                      | `[]`                  | -        | 유효성 검사 메시지                                      |
| `name`            | `string`                                                         | `''`                  | -        | HTML name 속성                                          |
| `noDefaultRules`  | `boolean`                                                        | `false`               | -        | 내장 유효성 검사 규칙 비활성화                          |
| `readonly`        | `boolean`                                                        | `false`               | -        | 셀렉트를 읽기 전용으로 설정                             |
| `rules`           | `Rule[]`                                                         | `[]`                  | -        | 커스텀 유효성 검사 규칙                                 |
| `state`           | `'idle' \| 'info' \| 'success' \| 'warning' \| 'error'`        | `'idle'`              | -        | 유효성 검사 상태                                        |
| `width`           | `string \| number \| Breakpoints`                                | -                     | -        | 반응형 너비                                             |
| `grid`            | `string \| number \| Breakpoints`                                | -                     | -        | 그리드 컬럼 스팬                                        |
| `options`         | `any[]`                                                          | `[]`                  | -        | 옵션 값 또는 객체의 배열                                |
| `optionLabel`     | `string`                                                         | `''`                  | -        | 옵션이 객체일 때 레이블에 사용할 키 이름                |
| `optionValue`     | `string`                                                         | `''`                  | -        | 옵션이 객체일 때 값에 사용할 키 이름                    |
| `groupBy`         | `(option: any, index: number) => string \| null`                 | `null`                | -        | 옵션을 그룹화하는 함수                                  |
| `groupOrder`      | `string[]`                                                       | `[]`                  | -        | 그룹 순서                                               |
| `min`             | `number \| string`                                               | `0`                   | -        | 최소 선택 수 (다중 선택 모드)                           |
| `max`             | `number \| string`                                               | `Number.MAX_SAFE_INTEGER` | -    | 최대 선택 수 (다중 선택 모드)                           |
| `search`          | `boolean \| SearchProps`                                         | `false`               | -        | 내장 검색 기능 활성화                                   |
| `closableChips`   | `boolean`                                                        | `false`               | -        | 선택된 칩에 닫기 버튼 표시                              |
| `collapseChips`   | `boolean`                                                        | `false`               | -        | 선택된 칩을 개수 표시로 접기                            |
| `multiple`        | `boolean`                                                        | `false`               | -        | 다중 선택 모드 활성화                                   |
| `noClear`         | `boolean`                                                        | `false`               | -        | 초기화 버튼 숨김                                        |
| `optionsDisabled` | `boolean \| ((option: any, index: number, options: any[]) => boolean)` | `false`       | -        | 개별 옵션 비활성화                                      |
| `selectAll`       | `boolean`                                                        | `false`               | -        | 전체 선택 체크박스 표시 (다중 선택 모드)                |
| `modelValue`      | `any`                                                            | `null`                | -        | 선택된 값 (v-model)                                     |

## Types

```typescript
interface VsSelectStyleSet {
    variables?: {
        height?: string;
        focused?: {
            border?: string;
            borderRadius?: string;
            backgroundColor?: string;
        };
    };
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
    chip?: VsChipStyleSet;
    selectAllCheckbox?: VsCheckboxStyleSet;
    options?: VsGroupedListStyleSet;
    option?: CSSProperties;
    selectedOption?: CSSProperties;
}
```

> [!NOTE]
> `wrapper`는 [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types), `chip`은 [VsChipStyleSet](../vs-chip/README.md#types), `selectAllCheckbox`는 [VsCheckboxStyleSet](../vs-checkbox/README.md#types), `options`는 [VsGroupedListStyleSet](../vs-grouped-list/README.md#types)을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-select
        v-model="selected"
        :options="options"
        :style-set="{
            variables: {
                height: '2.5rem',
                focused: { border: '2px solid #6366f1' },
            },
            option: { padding: '0.5rem 1rem' },
            selectedOption: { backgroundColor: '#ede9fe', fontWeight: 'bold' },
        }"
    />
</template>
```

## Events

| Event               | Payload       | 설명                                       |
| ------------------- | ------------- | ------------------------------------------ |
| `update:modelValue` | `any`         | 선택 값이 변경될 때 발생                   |
| `update:changed`    | `boolean`     | changed 상태가 업데이트될 때 발생          |
| `update:valid`      | `boolean`     | 유효성 검사 상태가 업데이트될 때 발생      |
| `change`            | `any`         | 선택 값이 변경될 때 발생                   |
| `focus`             | `FocusEvent`  | 트리거가 포커스를 받을 때 발생             |
| `blur`              | `FocusEvent`  | 트리거가 포커스를 잃을 때 발생             |
| `click-option`      | `OptionItem`  | 옵션이 클릭될 때 발생                      |
| `open`              | -             | 드롭다운이 열릴 때 발생                    |
| `close`             | -             | 드롭다운이 닫힐 때 발생                    |
| `clear`             | -             | 선택 값이 초기화될 때 발생                 |

## Slots

| Slot               | 설명                                                              |
| ------------------ | ----------------------------------------------------------------- |
| `label`            | 커스텀 레이블 콘텐츠                                              |
| `options-header`   | 옵션 목록 위의 커스텀 콘텐츠                                      |
| `options-footer`   | 옵션 목록 아래의 커스텀 콘텐츠                                    |
| `group`            | 커스텀 그룹 헤더; 그룹 슬롯 props 수신                            |
| `option`           | 커스텀 옵션 콘텐츠; `{ ...itemSlotProps, selected: boolean }` 수신 |
| `messages`         | 커스텀 유효성 검사 메시지                                         |

## Methods

| Method     | Parameters | 설명                        |
| ---------- | ---------- | --------------------------- |
| `focus`    | -          | 셀렉트 트리거에 포커스      |
| `blur`     | -          | 셀렉트 트리거 포커스 해제   |
| `validate` | -          | 유효성 검사 실행            |
| `clear`    | -          | 선택 값 초기화              |
