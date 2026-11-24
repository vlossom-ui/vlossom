> For English documentation, see [README.md](./README.md).

# useInputFormat

**Available Version**: 2.4.0+

텍스트 입력 요소에 입력 형식을 적용합니다. 전화번호, 날짜, 사업자등록번호처럼 정해진 형식에 맞는 문자만 입력되게 하고, 구분 문자는 자동으로 삽입합니다.

## Feature

- 네이티브 `<input>`과 `<textarea>`에 모두 사용할 수 있습니다. `VsInput`의 `format` prop도 이 composable로 구현합니다.
- 화면 표시값과 모델 값을 분리합니다. 화면에는 형식이 적용된 값을 보여주면서, 모델에는 형식이 적용된 값과 사용자가 입력한 문자만 모은 값 중 하나를 저장합니다.
- 입력 처리는 `beforeinput` 이벤트를 기반으로 합니다. 키보드 입력, 붙여넣기, 삭제, 선택 영역 덮어쓰기를 한 경로로 처리하며 모바일 가상 키보드에서도 동작합니다.

## Basic Usage

```html
<template>
    <input :value="displayValue" v-on="formatListeners" />
</template>

<script setup>
import { ref } from 'vue';
import { useInputFormat } from '@/composables';

const phone = ref(''); // '010-1234-5678'
const format = ref('999-9999-9999');

const { displayValue, formatListeners } = useInputFormat(phone, format);
</script>
```

`value` 인자로 넘긴 ref가 모델 역할을 합니다. 입력 요소에는 `v-model` 대신 `:value="displayValue"`와 `v-on="formatListeners"`를 바인딩합니다.

### 형식 문법

| 문자  | 의미                                        |
| ----- | ------------------------------------------- |
| `9`   | 숫자 (`0-9`)                                |
| `a`   | 영문자 (`A-Z`, `a-z`)                       |
| `*`   | 영문자 또는 숫자                            |
| `?`   | 이 문자 뒤의 부분은 선택 입력               |
| 그 외 | 구분 문자. 자동으로 삽입되며 편집할 수 없음 |

| 예시            | 형식                     | 완성된 값            |
| --------------- | ------------------------ | -------------------- |
| 휴대폰 번호     | `999-9999-9999`          | `010-1234-5678`      |
| 날짜            | `9999-99-99`             | `2026-11-24`         |
| 사업자등록번호  | `999-99-99999`           | `123-45-67890`       |
| 내선 번호(선택) | `(999) 999-9999? x99999` | `(555) 123-4567 x89` |
| 시리얼 번호     | `a*-999-a999`            | `A1-234-B567`        |

### 심화 설정

```html
<template>
    <input :value="displayValue" v-on="formatListeners" />
    <p v-if="isComplete">입력 완료: {{ rawValue }}</p>
</template>

<script setup>
import { ref } from 'vue';
import { useInputFormat } from '@/composables';

const birthday = ref(''); // '19900131'
const format = ref('9999/99/99');
const formatOptions = ref({ slotChar: 'yyyy/mm/dd', autoClear: false, raw: true });

const { displayValue, rawValue, isComplete, formatListeners } = useInputFormat(birthday, format, formatOptions);
</script>
```

### 입력 동작

- 형식 토큰에 맞지 않는 문자는 입력되지 않습니다.
- 구분 문자 위치는 자동으로 건너뜁니다.
- 값이 비어 있는 상태에서 포커스하면 슬롯 템플릿(`___-____-____`)이 표시되고, 커서는 첫 번째 입력 자리로 이동합니다. 아무것도 입력하지 않고 포커스를 잃으면 빈 값으로 돌아갑니다.
- 화면 값에는 아직 채워지지 않은 자리가 `slotChar`로 표시됩니다. 모델 값에는 `slotChar`가 들어가지 않고, 마지막으로 입력한 문자까지만 들어갑니다.

    | 화면 값         | 모델 값 (`raw: false`) | 모델 값 (`raw: true`) |
    | --------------- | ---------------------- | --------------------- |
    | `___-____-____` | `''`                   | `''`                  |
    | `010-12__-____` | `'010-12'`             | `'01012'`             |
    | `010-1234-5678` | `'010-1234-5678'`      | `'01012345678'`       |

- `Backspace`와 `Delete`는 편집 가능한 문자만 지우고, 뒤에 있는 문자를 앞으로 당깁니다. 구분 문자만 선택해서 지우면 아무것도 지워지지 않습니다.
- 중간에 입력하면 뒤에 있는 문자가 뒤로 밀립니다. 새 자리에 맞지 않는 문자는 버려집니다.
- 붙여넣으면 유효한 문자만 순서대로 채워집니다(예: `'010 1234 5678'` → `'010-1234-5678'`).
- `?` 뒤의 선택 입력 영역은 입력한 만큼만 화면에 표시됩니다.
- 형식을 다 채우지 못한 상태에서 포커스를 잃으면, `autoClear`가 `true`일 때 값을 비우고 `false`일 때 입력한 부분까지 남깁니다.
- 외부에서 모델 값을 바꾸면 형식에 맞게 표시하고, 모델 값도 `raw` 설정에 맞는 형태로 정규화합니다. 예를 들어 `raw: false`일 때 `'01012345678'`을 넣으면 `'010-1234-5678'`로 바뀝니다.
- `format`이나 `formatOptions`가 바뀌면 현재 입력된 문자를 새 형식으로 다시 맞춥니다.

## Args

| 인자            | 타입                               | 기본값 | 필수 | 설명                                                                                                |
| --------------- | ---------------------------------- | ------ | ---- | --------------------------------------------------------------------------------------------------- |
| `value`         | `Ref<string \| null \| undefined>` | —      | Yes  | 모델 값. composable이 입력에 따라 이 ref에 값을 씁니다. `null`, `undefined`는 빈 값으로 취급합니다. |
| `format`        | `Ref<string>`                      | —      | Yes  | 형식 문자열. 빈 문자열이면 형식을 적용하지 않고 입력을 그대로 모델에 반영합니다.                    |
| `formatOptions` | `Ref<VsInputFormatOptions>`        | —      | No   | 심화 설정. 생략한 항목은 기본값을 사용합니다.                                                       |

### VsInputFormatOptions

| 옵션        | 타입      | 기본값  | 설명                                                                                                        |
| ----------- | --------- | ------- | ----------------------------------------------------------------------------------------------------------- |
| `slotChar`  | `string`  | `'_'`   | 채워지지 않은 자리에 표시할 문자. 한 글자면 모든 자리에 반복하고, 형식과 길이가 같으면 자리별로 사용합니다. |
| `autoClear` | `boolean` | `true`  | `true`이면 미완성 상태로 포커스를 잃을 때 값을 비웁니다. `false`이면 입력한 부분까지 남깁니다.              |
| `raw`       | `boolean` | `false` | `true`이면 모델에 구분 문자를 제외하고 사용자가 입력한 문자만 저장합니다.                                   |

## Types

```typescript
interface VsInputFormatOptions {
    slotChar?: string;
    autoClear?: boolean;
    raw?: boolean;
}

interface VsInputFormatListeners {
    beforeinput: (event: InputEvent) => void;
    input: (event: Event) => void;
    focus: (event: FocusEvent) => void;
    blur: (event: FocusEvent) => void;
}
```

## Return Refs

| RefType           | 타입                     | 설명                                                                                  |
| ----------------- | ------------------------ | ------------------------------------------------------------------------------------- |
| `displayValue`    | `ComputedRef<string>`    | 화면에 표시할 값. 입력 요소의 `value`에 바인딩합니다. 슬롯 문자가 포함될 수 있습니다. |
| `formattedValue`  | `ComputedRef<string>`    | 형식이 적용된 값. 슬롯 문자는 포함하지 않습니다(예: `'010-12'`).                      |
| `rawValue`        | `ComputedRef<string>`    | 구분 문자를 제외하고 사용자가 입력한 문자만 모은 값(예: `'01012'`).                   |
| `isComplete`      | `ComputedRef<boolean>`   | `?` 앞의 필수 자리가 모두 채워졌으면 `true`입니다.                                    |
| `formatListeners` | `VsInputFormatListeners` | 입력 요소에 `v-on`으로 바인딩할 이벤트 핸들러 객체.                                   |

## Return Methods

없음.

## Hooks

없음. 이벤트 리스너는 `formatListeners`를 바인딩한 요소에만 연결되므로 정리할 것이 없습니다.

## Cautions

- 입력 요소에 `v-model`을 함께 쓰지 마세요. 모델 값은 `value` 인자로 넘긴 ref로 관리하고, 입력 요소에는 `:value="displayValue"`를 바인딩합니다.
- `formatListeners`와 같은 이름의 핸들러(`@focus`, `@blur` 등)를 직접 바인딩해도 됩니다. Vue가 두 핸들러를 모두 호출합니다.
- `<input>`은 `type`이 `text`, `tel`, `search`, `url`, `password`일 때만 동작합니다. `number`와 `email`은 커서 위치 API를 지원하지 않으므로 경고를 출력하고 형식을 적용하지 않습니다.
- `<textarea>`에서 줄바꿈은 형식 토큰에 해당하지 않으므로 입력되지 않습니다. 줄바꿈이 필요하면 형식에 구분 문자로 넣으세요.
- 모델 값은 항상 문자열입니다. 숫자만 입력받는 형식이어도 `number`로 바뀌지 않습니다.
- 한글 등 IME 조합 입력은 형식 토큰에 해당하지 않으므로 조합이 끝나면 제거됩니다.
- 형식 토큰과 같은 종류의 문자(예: `a` 형식에 `x`)를 `slotChar`로 쓰지 마세요. 자동완성, IME처럼 브라우저가 `beforeinput`을 거치지 않는 경우 입력한 문자로 오인될 수 있습니다.
- 형식이 적용된 입력에서는 실행 취소/다시 실행을 지원하지 않습니다.
- `9`, `a`, `*`, `?`는 구분 문자로 사용할 수 없습니다.
