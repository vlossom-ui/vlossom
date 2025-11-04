# VsRadio

라디오 입력을 위한 컴포넌트입니다. 동일한 그룹에서 하나의 항목만 선택하도록 구성합니다.

**Available Version**: 2.0.0+

---

## 사용 예

```html
<template>
    <vs-radio v-model="payment" radio-label="카드" :radio-value="'card'" name="payment" />
    <vs-radio v-model="payment" radio-label="계좌이체" :radio-value="'bank'" name="payment" />
</template>
```

> `v-model`과 `name`을 동일하게 지정하면 브라우저가 하나의 라디오 그룹으로 인식합니다.

스타일을 조정하려면 `style-set` 속성에 `VsRadioStyleSet` 객체를 전달하거나 스타일셋 키를 지정합니다.

## Props

| Prop          | Type                        | Default | Required | Description                      |
| ------------- | --------------------------- | ------- | -------- | -------------------------------- |
| `radioValue`  | `any`                       | -       | ✅       | 선택 시 `v-model`에 설정될 값    |
| `radioLabel`  | `string`                    | `''`    | -        | 라디오 오른쪽에 표시할 라벨      |
| `checked`     | `boolean`                   | `false` | -        | 초기 선택 여부                   |
| `styleSet`    | `string \| VsRadioStyleSet` | -       | -        | 스타일셋 키 또는 인라인 스타일셋 |
| `colorScheme` | `string`                    | -       | -        | 색상 테마 키                     |

`id`, `label`, `messages`, `rules`, `required`, `disabled`, `readonly`, `small`, `width`, `grid`, `noMessages` 등 공통 Input Props도 그대로 사용할 수 있습니다.

## Slots

| Slot          | Description                               |
| ------------- | ----------------------------------------- |
| `label`       | 입력 래퍼 상단 라벨 영역                  |
| `radio-label` | 라디오 항목 라벨(슬롯 내용으로 교체 가능) |
| `messages`    | 하단 메시지 영역                          |

## Events

| Event               | Payload      | Description                 |
| ------------------- | ------------ | --------------------------- |
| `update:modelValue` | `any`        | `v-model` 값 변경 시        |
| `update:changed`    | `boolean`    | 내부 변경 여부 업데이트 시  |
| `update:valid`      | `boolean`    | 유효성 상태가 바뀔 때       |
| `change`            | `Event`      | 기본 라디오 `change` 이벤트 |
| `toggle`            | `boolean`    | 토글 직후 체크 여부         |
| `focus`             | `FocusEvent` | 라디오에 포커스가 올 때     |
| `blur`              | `FocusEvent` | 라디오 포커스를 잃을 때     |

## Types

```typescript
interface VsRadioStyleSet {
    borderRadius?: string;
    height?: string;
    radioColor?: string;
    radioSize?: string;
}
```
