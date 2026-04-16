> For English documentation, see [README.md](./README.md).

# VsSwitch

단일 및 다중 값 바인딩과 레이블 커스터마이징을 지원하는 토글 스위치 컴포넌트입니다.

**사용 가능 버전**: 2.0.0+

## 기능

- v-model을 통한 단일 및 다중(`multiple`) 토글 값 바인딩 지원
- props 또는 네임드 슬롯을 통한 ON/OFF 레이블 커스터마이징
- 레이블, 메시지, 유효성 검사를 위해 `VsInputWrapper`와 통합
- 비동기 토글 전환 가로채기를 위한 `beforeChange` 훅 제공
- 키보드 포커스 및 ARIA 속성을 통한 완전한 접근성 지원

## 기본 사용법

```html
<template>
    <vs-switch v-model="isOn" label="기능 활성화" />
</template>

<script setup>
import { ref } from 'vue';
const isOn = ref(false);
</script>
```

### 커스텀 레이블

```html
<template>
    <vs-switch v-model="isOn" true-label="YES" false-label="NO" />
</template>
```

### beforeChange 훅 사용

```html
<template>
    <vs-switch v-model="isOn" :before-change="confirmChange" />
</template>

<script setup>
import { ref } from 'vue';
const isOn = ref(false);
async function confirmChange(from, to) {
    return confirm(`Switch from ${from} to ${to}?`);
}
</script>
```

### 다중 모드

```html
<template>
    <vs-switch v-model="selected" :true-value="'apple'" multiple />
</template>
```

## Props

| Prop | 타입 | 기본값 | 필수 | 설명 |
| ---- | ---- | ------ | ---- | ---- |
| `colorScheme` | `string` | | | 컴포넌트 색상 스키마 |
| `styleSet` | `string \| VsSwitchStyleSet` | | | 컴포넌트 커스텀 스타일 세트 |
| `beforeChange` | `(from: any, to: any) => Promise<boolean> \| null` | `null` | | 스위치 변경 전 호출되는 비동기 훅. `false` 반환 시 취소 |
| `checked` | `boolean` | `false` | | 초기 체크 상태 |
| `disabled` | `boolean` | `false` | | 스위치 비활성화 |
| `falseLabel` | `string` | `'OFF'` | | 스위치가 OFF일 때 표시되는 레이블 |
| `falseValue` | `any` | `false` | | 스위치가 OFF일 때 사용되는 값 |
| `grid` | `string \| number \| Breakpoints` | | | 그리드 열 스팬 |
| `hidden` | `boolean` | `false` | | 컴포넌트 숨김 |
| `id` | `string` | `''` | | HTML `id` 속성 |
| `label` | `string` | `''` | | 스위치 위에 표시되는 레이블 텍스트 |
| `messages` | `Message[]` | `[]` | | 유효성 검사 메시지 |
| `modelValue` | `any` | `false` | | v-model 값 |
| `multiple` | `boolean` | `false` | | 다중 값 바인딩 모드 활성화 |
| `name` | `string` | `''` | | HTML `name` 속성 |
| `noDefaultRules` | `boolean` | `false` | | 기본 유효성 검사 규칙 비활성화 |
| `noMessages` | `boolean` | `false` | | 메시지 영역 숨김 |
| `readonly` | `boolean` | `false` | | 읽기 전용 모드 |
| `required` | `boolean` | `false` | | 필수 입력 필드로 표시 |
| `rules` | `Rule[]` | `[]` | | 커스텀 유효성 검사 규칙 |
| `state` | `UIState` | `'idle'` | | UI 상태 (`idle`, `success`, `warning`, `error`) |
| `trueLabel` | `string` | `'ON'` | | 스위치가 ON일 때 표시되는 레이블 |
| `trueValue` | `any` | `true` | | 스위치가 ON일 때 사용되는 값 |
| `width` | `string \| number \| Breakpoints` | | | 컴포넌트 너비 |

## 타입

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
> `wrapper`는 [`VsInputWrapperStyleSet`](../vs-input-wrapper/README.ko.md)을 사용합니다.

### StyleSet 예시

```html
<template>
    <vs-switch
        v-model="isOn"
        :style-set="{
            variables: { handleColor: '#ffffff', handleSize: '1.4rem' },
            switchButton: { borderRadius: '0.25rem' },
            activeSwitchButton: { backgroundColor: '#4caf50' },
            component: { minHeight: '2.5rem' },
        }"
    />
</template>
```

## 이벤트

| 이벤트 | 페이로드 | 설명 |
| ------ | -------- | ---- |
| `update:modelValue` | `any` | 스위치 값이 변경될 때 발생 |
| `update:changed` | `boolean` | changed 상태 업데이트 시 발생 |
| `update:valid` | `boolean` | valid 상태 업데이트 시 발생 |
| `change` | `any` | 값 변경 시 발생 |
| `focus` | `FocusEvent` | 포커스 시 발생 |
| `blur` | `FocusEvent` | 포커스 해제 시 발생 |

## 슬롯

| 슬롯 | 설명 |
| ---- | ---- |
| `label` | 커스텀 레이블 내용 |
| `true-label` | 스위치가 ON일 때 표시되는 커스텀 내용 |
| `false-label` | 스위치가 OFF일 때 표시되는 커스텀 내용 |
| `messages` | 커스텀 메시지 내용 |

## 메서드

| 메서드 | 매개변수 | 설명 |
| ------ | -------- | ---- |
| `focus` | | 스위치 입력에 포커스 |
| `blur` | | 스위치 입력의 포커스 해제 |
| `validate` | | 유효성 검사 실행 |
| `clear` | | 값 초기화 |
