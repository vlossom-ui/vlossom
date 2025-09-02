# VsToggle

Boolean 값을 토글하는 버튼 컴포넌트입니다. `v-model`을 지원하며, 내부적으로 VsButton을 사용하여 VsButton의 모든 스타일링 옵션을 제공합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 토글 버튼

```html
<template>
    <vs-toggle v-model="isToggled">
        토글 버튼
    </vs-toggle>
</template>

<script setup>
import { ref } from 'vue';
const isToggled = ref(false);
</script>
```

### 다양한 스타일의 토글 버튼

```html
<template>
    <vs-toggle v-model="toggleValue" primary>Primary 토글</vs-toggle>
    <vs-toggle v-model="toggleValue" outline>Outline 토글</vs-toggle>
    <vs-toggle v-model="toggleValue" ghost>Ghost 토글</vs-toggle>
    <vs-toggle v-model="toggleValue" circle>⭕</vs-toggle>
</template>
```

### 투명 토글 버튼

```html
<template>
    <vs-toggle v-model="isToggled" invisible>
        투명한 토글 영역
    </vs-toggle>
</template>
```

### 토글 이벤트 처리

```html
<template>
    <vs-toggle v-model="isToggled" @toggle="handleToggle">
        상태: {{ isToggled ? 'ON' : 'OFF' }}
    </vs-toggle>
</template>

<script setup>
import { ref } from 'vue';

const isToggled = ref(false);

const handleToggle = (value: boolean) => {
    console.log('토글 상태 변경:', value);
};
</script>
```

## Props

| Prop          | Type                         | Default | Required | Description                             |
| ------------- | ---------------------------- | ------- | -------- | --------------------------------------- |
| `modelValue`  | `boolean`                    | `false` | -        | v-model로 바인딩되는 토글 상태 값       |
| `invisible`   | `boolean`                    | `false` | -        | 버튼을 투명하게 만들어 클릭 영역만 유지 |
| `colorScheme` | `ColorScheme`                | -       | -        | 컴포넌트 색상 테마                      |
| `styleSet`    | `string \| VsToggleStyleSet` | -       | -        | 커스텀 스타일 설정 객체                 |

**VsButton에서 상속받은 Props:**

- `circle`, `disabled`, `ghost`, `large`, `loading`, `outline`, `primary`, `responsive`, `small`

> **Note**: VsButton의 모든 스타일링 props를 지원합니다. 자세한 내용은 [VsButton README](../vs-button/README.md)를 참조하세요.

## Events

| Event               | Parameters | Description                                  |
| ------------------- | ---------- | -------------------------------------------- |
| `update:modelValue` | `boolean`  | v-model 값이 변경될 때 발생                  |
| `toggle`            | `boolean`  | 토글 상태가 변경될 때 발생하는 커스텀 이벤트 |

## Slots

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | 토글 버튼 내부에 표시할 콘텐츠 |

## Types

```typescript
interface VsToggleStyleSet extends VsButtonStyleSet {
    // VsButton의 모든 스타일 속성을 상속받음
    backgroundColor?: string;
    border?: string;
    borderRadius?: string;
    fontColor?: string;
    fontSize?: string;
    fontWeight?: string | number;
    height?: string;
    padding?: string;
    width?: string;
    loading?: VsLoadingStyleSet;
}
```

## CSS 변수

VsToggle은 VsButton을 기반으로 하므로, 모든 VsButton CSS 변수를 지원합니다.

추가적으로 다음 CSS 클래스를 제공합니다:

- `.vs-invisible`: `invisible` prop이 true일 때 적용되는 투명 스타일

## 특징

- **v-model 지원**: 양방향 데이터 바인딩으로 토글 상태 관리
- **VsButton 기반**: VsButton의 모든 스타일링 옵션을 완전히 지원
- **투명 모드**: `invisible` prop으로 시각적으로 숨겨진 클릭 가능 영역 제공
- **이벤트 처리**: `toggle` 이벤트로 상태 변화 감지
- **접근성**: 버튼 기반으로 키보드 내비게이션 및 스크린 리더 지원
