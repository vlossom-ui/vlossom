> For English documentation, see [README.md](./README.md).

# VsCheckbox

단일 및 다중 선택 모드를 지원하며, 선택적 라벨과 유효성 검사 기능을 갖춘 체크박스 폼 입력 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- 단일 체크박스 또는 `VsCheckboxSet`을 통한 그룹 선택
- 커스텀 `trueValue` / `falseValue`를 지원하는 `v-model` 바인딩
- 배열 기반 `v-model`을 사용하는 다중 선택 모드
- 불확정(indeterminate) 상태 지원
- 커스텀 규칙과 필수 항목 체크를 포함한 내장 유효성 검사
- 값 변경 전 비동기 확인을 위한 `beforeChange` 훅

## Basic Usage

```html
<template>
    <vs-checkbox v-model="checked" check-label="약관에 동의합니다" />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const checked = ref(false);
</script>
```

### 체크박스 그룹 (VsCheckboxSet)

```html
<template>
    <vs-checkbox-set
        v-model="selectedFruits"
        label="과일"
        :options="['사과', '바나나', '체리']"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const selectedFruits = ref([]);
</script>
```

### 유효성 검사

```html
<template>
    <vs-checkbox v-model="agreed" check-label="동의합니다" required />
</template>
```

### Before Change 훅

```html
<template>
    <vs-checkbox
        v-model="value"
        check-label="확인"
        :before-change="confirmChange"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';
const value = ref(false);

async function confirmChange(from, to) {
    return window.confirm(`${from}에서 ${to}로 변경하시겠습니까?`);
}
</script>
```

## Props

### VsCheckbox Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | 컴포넌트 색상 테마 |
| `styleSet` | `string \| VsCheckboxStyleSet` | | | 커스텀 스타일 세트 |
| `width` | `string \| number \| Breakpoints` | | | 컴포넌트 너비 |
| `grid` | `string \| number \| Breakpoints` | | | 그리드 컬럼 스팬 |
| `beforeChange` | `(from, to, optionValue) => Promise<boolean> \| null` | `null` | | 값 변경 전 호출되는 비동기 훅 |
| `checked` | `boolean` | `false` | | 초기 체크 상태 |
| `checkLabel` | `string` | `''` | | 체크박스 옆에 표시되는 라벨 |
| `disabled` | `boolean` | `false` | | 체크박스 비활성화 |
| `hidden` | `boolean` | `false` | | 컴포넌트 숨김 |
| `id` | `string` | `''` | | HTML id 속성 |
| `indeterminate` | `boolean` | `false` | | 불확정 상태 표시 |
| `label` | `string` | `''` | | 필드 라벨 |
| `messages` | `Message[]` | `[]` | | 유효성 검사 메시지 |
| `modelValue` | `any` | `false` | | v-model 값 |
| `multiple` | `boolean` | `false` | | 다중 선택 모드 활성화 |
| `name` | `string` | `''` | | HTML name 속성 |
| `noDefaultRules` | `boolean` | `false` | | 기본 유효성 검사 규칙 비활성화 |
| `noLabel` | `boolean` | `false` | | 라벨 숨김 |
| `noMessages` | `boolean` | `false` | | 유효성 검사 메시지 숨김 |
| `readonly` | `boolean` | `false` | | 읽기 전용으로 설정 |
| `required` | `boolean` | `false` | | 필수 항목으로 표시 |
| `rules` | `Rule[]` | `[]` | | 커스텀 유효성 검사 규칙 |
| `state` | `UIState` | `'idle'` | | 유효성 검사 상태 |
| `trueValue` | `any` | `true` | | 체크 시 값 |
| `falseValue` | `any` | `false` | | 미체크 시 값 |

### VsCheckboxSet Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | 컴포넌트 색상 테마 |
| `styleSet` | `string \| VsCheckboxSetStyleSet` | | | 커스텀 스타일 세트 |
| `width` | `string \| number \| Breakpoints` | | | 컴포넌트 너비 |
| `grid` | `string \| number \| Breakpoints` | | | 그리드 컬럼 스팬 |
| `beforeChange` | `(from, to, optionValue) => Promise<boolean> \| null` | `null` | | 값 변경 전 호출되는 비동기 훅 |
| `disabled` | `boolean` | `false` | | 세트 내 모든 체크박스 비활성화 |
| `hidden` | `boolean` | `false` | | 컴포넌트 숨김 |
| `id` | `string` | `''` | | HTML id 속성 |
| `label` | `string` | `''` | | 필드 라벨 |
| `max` | `number \| null` | `null` | | 선택 가능한 최대 항목 수 |
| `messages` | `Message[]` | `[]` | | 유효성 검사 메시지 |
| `min` | `number \| null` | `null` | | 선택해야 하는 최소 항목 수 |
| `modelValue` | `any[]` | `[]` | | v-model 바인딩 (선택된 값의 배열) |
| `name` | `string` | `''` | | HTML name 속성 |
| `noDefaultRules` | `boolean` | `false` | | 기본 유효성 검사 규칙 비활성화 |
| `noLabel` | `boolean` | `false` | | 라벨 숨김 |
| `noMessages` | `boolean` | `false` | | 유효성 검사 메시지 숨김 |
| `options` | `any[]` | `[]` | | 체크박스로 표시할 옵션 배열 |
| `optionLabel` | `string` | `'label'` | | 각 옵션의 라벨로 사용할 키 |
| `optionValue` | `string` | `'value'` | | 각 옵션의 값으로 사용할 키 |
| `readonly` | `boolean` | `false` | | 모든 체크박스를 읽기 전용으로 설정 |
| `required` | `boolean` | `false` | | 필수 항목으로 표시 |
| `rules` | `Rule[]` | `[]` | | 커스텀 유효성 검사 규칙 |
| `state` | `UIState` | `'idle'` | | 유효성 검사 상태 |
| `vertical` | `boolean` | `false` | | 체크박스를 수직으로 배치 |

## Types

```typescript
interface VsCheckboxStyleSet {
    variables?: {
        checkboxCheckedColor?: string;
        checkboxColor?: string;
        checkboxSize?: string;
    };
    checkbox?: CSSProperties;
    checkboxLabel?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}

interface VsCheckboxSetStyleSet {
    component?: CSSProperties;
    checkbox?: Omit<VsCheckboxStyleSet, 'wrapper'>;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
> `wrapper`는 `VsInputWrapperStyleSet`을 사용합니다. 자세한 내용은 [VsInputWrapper 문서](../vs-input-wrapper/README.md)를 참고하세요.

### StyleSet 사용 예시

```html
<template>
    <vs-checkbox
        v-model="checked"
        check-label="커스텀 체크박스"
        :style-set="{
            variables: {
                checkboxSize: '1.5rem',
                checkboxColor: '#e0e0e0',
                checkboxCheckedColor: '#6200ea',
            },
            checkboxLabel: {
                fontSize: '1rem',
                fontWeight: '500',
            },
        }"
    />
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |
| `update:modelValue` | `any` | 값이 변경될 때 발생 |
| `update:changed` | `boolean` | 변경 상태 업데이트 시 발생 |
| `update:valid` | `boolean` | 유효성 검사 상태 업데이트 시 발생 |
| `change` | `any` | 값 변경 시 발생 |
| `focus` | `FocusEvent` | 체크박스가 포커스를 받을 때 발생 |
| `blur` | `FocusEvent` | 체크박스가 포커스를 잃을 때 발생 |
| `toggle` | `boolean, MouseEvent` | 토글 후 발생; 새로운 체크 상태와 마우스 이벤트가 페이로드 |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | — |
| `label` | 커스텀 라벨 콘텐츠 |
| `check-label` | 체크박스 옆의 커스텀 콘텐츠 |
| `messages` | 커스텀 유효성 검사 메시지 콘텐츠 |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| `clear` | — | 체크박스 값을 초기화합니다 |
| `validate` | — | 유효성 검사를 실행하고 결과를 반환합니다 |
| `focus` | — | 체크박스 입력 요소에 포커스를 줍니다 |
| `blur` | — | 체크박스 입력 요소의 포커스를 제거합니다 |
| `toggle` | — | 체크 상태를 전환합니다 |
