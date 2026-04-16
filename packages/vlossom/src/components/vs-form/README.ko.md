> For English documentation, see [README.md](./README.md).

# VsForm

모든 자식 입력 컴포넌트에 유효성 검사 상태를 관리하고 `disabled`/`readonly` 상태를 전파하는 폼 컨테이너 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 모든 자식 `Vlossom` 폼 입력이 구독할 수 있는 폼 스토어 컨텍스트 제공
- 모든 자식 입력의 유효성 검사를 트리거하는 중앙화된 `validate()` 메서드
- 모든 자식 입력을 초기화하는 중앙화된 `clear()` 메서드
- 폼 수준 상태 확인을 위한 `valid` 및 `changed` 계산 속성
- 모든 자식 폼 컴포넌트에 `disabled` 및 `readonly` 상태 전파
- 반응형 레이아웃을 위해 내부적으로 `VsGrid`를 사용하여 `<form>` 요소로 렌더링

## 기본 사용법

```html
<template>
    <vs-form ref="formRef" @error="onError">
        <vs-input v-model="name" label="이름" required :grid="{ sm: 12, md: 6 }" />
        <vs-input v-model="email" label="이메일" required :grid="{ sm: 12, md: 6 }" />
        <vs-button @click="submit">제출</vs-button>
    </vs-form>
</template>

<script setup>
import { ref } from 'vue';
const formRef = ref(null);
const name = ref('');
const email = ref('');

async function submit() {
    const isValid = await formRef.value.validate();
    if (isValid) {
        console.log('폼이 유효합니다');
    }
}

function onError(invalidIds) {
    console.log('유효하지 않은 필드:', invalidIds);
}
</script>
```

### 비활성화된 폼

```html
<template>
    <vs-form :disabled="isDisabled">
        <vs-input v-model="value" label="읽기 전용 필드" />
    </vs-form>
</template>

<script setup>
import { ref } from 'vue';
const isDisabled = ref(true);
const value = ref('');
</script>
```

### 그리드 레이아웃 사용

```html
<template>
    <vs-form :grid-size="12" :column-gap="16" :row-gap="8">
        <vs-input v-model="firstName" label="이름" :grid="6" />
        <vs-input v-model="lastName" label="성" :grid="6" />
    </vs-form>
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `gridSize` | `number \| string` | | | 그리드 열 수 (기본값: 12) |
| `columnGap` | `number \| string` | | | 그리드 열 사이의 간격 |
| `rowGap` | `number \| string` | | | 그리드 행 사이의 간격 |
| `disabled` | `boolean` | `false` | | 모든 자식 폼 입력 비활성화 |
| `readonly` | `boolean` | `false` | | 모든 자식 폼 입력을 읽기 전용으로 만들기 |

## 타입

VsForm은 `StyleSet` 인터페이스가 없습니다.

### StyleSet 예시

VsForm은 `styleSet` prop을 사용하지 않습니다. 레이아웃 제어에는 `VsGrid` props(`gridSize`, `columnGap`, `rowGap`)를 사용하세요.

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `error` | `string[]` | 폼이 유효하지 않을 때 `validate()` 후 발생. 페이로드에는 유효하지 않은 필드의 id가 포함됨 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `default` | 폼 콘텐츠 — Vlossom 입력 컴포넌트를 여기에 배치 |

## 메서드

| 메서드 | 파라미터 | 설명 |
| ------ | -------- | ---- |
| `validate` | - | 모든 자식 입력의 유효성 검사 트리거. 폼이 유효한지 여부를 나타내는 `Promise<boolean>` 반환 |
| `clear` | - | 모든 자식 입력을 초기 상태로 초기화 |
| `valid` | - | 계산 속성 (`ComputedRef<boolean>`) — 모든 자식 입력이 유효할 때 `true` |
| `changed` | - | 계산 속성 (`ComputedRef<boolean>`) — 자식 입력 중 하나라도 변경되었을 때 `true` |
