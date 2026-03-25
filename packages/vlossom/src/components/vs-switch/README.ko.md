> English: [README.md](./README.md)

# VsSwitch

ON/OFF 상태를 토글할 수 있는 스위치 컴포넌트입니다. `v-model`을 지원하며, 키보드 접근성과 커스텀 레이블을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 스위치

```html
<template>
    <vs-switch v-model="isOn" label="알림 설정" />
</template>

<script setup>
import { ref } from 'vue';
const isOn = ref(false);
</script>
```

### 커스텀 레이블

```html
<template>
    <vs-switch
        v-model="status"
        label="계정 상태"
        true-label="활성화"
        false-label="비활성화"
    />
</template>
```

### 비활성화 상태

```html
<template>
    <vs-switch v-model="isOn" label="설정" disabled />
</template>
```

### 커스텀 값과 배열 모드

```html
<template>
    <!-- 문자열 값 사용 -->
    <vs-switch
        v-model="userStatus"
        :true-value="'active'"
        :false-value="'inactive'"
    />

    <!-- 배열 모드로 여러 옵션 선택 -->
    <vs-switch
        v-model="selectedOptions"
        :true-value="'notifications'"
        label="알림 받기"
        multiple
    />
</template>

<script setup>
import { ref } from 'vue';
const userStatus = ref('inactive');
const selectedOptions = ref([]);
</script>
```

## Props

| Prop             | Type                         | Default | Required | Description                    |
| ---------------- | ---------------------------- | ------- | -------- | ------------------------------ |
| `modelValue`     | `any`                        | `false` | -        | v-model로 바인딩되는 스위치 값 |
| `colorScheme`    | `ColorScheme`                | -       | -        | 컴포넌트 색상 테마             |
| `styleSet`       | `string \| VsSwitchStyleSet` | -       | -        | 커스텀 스타일 설정 객체        |
| `label`          | `string`                     | `''`    | -        | 스위치의 레이블                |
| `trueValue`      | `any`                        | `true`  | -        | true 상태의 값                 |
| `falseValue`     | `any`                        | `false` | -        | false 상태의 값                |
| `beforeChange`   | `Function`                   | `null`  | -        | 값 변경 전 실행되는 콜백 함수  |
| `checked`        | `boolean`                    | `false` | -        | 초기 체크 상태                 |
| `multiple`       | `boolean`                    | `false` | -        | 배열 모드 활성화               |
| `disabled`       | `boolean`                    | `false` | -        | 스위치 비활성화                |
| `readonly`       | `boolean`                    | `false` | -        | 읽기 전용 모드                 |
| `required`       | `boolean`                    | `false` | -        | 필수 입력 여부                 |
| `hidden`         | `boolean`                    | `false` | -        | 스위치 숨김 여부               |
| `id`             | `string`                     | `''`    | -        | input 요소의 id 속성           |
| `name`           | `string`                     | `''`    | -        | input 요소의 name 속성         |
| `messages`       | `Message[]`                  | `[]`    | -        | 검증 메시지 배열               |
| `rules`          | `Rule[]`                     | `[]`    | -        | 검증 규칙 배열                 |
| `state`          | `UIState`                    | `idle`  | -        | 컴포넌트 상태                  |
| `noMessages`     | `boolean`                    | `false` | -        | 메시지 영역 숨김               |
| `noDefaultRules` | `boolean`                    | `false` | -        | 기본 검증 규칙 비활성화        |

**반응형 Props:**

| Prop    | Type                              | Default | Description |
| ------- | --------------------------------- | ------- | ----------- | -------------------- |
| `width` | `string \| number \| Breakpoints` | -       | -           | 컴포넌트 너비 설정   |
| `grid`  | `string \| number \| Breakpoints` | -       | -           | 그리드 레이아웃 크기 |

## Events

| Event               | Parameters | Description                |
| ------------------- | ---------- | -------------------------- |
| `update:modelValue` | `any`      | v-model 값 변경 시 발생    |
| `update:changed`    | `boolean`  | 변경 여부 상태 업데이트    |
| `update:valid`      | `boolean`  | 유효성 검증 결과 업데이트  |
| `change`            | `any`      | 값 변경 시 발생            |
| `focus`             | `Event`    | 스위치 포커스 시 발생      |
| `blur`              | `Event`    | 스위치 포커스 해제 시 발생 |

## Types

```typescript
interface VsSwitchStyleSet {
    variables?: {
        handleColor?: string;
        handleSize?: string;
    };
    switchButton?: CSSProperties;
    activeSwitchButton?: CSSProperties;
    component?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> `wrapper`는 [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types)을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-switch
        v-model="value"
        :style-set="{
            variables: {
                handleSize: '1.8rem',
                handleColor: '#fff',
            },
            switchButton: {
                borderRadius: '2rem',
                border: '2px solid #ddd',
            },
            activeSwitchButton: {
                backgroundColor: '#4caf50',
                borderColor: '#4caf50',
            },
        }"
    />
</template>

<script setup lang="ts">
import { ref } from 'vue';

const value = ref(false);
</script>
```

## Slots

| Slot       | Description          |
| ---------- | -------------------- |
| `label`    | 커스텀 레이블 콘텐츠 |
| `messages` | 커스텀 메시지 콘텐츠 |

## Exposed Methods

| Method     | Parameters | Description          |
| ---------- | ---------- | -------------------- |
| `focus`    | -          | 스위치에 포커스 설정 |
| `blur`     | -          | 스위치 포커스 해제   |
| `validate` | -          | 유효성 검증 실행     |
| `clear`    | -          | 값 초기화            |

## 특징

- **완전한 접근성**: 키보드 내비게이션(Tab, Space, Enter)과 스크린 리더 지원
- **네이티브 동작**: HTML label 구조로 클릭과 키보드 입력 자동 처리
- **다양한 값 타입**: boolean 외에도 문자열, 객체 등 모든 타입 지원
- **배열 모드**: `multiple` 속성으로 여러 스위치를 하나의 배열로 관리
- **검증 시스템**: `rules`, `required`를 통한 유효성 검증과 상태 표시
- **변경 제어**: `beforeChange` 콜백으로 값 변경 전 확인 로직 구현 가능
- **반응형 레이아웃**: VsInputWrapper 기반 그리드 및 너비 반응형 지원
