# VsSwitch

ON/OFF 상태를 토글할 수 있는 스위치 컴포넌트입니다. `v-model`을 지원하며, 다양한 값 타입(boolean, string, object 등)과 배열 모드를 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 스위치

```html
<template>
    <vs-switch v-model="isOn" label="알림 설정">
        <template #label>알림 설정</template>
    </vs-switch>
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

### 커스텀 값 설정

```html
<template>
    <vs-switch
        v-model="userStatus"
        :true-value="'active'"
        :false-value="'inactive'"
        true-label="Active"
        false-label="Inactive"
    />
</template>

<script setup>
import { ref } from 'vue';
const userStatus = ref('inactive');
</script>
```

### 배열 모드 (Multiple)

```html
<template>
    <vs-switch
        v-model="selectedOptions"
        :true-value="'option1'"
        label="Option 1"
        multiple
    />
    <vs-switch
        v-model="selectedOptions"
        :true-value="'option2'"
        label="Option 2"
        multiple
    />
</template>

<script setup>
import { ref } from 'vue';
const selectedOptions = ref([]);
</script>
```

### 변경 전 확인

```html
<template>
    <vs-switch
        v-model="isEnabled"
        :before-change="confirmChange"
        label="중요한 설정"
    />
</template>

<script setup>
import { ref } from 'vue';

const isEnabled = ref(false);

const confirmChange = async (from: boolean, to: boolean) => {
    return confirm(`${from}에서 ${to}로 변경하시겠습니까?`);
};
</script>
```

### 작은 크기

```html
<template>
    <vs-switch v-model="isOn" label="Compact Switch" small />
</template>
```

## Props

| Prop           | Type                                          | Default | Required | Description                          |
| -------------- | --------------------------------------------- | ------- | -------- | ------------------------------------ |
| `modelValue`   | `any`                                         | `false` | -        | v-model로 바인딩되는 스위치 값       |
| `ariaLabel`    | `string`                                      | `''`    | -        | 접근성을 위한 aria-label             |
| `beforeChange` | `(from: any, to: any) => Promise<boolean>`    | `null`  | -        | 값 변경 전 실행되는 콜백 함수        |
| `checked`      | `boolean`                                     | `false` | -        | 초기 체크 상태                       |
| `colorScheme`  | `ColorScheme`                                 | -       | -        | 컴포넌트 색상 테마                   |
| `disabled`     | `boolean`                                     | `false` | -        | 스위치 비활성화                      |
| `falseLabel`   | `string`                                      | `'OFF'` | -        | false 상태일 때 표시되는 레이블      |
| `falseValue`   | `any`                                         | `false` | -        | false 상태의 값                      |
| `hidden`       | `boolean`                                     | `false` | -        | 스위치 숨김 여부                     |
| `id`           | `string`                                      | -       | -        | input 요소의 id 속성                 |
| `label`        | `string`                                      | `''`    | -        | 스위치의 레이블                      |
| `messages`     | `Message[]`                                   | `[]`    | -        | 검증 메시지 배열                     |
| `multiple`     | `boolean`                                     | `false` | -        | 배열 모드 활성화 (여러 값 선택 가능) |
| `name`         | `string`                                      | `''`    | -        | input 요소의 name 속성               |
| `noMessages`   | `boolean`                                     | `false` | -        | 메시지 영역 숨김                     |
| `readonly`     | `boolean`                                     | `false` | -        | 읽기 전용 모드                       |
| `required`     | `boolean`                                     | `false` | -        | 필수 입력 여부                       |
| `rules`        | `Rule[]`                                      | `[]`    | -        | 검증 규칙 배열                       |
| `small`        | `boolean`                                     | `false` | -        | 작은 크기 스위치                     |
| `state`        | `'idle' \| 'success' \| 'error' \| 'warning'` | `idle`  | -        | 스위치 상태                          |
| `styleSet`     | `string \| VsSwitchStyleSet`                  | -       | -        | 커스텀 스타일 설정 객체              |
| `trueLabel`    | `string`                                      | `'ON'`  | -        | true 상태일 때 표시되는 레이블       |
| `trueValue`    | `any`                                         | `true`  | -        | true 상태의 값                       |

**반응형 Props:**

- `width`, `grid` (VsInputWrapper를 통한 반응형 레이아웃 지원)

## Events

| Event               | Parameters | Description                    |
| ------------------- | ---------- | ------------------------------ |
| `update:modelValue` | `any`      | v-model 값이 변경될 때 발생    |
| `update:changed`    | `boolean`  | 변경 여부 상태 업데이트        |
| `update:valid`      | `boolean`  | 유효성 검증 결과 업데이트      |
| `change`            | `any`      | 값이 변경될 때 발생            |
| `focus`             | `Event`    | 스위치가 포커스를 받을 때 발생 |
| `blur`              | `Event`    | 스위치가 포커스를 잃을 때 발생 |

## Slots

| Slot       | Description          |
| ---------- | -------------------- |
| `label`    | 커스텀 레이블 콘텐츠 |
| `messages` | 커스텀 메시지 콘텐츠 |

## Exposed Methods

| Method     | Parameters | Description          |
| ---------- | ---------- | -------------------- |
| `validate` | -          | 유효성 검증 실행     |
| `clear`    | -          | 값 초기화            |
| `focus`    | -          | 스위치에 포커스 설정 |
| `blur`     | -          | 스위치 포커스 해제   |

## Types

```typescript
interface VsSwitchStateStyleSet {
    backgroundColor?: string;
    border?: string;
    fontColor?: string;
    handleColor?: string;
}

interface VsSwitchStyleSet {
    borderRadius?: string;
    false: VsSwitchStateStyleSet;
    fontSize?: string;
    handleSize?: string;
    height?: string;
    true?: VsSwitchStateStyleSet;
    width?: string;
}
```

## 특징

- **v-model 지원**: 양방향 데이터 바인딩으로 스위치 상태 관리
- **다양한 값 타입**: boolean뿐만 아니라 문자열, 객체 등 모든 타입 지원
- **배열 모드**: `multiple` prop으로 여러 옵션을 배열로 관리
- **변경 전 확인**: `beforeChange` 콜백으로 값 변경 전 확인 로직 구현
- **검증 기능**: `rules`와 `required`를 통한 유효성 검증
- **상태 표시**: 성공/오류/경고 등의 상태 시각화
- **반응형**: VsInputWrapper를 통한 반응형 레이아웃 지원
- **접근성**: ARIA 속성과 키보드 내비게이션 지원
- **커스터마이징**: 상태별 스타일 세트로 세밀한 디자인 조정 가능
