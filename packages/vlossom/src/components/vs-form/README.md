# VsForm

폼 요소들을 관리하고 검증하는 그리드 기반 폼 컴포넌트입니다. FormStore를 통한 상태 관리와 검증 기능을 제공하며, CSS Grid 기반의 반응형 레이아웃을 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 폼

```html
<template>
    <vs-form
        ref="form-ref"
    >
        <vs-input v-model="formData.username" label="사용자명" />
        <vs-input v-model="formData.email" type="email" label="이메일" />
        <vs-input v-model="formData.password" type="password" label="비밀번호" />
    </vs-form>
</template>

<script setup>
    const formRef = useTemplateRef('form-ref');

    function validation() {
        console.log(formRef.value.changed);
        console.log(formRef.value.valid);
        return formRef.value.validate();
    }
</script>
```

### 그리드 레이아웃 설정

```html
<template>
    <vs-form :grid-size="6" :column-gap="16" :row-gap="8">
        <vs-input v-model="userData.firstName" label="이름" grid="3" />
        <vs-input v-model="userData.lastName" label="성" grid="3" />
        <vs-input v-model="userData.email" label="이메일" grid="4" />
        <vs-input v-model="userData.phone" label="전화번호" grid="2" />
    </vs-form>
</template>
```

### form 전체 readonly 및 disabled 설정

```html
<template>
    <vs-form readonly>
        <vs-input v-model="userData.name" label="이름" />
        ...
    </vs-form>

    <vs-form disabled>
        <vs-input v-model="formData.title" label="제목" />
        ...
    </vs-form>
</template>
```

## Props

| Prop        | Type               | Default | Required | Description            |
| ----------- | ------------------ | ------- | -------- | ---------------------- |
| `gridSize`  | `string \| number` | -       | -        | 그리드 컬럼 수         |
| `columnGap` | `string \| number` | -       | -        | 컬럼 간 간격           |
| `rowGap`    | `string \| number` | -       | -        | 행 간 간격             |
| `disabled`  | `boolean`          | `false` | -        | 폼 전체 비활성화 상태  |
| `readonly`  | `boolean`          | `false` | -        | 폼 전체 읽기 전용 상태 |

## Slots

| Slot      | Description                |
| --------- | -------------------------- |
| `default` | 폼 내부에 배치할 폼 요소들 |

## Methods

| Method     | Parameters | Description                     |
| ---------- | ---------- | ------------------------------- |
| `validate` | -          | 폼 검증을 수행하고 결과를 반환  |
| `clear`    | -          | 폼 내 모든 입력 요소들을 초기화 |

## Events

| Event   | Payload    | Description                          |
| ------- | ---------- | ------------------------------------ |
| `error` | `string[]` | 검증 실패 시 유효하지 않은 필드 ID들 |

## 특징

- **그리드 기반 레이아웃**: CSS Grid를 사용한 반응형 폼 레이아웃
- **상태 관리**: FormStore를 provide하여 하위 컴포넌트들과 폼 상태 공유
- **검증 시스템**: 실시간 검증과 통합 검증 기능
- **전역 상태 제어**: 폼 전체에 disabled/readonly 상태 적용 가능

## CSS 변수

컴포넌트는 VsGrid의 CSS 변수를 상속받습니다:

- `--vs-grid-width`: 폼 컴포넌트 너비
- `--vs-grid-height`: 폼 컴포넌트 높이
- `--vs-grid-gridSize`: 그리드 컬럼 수
- `--vs-grid-columnGap`: 컬럼 간격
- `--vs-grid-rowGap`: 행 간격
