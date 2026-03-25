> English: [README.md](./README.md)

# VsCheckbox & VsCheckboxSet

체크박스 입력을 위한 컴포넌트입니다. 단일 체크박스(`VsCheckbox`)와 여러 옵션을 선택할 수 있는 체크박스 그룹(`VsCheckboxSet`)을 제공합니다.

**Available Version**: 2.0.0+

---

## VsCheckbox

단일 체크박스 컴포넌트입니다.

### 기본 사용법

#### 단일 체크박스

```html
<template>
    <vs-checkbox v-model="checked" check-label="동의합니다" />
</template>
```

#### 커스텀 값 사용

```html
<template>
    <vs-checkbox
        v-model="agreement"
        check-label="동의"
        true-value="yes"
        false-value="no"
    />
</template>

<script setup>
import { ref } from 'vue';
const agreement = ref('no');
</script>
```

#### 중간 상태 (Indeterminate)

```html
<template>
    <vs-checkbox indeterminate check-label="부분 선택됨" />
</template>
```

#### 배열 모드로 사용

```html
<template>
    <vs-checkbox
        v-model="selectedTags"
        check-label="태그 1"
        :true-value="'tag1'"
        multiple
    />
    <vs-checkbox
        v-model="selectedTags"
        check-label="태그 2"
        :true-value="'tag2'"
        multiple
    />
</template>

<script setup>
import { ref } from 'vue';
const selectedTags = ref([]);
</script>
```

#### 변경 전 확인 (BeforeChange)

```html
<template>
    <vs-checkbox
        v-model="checked"
        check-label="동의합니다"
        :before-change="confirmBeforeChange"
    />
</template>

<script setup>
import { ref } from 'vue';

const checked = ref(false);

const confirmBeforeChange = async (from, to, optionValue) => {
    // from: 변경 전 값, to: 변경 후 값, optionValue: trueValue
    return confirm('정말 동의하시나요?');
};
</script>
```

### Props

| Prop            | Type                           | Default | Required | Description                                                                           |
| --------------- | ------------------------------ | ------- | -------- | ------------------------------------------------------------------------------------- |
| `colorScheme`   | `string`                       | -       | -        | 컴포넌트 색상 테마                                                                    |
| `styleSet`      | `string \| VsCheckboxStyleSet` | -       | -        | 커스텀 스타일 설정 객체                                                               |
| `checked`       | `boolean`                      | `false` | -        | 초기 선택 상태                                                                        |
| `checkLabel`    | `string`                       | -       | -        | 체크박스 옆 표시할 라벨                                                               |
| `indeterminate` | `boolean`                      | `false` | -        | 중간 상태 (부분 선택) 표시                                                            |
| `multiple`      | `boolean`                      | `false` | -        | 배열 모드 활성화 (v-model이 배열로 동작)                                              |
| `trueValue`     | `any`                          | `true`  | -        | 체크 시 v-model에 저장될 값                                                           |
| `falseValue`    | `any`                          | `false` | -        | 언체크 시 v-model에 저장될 값                                                         |
| `beforeChange`  | `Function`                     | -       | -        | 상태 변경 전 실행할 비동기 함수 (from, to, optionValue 인자 전달, false 반환 시 취소) |

또한 일반적인 Input Props (`id`, `label`, `required`, `disabled`, `readonly`, `messages`, `rules` 등)도 지원합니다.

### Types

```typescript
interface VsCheckboxStyleSet {
    variables?: {
        checkboxColor?: string;
        checkboxSize?: string;
    };
    checkbox?: CSSProperties;
    checkboxLabel?: CSSProperties;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> `wrapper`는 [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types)을 사용합니다.

### Slots

| Slot          | Description                        |
| ------------- | ---------------------------------- |
| `default`     | 체크박스 외부 래퍼에 표시할 콘텐츠 |
| `label`       | 입력 래퍼의 라벨 영역              |
| `check-label` | 체크박스 옆에 표시할 라벨          |
| `messages`    | 하단 메시지 영역                   |

### Events

| Event               | Type                    | Description                                   |
| ------------------- | ----------------------- | --------------------------------------------- | ------------------ |
| `update:modelValue` | `any \| any[]`          | -                                             | v-model 값 변경 시 |
| `change`            | `any`                   | 체크 상태 변경 시                             |
| `toggle`            | `(boolean, MouseEvent)` | 체크 상태 토글 시 (토글 후 checked 상태 전달) |
| `focus`             | `FocusEvent`            | 체크박스 포커스 시                            |
| `blur`              | `FocusEvent`            | 체크박스 블러 시                              |

---

## VsCheckboxSet

여러 옵션을 선택할 수 있는 체크박스 그룹 컴포넌트입니다.

### 기본 사용법

#### 체크박스 그룹

```html
<template>
    <vs-checkbox-set
        v-model="selectedOptions"
        :options="options"
        option-label="label"
        option-value="value"
    />
</template>

<script setup>
import { ref } from 'vue';
const options = [
    { label: '옵션 1', value: 'opt1' },
    { label: '옵션 2', value: 'opt2' },
];
const selectedOptions = ref([]);
</script>
```

#### 수직 레이아웃

```html
<template>
    <vs-checkbox-set v-model="selected" :options="options" vertical />
</template>
```

#### 최소/최대 선택 개수 제한

```html
<template>
    <vs-checkbox-set v-model="selected" :options="options" :min="1" :max="3" />
</template>
```

#### 변경 전 확인 (BeforeChange)

```html
<template>
    <vs-checkbox-set
        v-model="selected"
        :options="options"
        :before-change="confirmBeforeChange"
    />
</template>

<script setup>
import { ref } from 'vue';

const options = [
    { label: '옵션 1', value: 'opt1' },
    { label: '옵션 2', value: 'opt2' },
];
const selected = ref([]);

const confirmBeforeChange = async (from, to, optionValue) => {
    // from: 변경 전 배열, to: 변경 후 배열, optionValue: 선택/해제된 옵션 값
    return confirm(`선택을 변경하시겠습니까?`);
};
</script>
```

### Props

| Prop           | Type               | Default | Required | Description                                                                           |
| -------------- | ------------------ | ------- | -------- | ------------------------------------------------------------------------------------- |
| `options`      | `any[]`            | -       | ✅       | 선택 가능한 옵션 배열                                                                 |
| `optionLabel`  | `string`           | -       | -        | 옵션 객체에서 라벨로 사용할 속성                                                      |
| `optionValue`  | `string`           | -       | -        | 옵션 객체에서 값으로 사용할 속성                                                      |
| `vertical`     | `boolean`          | `false` | -        | 수직 레이아웃 적용                                                                    |
| `min`          | `number \| string` | `0`     | -        | 최소 선택 개수                                                                        |
| `max`          | `number \| string` | -       | -        | 최대 선택 개수                                                                        |
| `beforeChange` | `Function`         | -       | -        | 상태 변경 전 실행할 비동기 함수 (from, to, optionValue 인자 전달, false 반환 시 취소) |

또한 일반적인 Input Props (`id`, `label`, `required`, `disabled`, `readonly`, `messages`, `rules` 등)도 지원합니다.

### Types

```typescript
interface VsCheckboxSetStyleSet {
    component?: CSSProperties;
    checkbox?: Omit<VsCheckboxStyleSet, 'wrapper'>;
    wrapper?: VsInputWrapperStyleSet;
}
```

> [!NOTE]
>
> - `component`는 체크박스 세트 컨테이너 스타일입니다.
> - `checkbox`는 [VsCheckboxStyleSet](#types)을 사용합니다.
> - `wrapper`는 [VsInputWrapperStyleSet](../vs-input-wrapper/README.md#types)을 사용합니다.

### Slots

| Slot          | Description                                  |
| ------------- | -------------------------------------------- |
| `default`     | 체크박스 세트 외부 래퍼에 표시할 콘텐츠      |
| `label`       | 입력 래퍼의 라벨 영역                        |
| `check-label` | 각 체크박스 옆에 표시할 라벨 (스코프된 슬롯) |
| `messages`    | 하단 메시지 영역                             |

### Events

| Event               | Type                   | Description                        |
| ------------------- | ---------------------- | ---------------------------------- |
| `update:modelValue` | `any[]`                | v-model 값 변경 시                 |
| `change`            | `any`                  | 체크 상태 변경 시                  |
| `focus`             | `(option, FocusEvent)` | 체크박스 포커스 시 (옵션과 이벤트) |
| `blur`              | `(option, FocusEvent)` | 체크박스 블러 시 (옵션과 이벤트)   |

---

## 특징

- **단일 및 그룹 지원**: 단일 체크박스와 여러 옵션 중복 선택 지원
- **v-model 지원**: 양방향 데이터 바인딩
- **유연한 옵션 구성**: 객체 배열에서 라벨/값을 자동으로 추출
- **선택 개수 제한**: min/max props로 선택 가능한 항목 수 제한
- **수직/수평 레이아웃**: vertical prop으로 세로/가로 배치 전환
- **중간 상태**: indeterminate prop으로 부분 선택 상태 표현
- **커스터마이징**: styleSet prop으로 세밀한 스타일 조정 가능
