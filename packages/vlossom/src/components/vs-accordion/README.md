# VsAccordion

접을 수 있는 컨텐츠 영역을 제공하는 아코디언 컴포넌트입니다. 제목을 클릭하여 컨텐츠를 펼치거나 접을 수 있으며, 키보드 접근성과 다양한 스타일 커스터마이징을 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 아코디언

```html
<template>
    <vs-accordion>
        <template #title>
            <h3>아코디언 제목</h3>
        </template>
        <p>아코디언 내용입니다. 제목을 클릭하면 이 내용이 펼쳐지거나 접힙니다.</p>
    </vs-accordion>
</template>
```

### 열린 상태로 시작

```html
<template>
    <vs-accordion :open="true">
        <template #title>
            <h3>기본적으로 열린 아코디언</h3>
        </template>
        <p>이 아코디언은 처음부터 열린 상태로 시작합니다.</p>
    </vs-accordion>
</template>
```

### v-model 사용

```html
<template>
    <vs-accordion v-model="isOpen">
        <template #title>
            <h3>v-model로 제어하는 아코디언</h3>
        </template>
        <p>외부에서 아코디언의 열림/닫힘 상태를 제어할 수 있습니다.</p>
    </vs-accordion>
</template>

<script setup>
import { ref } from 'vue';

const isOpen = ref(false);
</script>
```

### Primary 스타일

```html
<template>
    <vs-accordion primary>
        <template #title>
            <h3>Primary 스타일 아코디언</h3>
        </template>
        <p>강조된 스타일의 아코디언입니다.</p>
    </vs-accordion>
</template>
```

### 비활성화 상태

```html
<template>
    <vs-accordion disabled>
        <template #title>
            <h3>비활성화된 아코디언</h3>
        </template>
        <p>이 아코디언은 클릭할 수 없습니다.</p>
    </vs-accordion>
</template>
```

## Props

| Prop          | Type                            | Default | Required | Description             |
| ------------- | ------------------------------- | ------- | -------- | ----------------------- |
| `colorScheme` | `ColorScheme`                   | -       | -        | 컴포넌트 색상 테마      |
| `styleSet`    | `string \| VsAccordionStyleSet` | -       | -        | 커스텀 스타일 설정 객체 |
| `disabled`    | `boolean`                       | `false` | -        | 아코디언 비활성화       |
| `open`        | `boolean`                       | `false` | -        | 초기 열림 상태          |
| `primary`     | `boolean`                       | `false` | -        | 강조 스타일 적용        |
| `modelValue`  | `boolean`                       | `false` | -        | v-model 바인딩 값       |

## Types

```typescript
interface VsAccordionStyleSet {
    variables?: {
        arrowColor?: string;
        arrowSize?: string;
        arrowSpacing?: string;
        border?: string;
        width?: string;
    };
    title?: CSSProperties;
    expand?: VsExpandableStyleSet;
}
```

> **참고**: `expand`는 [VsExpandable](../vs-expandable/README.md)의 StyleSet을 사용합니다.

### StyleSet 사용 예시

```html
<template>
    <vs-accordion
        :style-set="{
            variables: {
                arrowColor: '#e91e63',
                arrowSize: '12px',
                arrowSpacing: '1.5rem',
                border: '2px solid #333',
                width: '500px',
            },
            title: {
                backgroundColor: '#f5f5f5',
                padding: '1rem 1.5rem',
            },
        }"
    >
        <template #title>
            <h3>커스텀 스타일 아코디언</h3>
        </template>
        <p>커스텀 스타일이 적용된 아코디언입니다.</p>
    </vs-accordion>
</template>
```

## Slots

| Slot      | Description                      |
| --------- | -------------------------------- |
| `default` | 아코디언 내용 (펼쳐지는 영역)    |
| `title`   | 아코디언 제목 (클릭 가능한 영역) |

## Events

| Event               | Type      | Description                     |
| ------------------- | --------- | ------------------------------- |
| `toggle`            | `boolean` | 아코디언 열림/닫힘 상태 변경 시 |
| `update:modelValue` | `boolean` | v-model 값 업데이트 시          |

## 특징

- **키보드 접근성**: Enter와 Space 키로 아코디언 제어 가능
- **v-model 지원**: 양방향 데이터 바인딩으로 상태 제어
- **유연한 스타일링**: 제목과 내용 영역을 각각 커스터마이징 가능
- **반응형 지원**: 다양한 화면 크기에 대응
- **접근성**: 스크린 리더와 키보드 사용자를 위한 접근성 고려
