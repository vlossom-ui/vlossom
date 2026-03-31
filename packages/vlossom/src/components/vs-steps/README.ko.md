> For English documentation, see [README.md](./README.md).

# VsSteps

진행 상황을 추적하는 단계 시퀀스를 표시하는 스텝 인디케이터 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- 이름이 있는 단계 시퀀스를 수평 또는 수직으로 표시
- 단계 사이에 애니메이션 진행 바로 진행 상황 추적
- 불리언 또는 단계별 함수를 통한 비활성화 단계 지원
- 단계 간 키보드 탐색 (화살표 키)
- 단계, 활성 단계, 레이블, 진행 바 스타일 커스터마이징 가능
- `width` 및 `grid` prop을 통한 반응형 레이아웃 지원

## 기본 사용법

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" />
</template>

<script setup>
import { ref } from 'vue';
const currentStep = ref(0);
const steps = ['1단계', '2단계', '3단계', '4단계'];
</script>
```

### 수직 레이아웃

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" vertical height="12rem" />
</template>
```

### 레이블 없이 사용

```html
<template>
    <vs-steps v-model="currentStep" :steps="steps" no-label />
</template>
```

### 비활성화 단계 사용

```html
<template>
    <vs-steps
        v-model="currentStep"
        :steps="steps"
        :disabled="(step, index) => index === 2"
    />
</template>
```

## Props

| Prop          | Type                                                          | Default  | Required | 설명                                                    |
| ------------- | ------------------------------------------------------------- | -------- | -------- | ------------------------------------------------------- |
| `colorScheme` | `string`                                                      | -        | -        | 컴포넌트의 색상 스킴                                    |
| `styleSet`    | `string \| VsStepsStyleSet`                                   | -        | -        | 컴포넌트에 적용할 커스텀 스타일 세트                    |
| `width`       | `string \| number \| Breakpoints`                             | -        | -        | 반응형 너비                                             |
| `grid`        | `string \| number \| Breakpoints`                             | -        | -        | 그리드 컬럼 스팬                                        |
| `height`      | `string`                                                      | -        | -        | 스텝 컨테이너의 높이 (수직 모드에서 사용)               |
| `disabled`    | `boolean \| ((step: string, index: number) => boolean)`       | `false`  | -        | 단계 비활성화; 불리언 또는 단계별 함수 사용 가능        |
| `gap`         | `string \| number`                                            | `''`     | -        | 단계 항목 사이의 간격 크기                              |
| `noLabel`     | `boolean`                                                     | `false`  | -        | 단계 레이블 숨김                                        |
| `steps`       | `string[]`                                                    | `[]`     | -        | 단계 레이블 문자열 배열                                 |
| `vertical`    | `boolean`                                                     | `false`  | -        | 단계를 수직으로 표시                                    |
| `modelValue`  | `number`                                                      | `0`      | -        | 현재 단계 인덱스 (v-model)                              |

## Types

```typescript
interface VsStepsStyleSet {
    variables?: {
        stepSize?: string;
    };
    step?: CSSProperties;
    activeStep?: CSSProperties;
    label?: CSSProperties;
    activeLabel?: CSSProperties;
    progress?: CSSProperties;
    activeProgress?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-steps
        v-model="currentStep"
        :steps="steps"
        :style-set="{
            variables: { stepSize: '2rem' },
            step: { border: '2px solid #d1d5db' },
            activeStep: { backgroundColor: '#6366f1', borderColor: '#6366f1', color: '#fff' },
            progress: { backgroundColor: '#a5b4fc' },
            activeProgress: { backgroundColor: '#6366f1' },
        }"
    />
</template>
```

## Events

| Event               | Payload  | 설명                               |
| ------------------- | -------- | ---------------------------------- |
| `update:modelValue` | `number` | 활성 단계가 변경될 때 발생         |
| `change`            | `number` | 활성 단계가 변경될 때 발생         |

## Slots

| Slot    | 설명                                                                              |
| ------- | --------------------------------------------------------------------------------- |
| `step`  | 각 단계 원의 커스텀 콘텐츠; `{ step, index, isSelected, isPrevious, isDisabled }` 수신 |
| `label` | 각 단계 레이블의 커스텀 콘텐츠; `{ step, index, isSelected, isPrevious, isDisabled }` 수신 |

## Methods

| Method | Parameters | 설명 |
| ------ | ---------- | ---- |
