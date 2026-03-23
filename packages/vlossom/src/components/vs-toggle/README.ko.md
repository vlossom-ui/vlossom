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

| Prop          | Type                         | Default | Required | Description                       |
| ------------- | ---------------------------- | ------- | -------- | --------------------------------- |
| `modelValue`  | `boolean`                    | `false` | -        | v-model로 바인딩되는 토글 상태 값 |
| `colorScheme` | `ColorScheme`                | -       | -        | 컴포넌트 색상 테마                |
| `styleSet`    | `string \| VsToggleStyleSet` | -       | -        | 커스텀 스타일 설정 객체           |

**VsButton에서 상속받은 Props:**

- `circle`, `disabled`, `ghost`, `large`, `loading`, `outline`, `primary`, `responsive`, `small`

> **Note**: VsButton의 모든 스타일링 props를 지원합니다. 자세한 내용은 [VsButton README](../vs-button/README.md)를 참조하세요.

## Events

| Event               | Parameters | Description             |
| ------------------- | ---------- | ----------------------- |
| `update:modelValue` | `boolean`  | v-model 값 변경 시 발생 |
| `toggle`            | `boolean`  | 토글 상태 변경 시 발생  |

## Slots

| Slot      | Description                    |
| --------- | ------------------------------ |
| `default` | 토글 버튼 내부에 표시할 콘텐츠 |

## Methods

| Method     | Return Type | Description      |
| ---------- | ----------- | ---------------- |
| `toggle()` | `void`      | 토글 상태를 변경 |

## Types

```typescript
interface VsToggleStyleSet extends VsButtonStyleSet {}
```

> [!NOTE]
>
> VsButton의 모든 스타일링 props를 지원합니다. 자세한 내용은 [VsButton README](../vs-button/README.md#types)를 참조하세요.

### StyleSet 사용 예시

```html
<template>
    <vs-toggle
        v-model="isToggled"
        :style-set="{
            variables: {
                padding: '1rem 2rem',
            },
            component: {
                backgroundColor: '#4caf50',
                borderRadius: '8px',
            },
        }"
    >
        Toggle Me
    </vs-toggle>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isToggled = ref(false);
</script>
```

## 특징

- **v-model 지원**: 양방향 데이터 바인딩으로 토글 상태 관리
- **VsButton 기반**: VsButton의 모든 스타일링 옵션을 완전히 지원
- **이벤트 처리**: `toggle` 이벤트로 상태 변화 감지
- **접근성**: 버튼 기반으로 키보드 내비게이션 및 스크린 리더 지원
