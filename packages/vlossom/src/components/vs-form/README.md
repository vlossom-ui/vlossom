# VsForm

폼 요소들을 관리하고 검증하는 그리드 기반 폼 컴포넌트입니다. 상태 관리와 검증 기능을 제공하며, 반응형 그리드 레이아웃을 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 폼

```html
<template>
    <vs-form
        ref="form-ref"
        v-model:valid="isValid"
        v-model:changed="isChanged"
    >
        <vs-input v-model="formData.username" label="사용자명" />
        <vs-input v-model="formData.email" type="email" label="이메일" />
        <vs-input v-model="formData.password" type="password" label="비밀번호" />
    </vs-form>
</template>

<script setup>
    const formRef = useTemplateRef('form-ref');

    function validation() {
        return formRef.value.validate();
    }
</script>
```

### form 전체 readonly 및 disabled 설정

```html
<template>
    <vs-form readonly>
        <vs-input v-model="userData.name" label="이름" />
        <vs-input v-model="userData.email" label="이메일" />
        <vs-select v-model="userData.department" label="부서" :options="departments" />
    </vs-form>

    <vs-form disabled>
        <vs-input v-model="formData.title" label="제목" />
        <vs-input v-model="formData.content" label="내용" />
        <vs-button type="submit" :loading="loading">저장</vs-button>
    </vs-form>
</template>
```

## Props

| Prop        | Type               | Default | Required | Description              |
| ----------- | ------------------ | ------- | -------- | ------------------------ |
| `gridSize`  | `string \| number` | -       | -        | 그리드 컬럼 수 (기본 12) |
| `columnGap` | `string \| number` | -       | -        | 컬럼 간 간격 (기본 0)    |
| `rowGap`    | `string \| number` | -       | -        | 행 간 간격 (기본 0)      |
| `disabled`  | `boolean`          | `false` | -        | 폼 전체 비활성화 상태    |
| `readonly`  | `boolean`          | `false` | -        | 폼 전체 읽기 전용 상태   |
| `valid`     | `boolean`          | `false` | -        | 폼 검증 상태 (v-model)   |
| `changed`   | `boolean`          | `false` | -        | 폼 변경 상태 (v-model)   |

## Events

| Event            | Payload    | Description                          |
| ---------------- | ---------- | ------------------------------------ |
| `update:valid`   | `boolean`  | 폼 검증 상태가 변경될 때 발생        |
| `update:changed` | `boolean`  | 폼 내용이 변경될 때 발생             |
| `error`          | `string[]` | 검증 실패 시 유효하지 않은 필드 ID들 |

## Slots

| Slot      | Description                |
| --------- | -------------------------- |
| `default` | 폼 내부에 배치할 폼 요소들 |

## Methods

| Method     | Parameters | Description                     |
| ---------- | ---------- | ------------------------------- |
| `validate` | -          | 폼 검증을 수행하고 결과를 반환  |
| `clear`    | -          | 폼 내 모든 입력 요소들을 초기화 |

## 특징

- **그리드 기반 레이아웃**: CSS Grid를 사용한 반응형 폼 레이아웃
- **상태 관리**: FormStore를 provide 해서 form 상태 관리
- **검증 시스템**: 실시간 검증과 통합 검증 기능

## CSS 변수

컴포넌트는 VsGrid의 CSS 변수를 상속받습니다:

- `--vs-grid-width`: 폼 컴포넌트 너비
- `--vs-grid-height`: 폼 컴포넌트 높이
- `--vs-grid-gridSize`: 그리드 컬럼 수
- `--vs-grid-columnGap`: 컬럼 간격
- `--vs-grid-rowGap`: 행 간격
