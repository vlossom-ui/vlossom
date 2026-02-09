# VsRadio & VsRadioSet

라디오 입력을 위한 컴포넌트 모음입니다. 단일 라디오와 여러 옵션 중 하나를 고르는 라디오 그룹 컴포넌트를 제공합니다.

**Available Version**: 2.0.0+

---

## VsRadio

단일 라디오 입력 컴포넌트입니다.

### 기본 사용법

```html
<template>
    <vs-radio v-model="payment" radio-label="카드" :radio-value="'card'" name="payment" />
    <vs-radio v-model="payment" radio-label="계좌이체" :radio-value="'bank'" name="payment" />
</template>
```

> `v-model`과 `name`을 동일하게 지정하면 브라우저가 하나의 라디오 그룹으로 인식합니다.

스타일을 조정하려면 `style-set` 속성에 `VsRadioStyleSet` 객체를 전달하거나 스타일셋 키를 지정합니다.

### Props

| Prop          | Type                        | Default | Required | Description                      |
| ------------- | --------------------------- | ------- | -------- | -------------------------------- |
| `radioValue`  | `any`                       | -       | ✅       | 선택 시 `v-model`에 설정될 값    |
| `radioLabel`  | `string`                    | `''`    | -        | 라디오 오른쪽에 표시할 라벨      |
| `checked`     | `boolean`                   | `false` | -        | 초기 선택 여부                   |
| `styleSet`    | `string \| VsRadioStyleSet` | -       | -        | 스타일셋 키 또는 인라인 스타일셋 |
| `colorScheme` | `string`                    | -       | -        | 색상 테마 키                     |

`id`, `label`, `messages`, `rules`, `required`, `disabled`, `readonly`, `width`, `grid`, `noMessages` 등 공통 Input Props도 그대로 사용할 수 있습니다.

### Slots

| Slot          | Description                               |
| ------------- | ----------------------------------------- |
| `label`       | 입력 래퍼 상단 라벨 영역                  |
| `radio-label` | 라디오 항목 라벨(슬롯 내용으로 교체 가능) |
| `messages`    | 하단 메시지 영역                          |

### Events

| Event               | Payload      | Description                 |
| ------------------- | ------------ | --------------------------- |
| `update:modelValue` | `any`        | `v-model` 값 변경 시        |
| `update:changed`    | `boolean`    | 내부 변경 여부 업데이트 시  |
| `update:valid`      | `boolean`    | 유효성 상태가 바뀔 때       |
| `change`            | `Event`      | 기본 라디오 `change` 이벤트 |
| `toggle`            | `boolean`    | 토글 직후 체크 여부         |
| `focus`             | `FocusEvent` | 라디오에 포커스가 올 때     |
| `blur`              | `FocusEvent` | 라디오 포커스를 잃을 때     |

### Types

```typescript
interface VsRadioStyleSet {
    variables?: {
        borderRadius?: string;
        radioColor?: string;
        radioSize?: string;
    };
    wrapper?: VsInputWrapperStyleSet;
}
```

> **참고**: `wrapper`는 [VsInputWrapper](../vs-input-wrapper/README.md)의 StyleSet을 사용합니다.

---

## VsRadioSet

여러 옵션 중 하나만 선택하도록 구성된 라디오 그룹 컴포넌트입니다. 내부에서는 `VsRadio`를 반복 렌더링합니다.

### 기본 사용법

```html
<template>
    <vs-radio-set
        v-model="selectedOption"
        :options="[
            { label: '라디오 1', value: 'opt1' },
            { label: '라디오 2', value: 'opt2' },
        ]"
        option-label="label"
        option-value="value"
        name="example"
    />
</template>

<script setup>
import { ref } from 'vue';
const selectedOption = ref('opt1');
</script>
```

### 커스텀 라벨 & 수직 레이아웃

```html
<template>
    <vs-radio-set
        v-model="plan"
        :options="plans"
        option-label="title"
        option-value="id"
        vertical
    >
        <template #radio-label="{ option }">
            <div class="flex flex-col">
                <span class="font-medium">{{ option.title }}</span>
                <span class="text-sm text-gray-500">{{ option.price }}</span>
            </div>
        </template>
    </vs-radio-set>
</template>

<script setup>
import { ref } from 'vue';
const plans = [
    { id: 'basic', title: 'Basic', price: '₩10,000' },
    { id: 'pro', title: 'Pro', price: '₩25,000' },
];
const plan = ref('basic');
</script>
```

### 변경 전 확인 (BeforeChange)

```html
<template>
    <vs-radio-set
        v-model="delivery"
        :options="['standard', 'express']"
        :before-change="confirmBeforeChange"
        name="delivery"
    />
</template>

<script setup>
import { ref } from 'vue';

const delivery = ref('standard');

const confirmBeforeChange = async (from, to, optionValue) => {
    // from: 현재 값, to: 변경될 값, optionValue: 옵션 값
    return window.confirm(`${optionValue} 옵션으로 변경하시겠어요?`);
};
</script>
```

### Types

```typescript
interface VsRadioSetStyleSet {
    component?: CSSProperties;
    radio?: VsRadioStyleSet;
    wrapper?: VsInputWrapperStyleSet;
}
```

> **참고**: `radio`는 [VsRadio](#vsradio)의 StyleSet을 사용하며, `wrapper`는 [VsInputWrapper](../vs-input-wrapper/README.md)의 StyleSet을 사용합니다.

### Props

| Prop           | Type                           | Default | Required | Description                                                         |
| -------------- | ------------------------------ | ------- | -------- | ------------------------------------------------------------------- |
| `options`      | `any[]`                        | []      | ✅       | 렌더링할 옵션 목록                                                  |
| `optionLabel`  | `string`                       | `''`    | -        | 옵션 객체에서 라벨을 읽어 올 경로                                   |
| `optionValue`  | `string`                       | `''`    | -        | 옵션 객체에서 값을 읽어 올 경로                                     |
| `vertical`     | `boolean`                      | `false` | -        | 라디오를 세로 방향으로 배치                                         |
| `styleSet`     | `string \| VsRadioSetStyleSet` | -       | -        | 그룹 및 항목 스타일 커스터마이징                                    |
| `beforeChange` | `Function`                     | -       | -        | 변경 전 호출되는 비동기 함수 (from, to, optionValue, false 시 취소) |

`VsRadio`와 동일하게 공통 Input Props (`label`, `required`, `messages`, `disabled`, `readonly`, `width`, `grid`, `noMessages` 등)를 사용할 수 있습니다.

### Slots

| Slot          | Description                              |
| ------------- | ---------------------------------------- |
| `label`       | 그룹 상단 라벨 영역                      |
| `radio-label` | 각 항목의 라벨 영역 (커스텀 마크업 가능) |
| `messages`    | 그룹 하단 메시지 영역                    |

### Events

| Event               | Payload | Description                          |
| ------------------- | ------- | ------------------------------------ |
| `update:modelValue` | `any`   | 선택된 값이 변경될 때                |
| `change`            | `any`   | 내부 라디오에서 change가 발생했을 때 |
| `focus`             | `any`   | 항목 포커스 시 (옵션, 이벤트 전달)   |
| `blur`              | `any`   | 항목 블러 시 (옵션, 이벤트 전달)     |
