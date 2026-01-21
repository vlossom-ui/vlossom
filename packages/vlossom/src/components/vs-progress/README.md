# VsProgress

작업의 진행률을 시각적으로 표시하는 진행률 표시 컴포넌트입니다. HTML5 `<progress>` 요소를 기반으로 하며, 다양한 스타일 커스터마이징과 라벨 표시를 지원합니다.

**Available Version**: 2.0.0+

## 기본 사용법

### 기본 진행률 표시

```html
<template>
    <vs-progress :value="50" :max="100" />
</template>
```

### 라벨과 함께 사용

```html
<template>
    <vs-progress
        :value="progress"
        :max="100"
        label="파일 업로드 중..."
    />
</template>

<script setup>
import { ref } from 'vue';

const progress = ref(75);
</script>
```

### 색상 테마 적용

```html
<template>
    <vs-progress
        :value="60"
        :max="100"
        color-scheme="green"
        label="파일 업로드 중..."
    />
</template>
```

## Props

| Prop          | Type                           | Default | Required | Description                      |
| ------------- | ------------------------------ | ------- | -------- | -------------------------------- |
| `colorScheme` | `ColorScheme`                  | -       | -        | 컴포넌트 색상 테마               |
| `styleSet`    | `string \| VsProgressStyleSet` | -       | -        | 커스텀 스타일 설정 객체          |
| `max`         | `number \| string`             | `100`   | -        | 진행률의 최댓값                  |
| `value`       | `number \| string`             | `0`     | -        | 현재 진행률 값                   |
| `label`       | `string`                       | `''`    | -        | 진행률과 함께 표시할 라벨 텍스트 |

## Types

```typescript
interface VsProgressStyleSet {
    variables?: {
        backgroundColor?: string;
        border?: string;
        borderRadius?: string;
        fontColor?: string;
        textShadow?: string;
        valueColor?: string;
    };
    component?: CSSProperties;
}
```

### StyleSet 사용 예시

```html
<template>
    <vs-progress
        :value="75"
        :max="100"
        label="업로드 중..."
        :style-set="{
            variables: {
                backgroundColor: '#f0f0f0',
                border: '2px solid #ddd',
                borderRadius: '8px',
                fontColor: '#333',
                textShadow: '0 0 4px rgba(0,0,0,0.3)',
                valueColor: '#4caf50',
            },
            component: {
                width: '400px',
                height: '24px',
            },
        }"
    />
</template>
```

## 특징

- **HTML5 기반**: 표준 `<progress>` 요소를 사용하여 접근성과 호환성 보장
- **자동 유효성 검사**: `max`와 `value` 값이 자동으로 검증되어 0 이상의 숫자만 허용
- **범위 제한**: `value`가 `max`를 초과하면 자동으로 `max` 값으로 제한
- **라벨 표시**: 진행률과 함께 설명 텍스트를 표시할 수 있는 라벨 기능
- **유연한 스타일링**: 진행률 바와 라벨의 개별적인 스타일 커스터마이징 지원
