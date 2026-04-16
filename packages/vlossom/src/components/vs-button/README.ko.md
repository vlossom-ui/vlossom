> For English documentation, see [README.md](./README.md).

# VsButton

다양한 시각적 변형과 내장 로딩 상태를 지원하는 다목적 버튼 컴포넌트입니다.

**Available Version**: 2.0.0+

## Feature

- 다양한 스타일 변형: `primary`, `outline`, `ghost`, `circle`
- 인라인 `VsLoading` 스피너를 사용한 내장 로딩 상태
- 5가지 크기 옵션: `xs`, `sm`, `md` (기본값), `lg`, `xl`
- 컨테이너 너비에 맞게 늘어나는 반응형 모드
- 접근성 포커스 관리 — `loading`이 활성화될 때 자동으로 포커스 제거

## Basic Usage

```html
<template>
    <vs-button @click="handleClick">클릭하세요</vs-button>
</template>
```

### Primary

```html
<template>
    <vs-button primary>Primary 버튼</vs-button>
</template>
```

### 로딩 상태

```html
<template>
    <vs-button :loading="isLoading" @click="submit">제출</vs-button>
</template>

<script setup lang="ts">
import { ref } from 'vue';
const isLoading = ref(false);

async function submit() {
    isLoading.value = true;
    await doSomething();
    isLoading.value = false;
}
</script>
```

### Outline과 Ghost

```html
<template>
    <vs-button outline>Outline</vs-button>
    <vs-button ghost>Ghost</vs-button>
</template>
```

### 크기

```html
<template>
    <vs-button size="xs">XS</vs-button>
    <vs-button size="sm">SM</vs-button>
    <vs-button>MD (기본값)</vs-button>
    <vs-button size="lg">LG</vs-button>
    <vs-button size="xl">XL</vs-button>
</template>
```

## Props

| Prop | Type | Default | Required | Description |
| ---- | ---- | ------- | -------- | ----------- |
| `colorScheme` | `ColorScheme` | | | 컴포넌트 색상 테마 |
| `styleSet` | `string \| VsButtonStyleSet` | | | 커스텀 스타일 세트 |
| `circle` | `boolean` | `false` | | 버튼을 원형으로 렌더링 |
| `disabled` | `boolean` | `false` | | 버튼 비활성화 |
| `ghost` | `boolean` | `false` | | 고스트(투명 배경) 스타일 적용 |
| `loading` | `boolean` | `false` | | 로딩 스피너를 표시하고 상호작용 비활성화 |
| `outline` | `boolean` | `false` | | 외곽선 스타일 적용 |
| `primary` | `boolean` | `false` | | Primary 색상 테마 적용 |
| `responsive` | `boolean` | `false` | | 컨테이너 너비에 맞게 늘림 |
| `size` | `'xs' \| 'sm' \| 'md' \| 'lg' \| 'xl'` | `'md'` | | 버튼 크기 |
| `type` | `'button' \| 'submit' \| 'reset'` | `'button'` | | HTML button type 속성 |

## Types

```typescript
interface VsButtonStyleSet {
    variables?: {
        padding?: string;
    };
    component?: CSSProperties;
    loading?: VsLoadingStyleSet;
}
```

> [!NOTE]
> `loading`은 `VsLoadingStyleSet`을 사용합니다. 자세한 내용은 [VsLoading 문서](../vs-loading/README.md)를 참고하세요.

### StyleSet 사용 예시

```html
<template>
    <vs-button
        :style-set="{
            variables: {
                padding: '0.5rem 2rem',
            },
            component: {
                borderRadius: '2rem',
                fontWeight: 'bold',
            },
            loading: {
                component: { width: '25%', height: '50%' },
            },
        }"
    >
        커스텀 버튼
    </vs-button>
</template>
```

## Events

| Event | Payload | Description |
| ----- | ------- | ----------- |

## Slots

| Slot | Description |
| ---- | ----------- |
| `default` | 버튼 라벨 콘텐츠 |

## Methods

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
