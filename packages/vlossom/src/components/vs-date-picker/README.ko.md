# VsDatePicker

타임존 select 통합, 폼 유효성 검사, UTC 기반 modelValue를 제공하는 네이티브 우선 날짜 선택 컴포넌트입니다.

> For English documentation, see [README.md](./README.md).

**Available Version**: 2.0.0+

## Feature

- 네이티브 `<input type>` 기반 4종 타입 지원: `date`, `datetime-local`, `time`, `month`.
- `<vs-select>` 기반 타임존 선택을 인라인으로 통합 (옵션). 타임존 변경 시 wall-clock 유지.
- `modelValue`는 항상 UTC `Date` instant — `.toISOString()`으로 서버 전송에 안전.
- `required`, `min`/`max` (`Date`), `disabledDates`, parse-failure 감지를 포함한 폼 유효성 검사.
- 60초 미만 `step`은 `console.warn`과 함께 분 단위로 반올림 (`noStepNormalize`로 비활성화 가능).
- 기본 지우기 버튼 + 캘린더 아이콘 버튼 제공. `open()`은 `showPicker()` feature detect 후 fallback.

## Basic Usage

```html
<template>
    <vs-date-picker v-model="date" label="날짜" />
</template>

<script setup>
import { ref } from 'vue';
const date = ref(null);
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

### 타임존 Select 사용

```html
<template>
    <vs-date-picker
        v-model="datetime"
        type="datetime-local"
        timezone
        @timezone-change="onTimezoneChange"
    />
</template>

<script setup>
import { ref } from 'vue';
const datetime = ref(null);
function onTimezoneChange({ from, to }) {
    console.log(`타임존 변경: ${from} → ${to}`);
}
</script>
```

### 사용자 정의 타임존 옵션

```html
<template>
    <vs-date-picker
        v-model="datetime"
        type="datetime-local"
        timezone
        :timezone-options="[
            { value: 'Asia/Seoul', label: '서울 (UTC+09:00)' },
            { value: 'Asia/Tokyo', label: '도쿄 (UTC+09:00)' },
            { value: 'America/New_York', label: '뉴욕' },
        ]"
    />
</template>
```

### Min / Max + DisabledDates

```html
<template>
    <vs-date-picker
        v-model="date"
        type="date"
        :min="minDate"
        :max="maxDate"
        :disabled-dates="holidays"
    />
</template>

<script setup>
import { ref } from 'vue';
const minDate = new Date('2026-01-01T00:00:00Z');
const maxDate = new Date('2026-12-31T00:00:00Z');
const holidays = [new Date('2026-05-05T00:00:00Z')];
</script>
```

## 데이터 모델

- **`modelValue`는 항상 UTC `Date` instant** (`Date | null`).
- `timezone={false}` (default)일 때 모든 입력은 UTC wall-clock으로 해석됩니다 (입력창에 UTC 시각이 그대로 표시).
- `timezone={true}`이면 입력창에 현재 선택된 타임존의 wall-clock이 표시되지만, modelValue는 UTC로 유지됩니다.
- 서버 전송: `date.toISOString()`이 항상 일관된 UTC ISO 8601 문자열을 만들어 줍니다.

## 타임존

| 동작 | 상세 |
| --- | --- |
| 기본 | `timezone={false}` — select UI 없음, 내부 tz는 `'Etc/UTC'` 고정. |
| 초기값 | 활성 시 `currentTimezone === timezoneOptions[0].value`. |
| 변경 시 | wall-clock은 **유지**되고 UTC가 **재계산**됩니다. (예: "서울 오후 3시 회의를 뉴욕으로 옮긴다"). |
| 검색 | `timezoneOptions.length >= 20`일 때 자동 활성. |
| 잘못된 tz | `invalid` 이벤트 (reason: `'timezone'`) emit, `currentTimezone`은 유지. |
| 현재 tz 조회 | `dpRef.value.currentTimezone` (string). |

기본 옵션 12개 IANA 타임존: `Etc/UTC`, Los Angeles, New York, London, Paris, Dubai, Kolkata, Shanghai, Tokyo, Seoul, Sydney, Auckland.

## 제한 사항

- **`format` prop은 지원하지 않습니다.** 네이티브 picker는 브라우저/OS 로케일을 따르며 라이브러리가 이를 덮어쓸 수 없습니다. 특정 시각 포맷이 필요하면 별도 렌더링 레이어를 사용하세요.
- **`open()` (showPicker)** 는 일부 브라우저에서 사용자 제스처를 요구합니다. 이벤트 핸들러 바깥에서 프로그래밍적으로 호출하면 조용히 `focus()`로 fallback될 수 있습니다.
- **네이티브 캘린더의 비활성 셀 표시는 불가**합니다. `disabledDates`는 선택 시점에 룰 검증을 수행하지만, 네이티브 picker UI에서 회색 처리는 되지 않습니다.
- **60초 미만 `step`** 은 `console.warn`과 함께 분 단위로 반올림됩니다. 이 safeguard를 끄려면 `noStepNormalize`를 전달하세요.

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
        :rules="[v => !!v && v.getUTCDay() !== 0 || '일요일은 선택할 수 없습니다']"
    />
</template>
```

기본 룰은 `noDefaultRules`로 비활성화할 수 있습니다. 기본 `invalidValueCheck` 메시지를 바꾸려면 별도 룰로 덮어쓰세요.

## Props

| Prop                | Type                                                                  | Default                       | Required | Description                                                                                  |
| ------------------- | --------------------------------------------------------------------- | ----------------------------- | -------- | -------------------------------------------------------------------------------------------- |
| `colorScheme`       | `string`                                                              | -                             | -        | 컴포넌트의 색상 스킴.                                                                       |
| `styleSet`          | `string \| VsDatePickerStyleSet`                                      | -                             | -        | 커스텀 스타일 셋.                                                                            |
| `modelValue`        | `Date \| null`                                                        | `null`                        | -        | v-model — UTC instant.                                                                       |
| `type`              | `'date' \| 'datetime-local' \| 'time' \| 'month'`                     | `'date'`                      | -        | 네이티브 input 타입.                                                                         |
| `min`               | `Date \| undefined`                                                   | `undefined`                   | -        | 선택 가능한 가장 빠른 instant.                                                              |
| `max`               | `Date \| undefined`                                                   | `undefined`                   | -        | 선택 가능한 가장 늦은 instant.                                                              |
| `step`              | `number \| undefined`                                                 | `undefined`                   | -        | 초 단위 step (`time` / `datetime-local`). 60초 미만은 `console.warn`과 함께 반올림.         |
| `noStepNormalize`   | `boolean`                                                             | `false`                       | -        | 60초 미만 step 반올림 비활성화.                                                              |
| `disabledDates`     | `Date[]`                                                              | `[]`                          | -        | 선택할 수 없는 날짜 목록. 선택 시 `invalid` 이벤트 emit.                                    |
| `calendarIcon`      | `string`                                                              | inline SVG                    | -        | 아이콘 버튼의 HTML 문자열. 기본 캘린더 SVG로 fallback.                                       |
| `noClear`           | `boolean`                                                             | `false`                       | -        | 지우기 버튼 숨김.                                                                            |
| `timezone`          | `boolean`                                                             | `false`                       | -        | 인라인 타임존 select 렌더링 여부.                                                            |
| `timezoneOptions`   | `TimezoneOption[]`                                                    | `DEFAULT_TIMEZONE_OPTIONS`    | -        | 타임존 select 옵션. 첫 번째 항목이 초기값.                                                  |
| `label`             | `string`                                                              | `''`                          | -        | 라벨 텍스트.                                                                                 |
| `placeholder`       | `string`                                                              | `''`                          | -        | 플레이스홀더.                                                                                |
| `disabled`          | `boolean`                                                             | `false`                       | -        | 컴포넌트 비활성화.                                                                           |
| `readonly`          | `boolean`                                                             | `false`                       | -        | 읽기 전용.                                                                                   |
| `required`          | `boolean`                                                             | `false`                       | -        | `required` 룰 추가.                                                                          |
| `noLabel`           | `boolean`                                                             | `false`                       | -        | 라벨 슬롯 숨김.                                                                              |
| `noMessages`        | `boolean`                                                             | `false`                       | -        | 메시지 슬롯 숨김.                                                                            |
| `hidden`            | `boolean`                                                             | `false`                       | -        | 전체 컴포넌트 숨김.                                                                          |
| `id`                | `string`                                                              | `''`                          | -        | input의 `id` 속성.                                                                           |
| `name`              | `string`                                                              | `''`                          | -        | input의 `name` 속성.                                                                         |
| `messages`          | `Message[]`                                                           | `[]`                          | -        | 외부 메시지.                                                                                 |
| `rules`             | `Rule[]`                                                              | `[]`                          | -        | 사용자 정의 유효성 룰.                                                                       |
| `noDefaultRules`    | `boolean`                                                             | `false`                       | -        | 기본 룰 (required, min, max, notDisabled, invalidValue) 비활성화.                            |
| `state`             | `UIState`                                                             | `'idle'`                      | -        | 외부 유효성 상태.                                                                            |
| `width`             | `string \| number \| Breakpoints`                                     | -                             | -        | 너비.                                                                                        |
| `grid`              | `string \| number \| Breakpoints`                                     | -                             | -        | 그리드 컬럼 span.                                                                            |
| `changed`           | `boolean`                                                             | `false`                       | -        | v-model — changed 플래그.                                                                    |
| `valid`             | `boolean`                                                             | `false`                       | -        | v-model — valid 플래그.                                                                      |

## Types

```typescript
import type { CSSProperties } from 'vue';
import type { VsInputWrapperStyleSet } from 'vlossom';
import type { VsSelectStyleSet } from 'vlossom';

type VsDatePickerType = 'date' | 'datetime-local' | 'time' | 'month';

type VsDatePickerValueType = Date | null;

interface TimezoneOption {
    value: string;          // IANA 타임존 식별자 (예: 'Asia/Seoul')
    label: string;          // 표시 라벨
    group?: string;         // (선택) 옵션 그룹핑
    disabled?: boolean;     // (선택) 옵션 비활성화
}

interface VsDatePickerStyleSet extends CSSProperties {
    $wrapper?: VsInputWrapperStyleSet;
    $input?: CSSProperties;
    $prepend?: CSSProperties;
    $append?: CSSProperties;
    $clearButton?: CSSProperties;
    $iconButton?: CSSProperties;
    $timezoneSelect?: VsSelectStyleSet;
    $datePicker?: CSSProperties;
    $row?: CSSProperties;
}
```

`DEFAULT_TIMEZONE_OPTIONS` 상수는 편의를 위해 export되며 12개 IANA 타임존을 포함합니다.

## Events

| Event               | Payload                                  | Description                                                              |
| ------------------- | ---------------------------------------- | ------------------------------------------------------------------------ |
| `update:modelValue` | `Date \| null`                           | modelValue 변경 시 emit.                                                 |
| `update:changed`    | `boolean`                                | changed 플래그 변경 시 emit.                                             |
| `update:valid`      | `boolean`                                | valid 플래그 변경 시 emit.                                               |
| `change`            | `Date \| null`                           | 값이 commit된 후 emit.                                                   |
| `focus`             | `FocusEvent`                             | 포커스 시 emit.                                                          |
| `blur`              | `FocusEvent`                             | 블러 시 emit.                                                            |
| `clear`             | -                                        | 지우기 버튼 클릭 시 emit.                                                |
| `invalid`           | `{ reason: 'parse' \| 'disabled' \| 'timezone'; input: string }` | parse 실패, disabled 날짜 선택, 잘못된 timezone 선택 시 emit. |
| `timezone-change`   | `{ from: string; to: string }`           | 타임존 select 값이 유효하게 변경되었을 때 emit.                          |

## Slots

| Slot                 | Description                                                          |
| -------------------- | -------------------------------------------------------------------- |
| `label`              | 기본 라벨을 대체할 사용자 정의 라벨 콘텐츠.                          |
| `prepend`            | 날짜 input 박스 좌측에 표시될 콘텐츠.                                |
| `append`             | 날짜 input 박스 우측에 표시될 콘텐츠.                                |
| `messages`           | input 아래의 사용자 정의 메시지 콘텐츠.                              |
| `timezone-option`    | 타임존 `<vs-select>` 내부의 개별 옵션 렌더링.                        |

## Methods

| Method            | Parameters | Description                                                                  |
| ----------------- | ---------- | ---------------------------------------------------------------------------- |
| `focus`           | -          | 입력 요소에 포커스를 둡니다.                                                 |
| `blur`            | -          | 입력 요소의 포커스를 해제합니다.                                             |
| `validate`        | -          | 유효성 검사를 트리거하고 결과를 반환합니다.                                  |
| `clear`           | -          | 값을 비웁니다 (modelValue → null). 타임존은 유지됩니다.                      |
| `open`            | -          | `showPicker()`로 네이티브 picker를 엽니다 (실패 시 `focus()`로 fallback).    |
| `currentTimezone` | -          | (속성) 현재 선택된 IANA 타임존을 반환하는 읽기 전용 문자열.                  |
