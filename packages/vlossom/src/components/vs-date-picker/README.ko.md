# VsDatePicker

폼 유효성 검사와 format-validated 문자열 `modelValue`를 제공하는 네이티브 우선 날짜 선택 컴포넌트입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- 네이티브 `<input type>` 기반 4종 타입 지원: `date`, `datetime-local`, `time`, `month`.
- `modelValue`는 항상 format-validated 문자열입니다. format은 `type` 으로부터 결정됩니다.
- `required`, `min`/`max` (string), format 불일치 감지를 포함한 폼 유효성 검사.
- 기본 지우기 버튼 + 캘린더 아이콘 버튼 제공. `open()`은 `showPicker()` feature detect 후 fallback.

## Basic Usage

```html
<template>
    <vs-date-picker v-model="date" label="날짜" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref('');
</script>
```

### 입력 타입

```html
<template>
    <vs-date-picker v-model="date" type="date" label="날짜" />
    <vs-date-picker v-model="datetime" type="datetime-local" label="일시" />
    <vs-date-picker v-model="time" type="time" label="시간" />
    <vs-date-picker v-model="month" type="month" label="월" />
</template>
```

### Min / Max

```html
<template>
    <vs-date-picker
        v-model="date"
        type="date"
        min="2026-01-01"
        max="2026-12-31"
    />
</template>
```

## 데이터 모델

- **`modelValue`는 `type` 으로부터 결정되는 format 의 문자열**입니다.
    - `type='date'` → `'YYYY-MM-DD'` (예: `'2026-05-18'`)
    - `type='datetime-local'` → `'YYYY-MM-DDTHH:mm'` (예: `'2026-05-18T15:30'`)
    - `type='time'` → `'HH:mm'` (예: `'15:30'`)
    - `type='month'` → `'YYYY-MM'` (예: `'2026-05'`)
- 기본값은 `''` 입니다.
- 타임존 해석은 의도적으로 소비 측에 위임합니다. instant 변환이 필요하면 dayjs / Temporal / 자체 어댑터를 사용하세요.

## Format 검증

- 사용자 입력 또는 외부 `modelValue` 주입 시, 현재 `type` 에 해당하는 정규식으로 검증됩니다.
- format 불일치 시 `invalid` (`{ input }`) 이벤트가 emit 되며 입력창 표시값은 비워집니다. `modelValue` 자체는 자동으로 덮어쓰지 **않습니다**.

## Type 전환

`VsDatePicker`는 런타임에 `type`이 변경되어도 `modelValue`를 자동 변환하지 않습니다.

현재 `modelValue`가 새 `type` 형식과 맞지 않으면 입력창 표시값은 비워지고, 기존 `modelValue` 자체는 유지됩니다. `type`을 동적으로 변경하는 경우 사용하는 쪽에서 새 타입에 맞는 `modelValue`를 같은 흐름에서 함께 갱신하세요.

```html
<vs-date-picker v-model="value" :type="type" />
```

```typescript
type = 'month';
value = '2026-05';
```

## 제한 사항

- **`format` prop은 지원하지 않습니다.** 네이티브 picker는 브라우저/OS 로케일을 따르며 라이브러리가 이를 덮어쓸 수 없습니다. 특정 시각 포맷이 필요하면 별도 렌더링 레이어를 사용하세요.
- **`open()` (showPicker)** 는 일부 브라우저에서 사용자 제스처를 요구합니다. 이벤트 핸들러 바깥에서 프로그래밍적으로 호출하면 조용히 `focus()`로 fallback될 수 있습니다.
- **제약은 rule 기반으로만 적용됩니다.** `min`, `max`는 선택 값을 검증하지만 네이티브 picker UI로 forward되지는 않습니다.

### Picker 열기 동작

네이티브 캘린더는 다음 중 하나로 열립니다:

- input 영역을 클릭하거나,
- 오른쪽 끝의 캘린더 아이콘 버튼을 누르거나,
- 사용자 제스처 안에서 `dpRef.value.open()`을 호출.

`disabled`/`readonly` 상태에서는 세 가지 모두 무시됩니다.

## 커스텀 룰

```html
<template>
    <vs-date-picker
        v-model="date"
        type="date"
        required
        :rules="[v => (!!v && new Date(v).getUTCDay() !== 0) || '일요일은 선택할 수 없습니다']"
    />
</template>
```

기본 룰은 `noDefaultRules`로 비활성화할 수 있습니다.

## Props

| Prop             | Type                                              | Default     | Required | Description                                                                            |
| ---------------- | ------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------- |
| `colorScheme`    | `string`                                          | -           | -        | 컴포넌트의 색상 스킴.                                                                  |
| `styleSet`       | `string \| VsDatePickerStyleSet`                  | -           | -        | 커스텀 스타일 셋.                                                                      |
| `modelValue`     | `string`                                          | `''`        | -        | v-model — format-validated 문자열.                                                     |
| `type`           | `'date' \| 'datetime-local' \| 'time' \| 'month'` | `'date'`    | -        | 네이티브 input 타입. `modelValue` format 도 함께 결정.                                 |
| `min`            | `string \| undefined`                             | `undefined` | -        | 가장 빠른 유효 값 (rule 기반, 문자열 사전식 비교 — 예: `'2026-05-18' < '2026-12-31'`). |
| `max`            | `string \| undefined`                             | `undefined` | -        | 가장 늦은 유효 값 (rule 기반, 문자열 사전식 비교 — 예: `'2026-05-18' < '2026-12-31'`). |
| `noClear`        | `boolean`                                         | `false`     | -        | 지우기 버튼 숨김.                                                                      |
| `label`          | `string`                                          | `''`        | -        | 라벨 텍스트.                                                                           |
| `placeholder`    | `string`                                          | `''`        | -        | 플레이스홀더.                                                                          |
| `disabled`       | `boolean`                                         | `false`     | -        | 컴포넌트 비활성화.                                                                     |
| `readonly`       | `boolean`                                         | `false`     | -        | 읽기 전용.                                                                             |
| `required`       | `boolean`                                         | `false`     | -        | `required` 룰 추가.                                                                    |
| `noLabel`        | `boolean`                                         | `false`     | -        | 라벨 슬롯 숨김.                                                                        |
| `noMessages`     | `boolean`                                         | `false`     | -        | 메시지 슬롯 숨김.                                                                      |
| `hidden`         | `boolean`                                         | `false`     | -        | 전체 컴포넌트 숨김.                                                                    |
| `id`             | `string`                                          | `''`        | -        | input의 `id` 속성.                                                                     |
| `name`           | `string`                                          | `''`        | -        | input의 `name` 속성.                                                                   |
| `messages`       | `Message[]`                                       | `[]`        | -        | 외부 메시지.                                                                           |
| `rules`          | `Rule[]`                                          | `[]`        | -        | 사용자 정의 유효성 룰.                                                                 |
| `noDefaultRules` | `boolean`                                         | `false`     | -        | 기본 룰 (required, min, max) 비활성화.                                                 |
| `state`          | `UIState`                                         | `'idle'`    | -        | 외부 유효성 상태.                                                                      |
| `width`          | `string \| number \| Breakpoints`                 | -           | -        | 너비.                                                                                  |
| `grid`           | `string \| number \| Breakpoints`                 | -           | -        | 그리드 컬럼 span.                                                                      |
| `changed`        | `boolean`                                         | `false`     | -        | v-model — changed 플래그.                                                              |
| `valid`          | `boolean`                                         | `false`     | -        | v-model — valid 플래그.                                                                |

## Types

```typescript
import type { CSSProperties } from 'vue';
import type { VsInputStyleSet } from 'vlossom';
import type { VsInputWrapperStyleSet } from 'vlossom';

type VsDatePickerType = 'date' | 'datetime-local' | 'time' | 'month';

type VsDatePickerFormat = 'YYYY-MM-DD' | 'YYYY-MM-DDTHH:mm' | 'HH:mm' | 'YYYY-MM';

type VsDatePickerValueType = string;

interface VsDatePickerStyleSet extends CSSProperties {
    $wrapper?: VsInputWrapperStyleSet;
    $input?: VsInputStyleSet;
}
```

## Events

| Event               | Payload             | Description                                      |
| ------------------- | ------------------- | ------------------------------------------------ |
| `update:modelValue` | `string`            | modelValue 변경 시 emit.                         |
| `update:changed`    | `boolean`           | changed 플래그 변경 시 emit.                     |
| `update:valid`      | `boolean`           | valid 플래그 변경 시 emit.                       |
| `change`            | `string`            | 값이 commit된 후 emit.                           |
| `focus`             | `FocusEvent`        | 포커스 시 emit.                                  |
| `blur`              | `FocusEvent`        | 블러 시 emit.                                    |
| `clear`             | -                   | 지우기 버튼 클릭 시 emit.                        |
| `invalid`           | `{ input: string }` | format 불일치 시 emit.                           |

## Slots

| Slot       | Description                                 |
| ---------- | ------------------------------------------- |
| `label`    | 기본 라벨을 대체할 사용자 정의 라벨 콘텐츠. |
| `prepend`  | 날짜 input 박스 좌측에 표시될 콘텐츠.       |
| `append`   | 날짜 input 박스 우측에 표시될 콘텐츠.       |
| `messages` | input 아래의 사용자 정의 메시지 콘텐츠.     |

## Methods

| Method     | Parameters | Description                                                               |
| ---------- | ---------- | ------------------------------------------------------------------------- |
| `focus`    | -          | 입력 요소에 포커스를 둡니다.                                              |
| `blur`     | -          | 입력 요소의 포커스를 해제합니다.                                          |
| `validate` | -          | 유효성 검사를 트리거하고 결과를 반환합니다.                               |
| `clear`    | -          | 값을 비웁니다 (modelValue → `''`).                                        |
| `open`     | -          | `showPicker()`로 네이티브 picker를 엽니다 (실패 시 `focus()`로 fallback). |
